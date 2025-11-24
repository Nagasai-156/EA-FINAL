'use client'

interface SolutionSectionProps {
  data: any
  onUpdate: (field: string, value: any) => void
}

export default function SolutionSection({ data, onUpdate }: SolutionSectionProps) {
  return (
    <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
      <h2 className="text-xl font-display font-black text-black mb-6">Solution</h2>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Solution Code / Explanation
        </label>
        <textarea
          value={data.solution}
          onChange={(e) => onUpdate('solution', e.target.value)}
          rows={12}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-mono text-sm resize-none bg-gray-50"
          placeholder="// pseudocode or actual solution&#10;// dout = min( (din + (1<<DIV_LOG2) - 1) >> DIV_LOG2, MAX_DOUT )"
        />
        <p className="text-sm text-gray-600 font-semibold mt-2">
          Provide the solution code, pseudocode, or detailed explanation
        </p>
      </div>
    </div>
  )
}
