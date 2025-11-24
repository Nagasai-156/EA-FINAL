'use client'

import { Lightbulb, BookOpen } from 'lucide-react'

interface SolutionExplanationSectionProps {
  data: any
  onUpdate: (field: string, value: any) => void
}

export default function SolutionExplanationSection({ data, onUpdate }: SolutionExplanationSectionProps) {
  const hints = data.hints || ['', '', '']

  const updateHint = (index: number, value: string) => {
    const newHints = [...hints]
    newHints[index] = value
    onUpdate('hints', newHints)
  }

  return (
    <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-accent-500" />
        <h2 className="text-xl font-display font-black text-black">Solution Explanation & Hints</h2>
      </div>

      <div className="space-y-6">
        {/* Admin Explanation */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Solution Explanation (Admin Only)
          </label>
          <p className="text-xs text-gray-600 mb-2 font-semibold">
            Explain how the solution works. This helps admins understand the design approach.
          </p>
          <textarea
            value={data.explanation || ''}
            onChange={(e) => onUpdate('explanation', e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold resize-none bg-green-50"
            placeholder="Explain the solution approach, key concepts, and design decisions..."
          />
        </div>

        {/* Hints */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <label className="block text-sm font-bold text-gray-700">
              Hints for Students (Optional, Max 3)
            </label>
          </div>
          <p className="text-xs text-gray-600 mb-3 font-semibold">
            Provide progressive hints to help students if they get stuck.
          </p>
          
          <div className="space-y-3">
            {hints.map((hint: string, index: number) => (
              <div key={index}>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Hint {index + 1}
                </label>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => updateHint(index, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold"
                  placeholder={
                    index === 0 
                      ? "e.g., Use the logical NOT operator (~)" 
                      : index === 1 
                      ? "e.g., Check your sensitivity list for combinational logic"
                      : "e.g., Remember that assign statements are for continuous assignment"
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
