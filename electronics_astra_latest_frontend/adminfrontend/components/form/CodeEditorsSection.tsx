'use client'

import { useState } from 'react'
import { Code, Eye, EyeOff } from 'lucide-react'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface CodeEditorsSectionProps {
  data: any
  onUpdate: (field: string, value: any) => void
}

export default function CodeEditorsSection({ data, onUpdate }: CodeEditorsSectionProps) {
  const [showTestbench, setShowTestbench] = useState(false)
  const [showReference, setShowReference] = useState(false)

  const getPlaceholder = (type: 'template' | 'testbench' | 'reference', isVerilog: boolean) => {
    
    if (type === 'template') {
      return isVerilog 
        ? `module not_gate(
  input a,
  output y
);
  // Write your logic here
  
endmodule`
        : `entity not_gate is
  port(
    a : in std_logic;
    y : out std_logic
  );
end not_gate;

architecture rtl of not_gate is
begin
  -- Write your logic here
  
end rtl;`
    }
    
    if (type === 'testbench') {
      return isVerilog
        ? `module tb;
  reg a;
  wire y;
  
  not_gate uut(.a(a), .y(y));
  
  initial begin
    $dumpfile("wave.vcd");
    $dumpvars(0, tb);
    
    // Test Case 1
    a = 0; #10;
    if (y !== 1) 
      $display("TEST:TC1 STATUS:FAIL EXP:1 GOT:%b", y);
    else 
      $display("TEST:TC1 STATUS:PASS");
    
    // Test Case 2
    a = 1; #10;
    if (y !== 0) 
      $display("TEST:TC2 STATUS:FAIL EXP:0 GOT:%b", y);
    else 
      $display("TEST:TC2 STATUS:PASS");
    
    $finish;
  end
endmodule`
        : `library ieee;
use ieee.std_logic_1164.all;

entity tb is
end tb;

architecture behavior of tb is
  signal a, y : std_logic;
begin
  uut: entity work.not_gate port map(a => a, y => y);
  
  process
  begin
    -- Test Case 1
    a <= '0'; wait for 10 ns;
    if y /= '1' then
      report "TEST:TC1 STATUS:FAIL";
    else
      report "TEST:TC1 STATUS:PASS";
    end if;
    
    -- Test Case 2
    a <= '1'; wait for 10 ns;
    if y /= '0' then
      report "TEST:TC2 STATUS:FAIL";
    else
      report "TEST:TC2 STATUS:PASS";
    end if;
    
    wait;
  end process;
end behavior;`
    }
    
    // reference
    return isVerilog
      ? `assign y = ~a;`
      : `y <= not a;`
  }

  const selectedLanguages = data.languages || []
  const hasVerilog = selectedLanguages.includes('VERILOG')
  const hasVHDL = selectedLanguages.includes('VHDL')

  if (!hasVerilog && !hasVHDL) {
    return (
      <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-6 h-6 text-secondary-500" />
          <h2 className="text-xl font-display font-black text-black">HDL Code Editors</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p className="font-semibold">Please select at least one language (Verilog or VHDL) in the metadata section above.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Code className="w-6 h-6 text-secondary-500" />
        <h2 className="text-xl font-display font-black text-black">HDL Code Editors</h2>
      </div>

      <div className="space-y-8">
        {/* VERILOG EDITORS */}
        {hasVerilog && (
          <div className="border-4 border-blue-300 rounded-2xl p-6 bg-blue-50">
            <h3 className="text-lg font-display font-black text-blue-900 mb-4">🔹 VERILOG</h3>
            
            <div className="space-y-6">
              {/* Verilog Student Template */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Student Template Code <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-2 font-semibold">
                  Visible to students. Include only the module skeleton.
                </p>
                <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
                  <MonacoEditor
                    height="300px"
                    language="verilog"
                    theme="vs-light"
                    value={data.verilog?.studentTemplate || getPlaceholder('template', true)}
                    onChange={(value) => onUpdate('verilog', { ...data.verilog, studentTemplate: value })}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                  />
                </div>
              </div>

              {/* Verilog Testbench */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Hidden Testbench Code <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTestbench(!showTestbench)}
                    className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-gray-600 hover:text-gray-900 border-2 border-gray-300 rounded-lg hover:border-gray-400"
                  >
                    {showTestbench ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showTestbench ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-2 font-semibold">
                  Admin only. Must print PASS/FAIL for each test case.
                </p>
                {showTestbench && (
                  <div className="border-2 border-yellow-400 rounded-xl overflow-hidden bg-yellow-50">
                    <MonacoEditor
                      height="400px"
                      language="verilog"
                      theme="vs-light"
                      value={data.verilog?.testbench || getPlaceholder('testbench', true)}
                      onChange={(value) => onUpdate('verilog', { ...data.verilog, testbench: value })}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Verilog Reference */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Reference Solution (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowReference(!showReference)}
                    className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-gray-600 hover:text-gray-900 border-2 border-gray-300 rounded-lg hover:border-gray-400"
                  >
                    {showReference ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showReference ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-2 font-semibold">
                  Admin only. Reference implementation for internal use.
                </p>
                {showReference && (
                  <div className="border-2 border-green-400 rounded-xl overflow-hidden bg-green-50">
                    <MonacoEditor
                      height="200px"
                      language="verilog"
                      theme="vs-light"
                      value={data.verilog?.referenceSolution || getPlaceholder('reference', true)}
                      onChange={(value) => onUpdate('verilog', { ...data.verilog, referenceSolution: value })}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VHDL EDITORS */}
        {hasVHDL && (
          <div className="border-4 border-purple-300 rounded-2xl p-6 bg-purple-50">
            <h3 className="text-lg font-display font-black text-purple-900 mb-4">🔹 VHDL</h3>
            
            <div className="space-y-6">
              {/* VHDL Student Template */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Student Template Code <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-2 font-semibold">
                  Visible to students. Include only the entity/architecture skeleton.
                </p>
                <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
                  <MonacoEditor
                    height="300px"
                    language="vhdl"
                    theme="vs-light"
                    value={data.vhdl?.studentTemplate || getPlaceholder('template', false)}
                    onChange={(value) => onUpdate('vhdl', { ...data.vhdl, studentTemplate: value })}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                  />
                </div>
              </div>

              {/* VHDL Testbench */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Hidden Testbench Code <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTestbench(!showTestbench)}
                    className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-gray-600 hover:text-gray-900 border-2 border-gray-300 rounded-lg hover:border-gray-400"
                  >
                    {showTestbench ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showTestbench ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-2 font-semibold">
                  Admin only. Must print PASS/FAIL for each test case.
                </p>
                {showTestbench && (
                  <div className="border-2 border-yellow-400 rounded-xl overflow-hidden bg-yellow-50">
                    <MonacoEditor
                      height="400px"
                      language="vhdl"
                      theme="vs-light"
                      value={data.vhdl?.testbench || getPlaceholder('testbench', false)}
                      onChange={(value) => onUpdate('vhdl', { ...data.vhdl, testbench: value })}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                      }}
                    />
                  </div>
                )}
              </div>

              {/* VHDL Reference */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Reference Solution (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowReference(!showReference)}
                    className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-gray-600 hover:text-gray-900 border-2 border-gray-300 rounded-lg hover:border-gray-400"
                  >
                    {showReference ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showReference ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-2 font-semibold">
                  Admin only. Reference implementation for internal use.
                </p>
                {showReference && (
                  <div className="border-2 border-green-400 rounded-xl overflow-hidden bg-green-50">
                    <MonacoEditor
                      height="200px"
                      language="vhdl"
                      theme="vs-light"
                      value={data.vhdl?.referenceSolution || getPlaceholder('reference', false)}
                      onChange={(value) => onUpdate('vhdl', { ...data.vhdl, referenceSolution: value })}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
