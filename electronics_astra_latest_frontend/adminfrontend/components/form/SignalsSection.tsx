'use client'

import { Plus, Trash2 } from 'lucide-react'

interface SignalsSectionProps {
  data: any
  onUpdate: (field: string, value: any) => void
}

export default function SignalsSection({ data, onUpdate }: SignalsSectionProps) {
  const addSignal = (type: 'input' | 'output') => {
    const field = type === 'input' ? 'input_signals' : 'output_signals'
    onUpdate(field, [...data[field], { name: '', type: 'uint', width: 8, description: '' }])
  }

  const removeSignal = (type: 'input' | 'output', index: number) => {
    const field = type === 'input' ? 'input_signals' : 'output_signals'
    onUpdate(field, data[field].filter((_: any, i: number) => i !== index))
  }

  const updateSignal = (type: 'input' | 'output', index: number, key: string, value: any) => {
    const field = type === 'input' ? 'input_signals' : 'output_signals'
    const signals = [...data[field]]
    signals[index] = { ...signals[index], [key]: value }
    onUpdate(field, signals)
  }

  return (
    <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
      <h2 className="text-xl font-display font-black text-black mb-6">Input/Output Signals</h2>
      
      <div className="space-y-6">
        {/* Input Signals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Input Signals</h3>
            <button
              type="button"
              onClick={() => addSignal('input')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-bold border-2 border-black hover:bg-primary-600"
            >
              <Plus className="w-4 h-4" />
              Add Input
            </button>
          </div>
          <div className="space-y-3">
            {data.input_signals.map((signal: any, index: number) => (
              <div key={index} className="p-4 bg-neutral-50 rounded-xl border-2 border-gray-200">
                <div className="flex gap-3 items-start mb-3">
                  <input
                    type="text"
                    value={signal.name}
                    onChange={(e) => updateSignal('input', index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none font-semibold"
                    placeholder="Signal name (e.g., din)"
                  />
                  <select
                    value={signal.type}
                    onChange={(e) => updateSignal('input', index, 'type', e.target.value)}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none font-bold bg-white"
                  >
                    <option value="uint">uint</option>
                    <option value="int">int</option>
                    <option value="bool">bool</option>
                  </select>
                  <input
                    type="number"
                    value={signal.width}
                    onChange={(e) => updateSignal('input', index, 'width', parseInt(e.target.value))}
                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none font-semibold"
                    placeholder="Width"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => removeSignal('input', index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={signal.description || ''}
                  onChange={(e) => updateSignal('input', index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none font-semibold text-sm"
                  placeholder="Description (e.g., Input data value to be divided)"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Output Signals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Output Signals</h3>
            <button
              type="button"
              onClick={() => addSignal('output')}
              className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg font-bold border-2 border-black hover:bg-secondary-600"
            >
              <Plus className="w-4 h-4" />
              Add Output
            </button>
          </div>
          <div className="space-y-3">
            {data.output_signals.map((signal: any, index: number) => (
              <div key={index} className="p-4 bg-neutral-50 rounded-xl border-2 border-gray-200">
                <div className="flex gap-3 items-start mb-3">
                  <input
                    type="text"
                    value={signal.name}
                    onChange={(e) => updateSignal('output', index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none font-semibold"
                    placeholder="Signal name (e.g., dout)"
                  />
                  <select
                    value={signal.type}
                    onChange={(e) => updateSignal('output', index, 'type', e.target.value)}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none font-bold bg-white"
                  >
                    <option value="uint">uint</option>
                    <option value="int">int</option>
                    <option value="bool">bool</option>
                  </select>
                  <input
                    type="number"
                    value={signal.width}
                    onChange={(e) => updateSignal('output', index, 'width', parseInt(e.target.value))}
                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none font-semibold"
                    placeholder="Width"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => removeSignal('output', index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={signal.description || ''}
                  onChange={(e) => updateSignal('output', index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none font-semibold text-sm"
                  placeholder="Description (e.g., Divided and rounded output value)"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
