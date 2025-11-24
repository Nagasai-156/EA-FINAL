'use client'

import { Plus, Trash2, X } from 'lucide-react'

interface ExamplesSectionProps {
  data: any
  onUpdate: (field: string, value: any) => void
}

export default function ExamplesSection({ data, onUpdate }: ExamplesSectionProps) {
  const addExample = () => {
    onUpdate('examples', [...data.examples, { id: data.examples.length + 1, input: '', output: '', explanation: '' }])
  }

  const removeExample = (index: number) => {
    onUpdate('examples', data.examples.filter((_: any, i: number) => i !== index))
  }

  const updateExample = (index: number, key: string, value: any) => {
    const examples = [...data.examples]
    examples[index] = { ...examples[index], [key]: value }
    onUpdate('examples', examples)
  }

  return (
    <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-black text-black">Examples</h2>
        <button
          type="button"
          onClick={addExample}
          className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-black rounded-lg font-bold border-2 border-black hover:bg-accent-600"
        >
          <Plus className="w-4 h-4" />
          Add Example
        </button>
      </div>
      
      <div className="space-y-4">
        {data.examples.map((example: any, index: number) => (
          <div key={index} className="p-4 bg-neutral-50 rounded-xl border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">Example {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeExample(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Input</label>
                <input
                  type="text"
                  value={example.input}
                  onChange={(e) => updateExample(index, 'input', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none font-mono text-sm"
                  placeholder="din = 34, DIV_LOG2 = 2"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Output</label>
                <input
                  type="text"
                  value={example.output}
                  onChange={(e) => updateExample(index, 'output', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none font-mono text-sm"
                  placeholder="dout = 9"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Explanation</label>
                <textarea
                  value={example.explanation}
                  onChange={(e) => updateExample(index, 'explanation', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none font-semibold text-sm resize-none"
                  placeholder="34 ÷ 2^2 = 8.5 → rounded up → 9"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        updateExample(index, 'image', reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:outline-none text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:font-bold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                />
                {example.image && (
                  <div className="mt-2 relative">
                    <img 
                      src={example.image} 
                      alt={`Example ${index + 1}`} 
                      className="max-w-full h-auto max-h-32 rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => updateExample(index, 'image', null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
