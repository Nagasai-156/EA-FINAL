import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { ensureDir, STORAGE_DIR } from './storage';
import prisma from '../prismaClient';

const writeFile = fs.promises.writeFile;
const readFile = fs.promises.readFile;
const copyFile = fs.promises.copyFile;

export type TestCaseResult = {
  name: string;
  status: 'PASS' | 'FAIL';
  expected?: string;
  actual?: string;
  error?: string;
};

export type RunnerResult = {
  status: 'passed' | 'failed' | 'compile_error' | 'runtime_error' | 'timeout';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testCases: TestCaseResult[];
  compileErrors?: string;
  simulationLog: string;
  log: string;
  waveformPath?: string | null;
  waveformData?: string | null;
};

function parseTestResults(log: string): TestCaseResult[] {
  const testCases: TestCaseResult[] = [];
  const lines = log.split(/\r?\n/);
  
  for (const line of lines) {
    let match = line.match(/TEST:(\w+)\s+STATUS:(PASS|FAIL)(?:\s+EXP:(\S+)\s+GOT:(\S+))?/i);
    if (match) {
      testCases.push({
        name: match[1],
        status: match[2].toUpperCase() as 'PASS' | 'FAIL',
        expected: match[3],
        actual: match[4]
      });
      continue;
    }
    
    match = line.match(/(\w+):(PASS|FAIL)(?:\s+EXP:(\S+)\s+GOT:(\S+))?/i);
    if (match) {
      testCases.push({
        name: match[1],
        status: match[2].toUpperCase() as 'PASS' | 'FAIL',
        expected: match[3],
        actual: match[4]
      });
    }
  }
  
  return testCases;
}

function createVerilogRunScript(): string {
  return `#!/bin/bash
set -e

echo "=== Compiling Verilog ==="
iverilog -o sim.out student.v testbench.v 2> compile.log
if [ $? -ne 0 ]; then
    echo "COMPILE_ERROR"
    cat compile.log
    exit 1
fi

echo "=== Running Simulation ==="
vvp sim.out 2>&1 | tee sim.log

echo "=== Simulation Complete ==="
exit 0
`;
}

function createVHDLRunScript(): string {
  return `#!/bin/bash
set -e

echo "=== Analyzing VHDL Files ==="
ghdl -a student.vhd 2> compile.log
if [ $? -ne 0 ]; then
    echo "COMPILE_ERROR"
    cat compile.log
    exit 1
fi

ghdl -a testbench.vhd 2>> compile.log
if [ $? -ne 0 ]; then
    echo "COMPILE_ERROR"
    cat compile.log
    exit 1
fi

echo "=== Elaborating Design ==="
ghdl -e tb 2>> compile.log
if [ $? -ne 0 ]; then
    echo "COMPILE_ERROR"
    cat compile.log
    exit 1
fi

echo "=== Running Simulation ==="
ghdl -r tb --vcd=wave.vcd 2>&1 | tee sim.log

echo "=== Simulation Complete ==="
exit 0
`;
}

