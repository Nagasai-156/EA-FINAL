'use client'

import { Lightbulb } from 'lucide-react'

interface HintsSectionProps {
  data: any
  onUpdate: (field: string, value: any) => void
}

export default function HintsSection({ data, onUpdate }: HintsSectionProps) {
  const updateHint = (index: number, value: string) => {
    const hints = [...data.hints]
    hints[index] = value
    onUpdate('hints', hints)
  }

  return (
    <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-6 h-6 text-accent-500" />
        <h2 className="text-xl font-display font-black text-black">Hints (Max 3)</h2>
      </div>
      
      <div className="space-y-4">
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Hint {index + 1}
            </label>
            <textarea
              value={data.hints[index] || ''}
              onChange={(e) => updateHint(index, e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold resize-none"
              placeholder={`Enter hint ${index + 1}...`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
