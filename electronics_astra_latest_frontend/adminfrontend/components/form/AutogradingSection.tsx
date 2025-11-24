'use client'

import { Settings } from 'lucide-react'

interface AutogradingSectionProps {
  data: any
  onUpdate: (field: string, value: any) => void
}

export default function AutogradingSection({ data, onUpdate }: AutogradingSectionProps) {
  const settings = data.settings || { waveform: true, timeout: 3000 }

  const updateSettings = (key: string, value: any) => {
    onUpdate('settings', { ...settings, [key]: value })
  }

  return (
    <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-secondary-500" />
        <h2 className="text-xl font-display font-black text-black">Auto-Grading Settings</h2>
      </div>

      <div className="space-y-4">
        {/* Enable Waveform */}
        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-bold text-gray-700">Enable Waveform Output</label>
            <p className="text-xs text-gray-600 mt-1">Generate VCD waveform files for debugging</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.waveform}
              onChange={(e) => updateSettings('waveform', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary-500"></div>
          </label>
        </div>

        {/* Timeout */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Timeout (milliseconds)
          </label>
          <input
            type="number"
            value={settings.timeout}
            onChange={(e) => updateSettings('timeout', parseInt(e.target.value) || 3000)}
            min="1000"
            max="10000"
            step="1000"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold"
            placeholder="3000"
          />
          <p className="text-xs text-gray-600 mt-1">Maximum execution time for testbench (1000-10000ms)</p>
        </div>

        {/* Runner Info */}
        <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <p className="text-sm font-bold text-blue-900 mb-2">HDL Runner (Auto-detected)</p>
          <div className="space-y-1">
            {data.languages?.includes('VERILOG') && (
              <p className="text-xs text-blue-700">🔹 Verilog → Icarus Verilog (iverilog)</p>
            )}
            {data.languages?.includes('VHDL') && (
              <p className="text-xs text-blue-700">🔹 VHDL → GHDL</p>
            )}
            {(!data.languages || data.languages.length === 0) && (
              <p className="text-xs text-gray-500">Select language(s) in metadata section</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
