import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { runSubmissionJob } from '../services/runner';

export async function getSubmissionsByProblem(req: Request, res: Response) {
  try {
    const { problemId } = req.params;
    
    const submissions = await prisma.submission.findMany({
      where: { problemId },
      include: {
        result: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return res.json(submissions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch submissions' });
  }
}

export async function submitSolution(req: Request, res: Response) {
  try {
    const { problemId, language, code, timeoutMs } = req.body;
    
    if (!problemId || !language || !code) {
      return res.status(400).json({ error: 'problemId, language and code required' });
    }
    
    if (!['VERILOG','VHDL'].includes(language)) {
      return res.status(400).json({ error: 'invalid language' });
    }

    const submission = await prisma.submission.create({
      data: {
        problemId,
        code,
        language
      }
    });

    const submissionId = submission.id;

    await prisma.submission.update({ 
      where: { id: submissionId }, 
      data: { status: 'RUNNING' } 
    });

    const runnerResult = await runSubmissionJob({
      submissionId,
      problemId,
      language: language as 'VERILOG'|'VHDL',
      studentCode: code,
      timeoutMs: timeoutMs ? Number(timeoutMs) : 5000
    });

    const result = await prisma.submissionResult.create({
      data: {
        submissionId,
        totalTests: runnerResult.totalTests,
        passedTests: runnerResult.passedTests,
        failedTests: runnerResult.failedTests,
        log: runnerResult.log,
        waveformPath: runnerResult.waveformPath ?? null
      }
    });

    const finalStatus = runnerResult.failedTests === 0 && runnerResult.totalTests > 0 ? 'PASSED' : 'FAILED';
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: finalStatus }
    });

    return res.json({
      submissionId,
      status: finalStatus,
      totalTests: runnerResult.totalTests,
      passedTests: runnerResult.passedTests,
      failedTests: runnerResult.failedTests,
      log: runnerResult.log,
      waveform: runnerResult.waveformPath
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'submission failed', details: String(err) });
  }
}