async function executeInDocker(
  jobDir: string,
  timeoutMs: number = 10000
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const dockerArgs = [
      'run',
      '--rm',
      '-v', `${jobDir}:/job`,
      '-w', '/job',
      '--network', 'none',
      '--memory', '256m',
      '--cpus', '0.5',
      'astra-runner:latest',
      '/bin/bash', '/job/run.sh'
    ];

    const proc = spawn('docker', dockerArgs);
    
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGKILL');
    }, timeoutMs);

    proc.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    proc.on('close', (code: number | null) => {
      clearTimeout(timeout);
      
      if (timedOut) {
        resolve({
          stdout: stdout + '\n[TIMEOUT] Execution exceeded time limit',
          stderr: stderr + '\n[TIMEOUT]',
          exitCode: 124
        });
      } else {
        resolve({
          stdout,
          stderr,
          exitCode: code || 0
        });
      }
    });

    proc.on('error', (err: Error) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

export async function runSubmissionJob(options: {
  submissionId: string;
  problemId: string;
  language: 'VERILOG' | 'VHDL';
  studentCode: string;
  testbenchContent?: string;
  timeoutMs?: number;
}): Promise<RunnerResult> {
  const {
    submissionId,
    problemId,
    language,
    studentCode,
    testbenchContent,
    timeoutMs = 10000
  } = options;

  const jobDir = path.resolve(STORAGE_DIR, 'jobs', submissionId);
  await ensureDir(jobDir);

  try {
    const ext = language === 'VHDL' ? 'vhd' : 'v';
    const studentFile = `student.${ext}`;
    const testbenchFile = `testbench.${ext}`;

    await writeFile(path.join(jobDir, studentFile), studentCode, 'utf8');

    let tbContent = testbenchContent;
    if (!tbContent) {
      const files = await prisma.problemFile.findMany({
        where: { problemId, language, type: 'TESTBENCH' }
      });
      
      if (!files || files.length === 0) {
        throw new Error('No testbench found for this problem');
      }
      
      tbContent = files[0].content || '';
      if (!tbContent && files[0].filename) {
        const tbPath = path.resolve(process.cwd(), 'uploads', files[0].filename);
        tbContent = await readFile(tbPath, 'utf8');
      }
    }

    if (!tbContent) {
      throw new Error('Testbench content is empty');
    }

    await writeFile(path.join(jobDir, testbenchFile), tbContent, 'utf8');

    const runScript = language === 'VHDL' ? createVHDLRunScript() : createVerilogRunScript();
    await writeFile(path.join(jobDir, 'run.sh'), runScript, 'utf8');

    const execResult = await executeInDocker(jobDir, timeoutMs);

    let compileLog = '';
    let simLog = '';
    
    try {
      compileLog = await readFile(path.join(jobDir, 'compile.log'), 'utf8');
    } catch (e) {
      // File might not exist
    }

    try {
      simLog = await readFile(path.join(jobDir, 'sim.log'), 'utf8');
    } catch (e) {
      simLog = execResult.stdout;
    }

    if (execResult.exitCode === 124) {
      return {
        status: 'timeout',
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        testCases: [],
        simulationLog: simLog,
        log: 'Execution timeout',
        waveformPath: null,
        waveformData: null
      };
    }

    if (execResult.stdout.includes('COMPILE_ERROR') || execResult.exitCode !== 0) {
      return {
        status: 'compile_error',
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        testCases: [],
        compileErrors: compileLog || execResult.stderr,
        simulationLog: '',
        log: compileLog || execResult.stderr,
        waveformPath: null,
        waveformData: null
      };
    }

    const testCases = parseTestResults(simLog);
    const passedTests = testCases.filter(tc => tc.status === 'PASS').length;
    const failedTests = testCases.filter(tc => tc.status === 'FAIL').length;
    const totalTests = testCases.length;

    let waveformPath: string | null = null;
    
    const vcdPath = path.join(jobDir, 'wave.vcd');
    if (fs.existsSync(vcdPath)) {
      const waveDir = path.join(STORAGE_DIR, 'waves');
      await ensureDir(waveDir);
      const destPath = path.join(waveDir, `${submissionId}.vcd`);
      await copyFile(vcdPath, destPath);
      waveformPath = `/storage/waves/${submissionId}.vcd`;
    }

    let status: RunnerResult['status'] = 'passed';
    if (failedTests > 0) {
      status = 'failed';
    } else if (totalTests === 0) {
      status = 'runtime_error';
    }

    return {
      status,
      totalTests,
      passedTests,
      failedTests,
      testCases,
      simulationLog: simLog,
      log: simLog,
      waveformPath,
      waveformData: null
    };

  } catch (error: any) {
    return {
      status: 'runtime_error',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      testCases: [],
      simulationLog: '',
      log: `Runtime error: ${error.message}`,
      waveformPath: null,
      waveformData: null
    };
  }
}
