'use client'

import { useState } from 'react'
import { Upload, FileJson } from 'lucide-react'

interface TestcasesSectionProps {
  data: any
  onUpdate: (field: string, value: any) => void
}

export default function TestcasesSection({ data, onUpdate }: TestcasesSectionProps) {
  const [sampleJson, setSampleJson] = useState(JSON.stringify(data.sample_testcases, null, 2))
  const [allJson, setAllJson] = useState(JSON.stringify(data.all_testcases, null, 2))
  const [sampleError, setSampleError] = useState('')
  const [allError, setAllError] = useState('')

  const handleSampleChange = (value: string) => {
    setSampleJson(value)
    setSampleError('')
    try {
      const parsed = JSON.parse(value)
      onUpdate('sample_testcases', parsed)
    } catch (e) {
      setSampleError('Invalid JSON format')
    }
  }

  const handleAllChange = (value: string) => {
    setAllJson(value)
    setAllError('')
    try {
      const parsed = JSON.parse(value)
      onUpdate('all_testcases', parsed)
    } catch (e) {
      setAllError('Invalid JSON format')
    }
  }

  return (
    <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
      <h2 className="text-xl font-display font-black text-black mb-6">Testcases</h2>
      
      <div className="space-y-6">
        {/* Sample Testcases */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileJson className="w-5 h-5 text-primary-500" />
            <label className="text-sm font-bold text-gray-700">
              Sample Testcases (visible to users)
            </label>
          </div>
          <textarea
            value={sampleJson}
            onChange={(e) => handleSampleChange(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-mono text-sm resize-none bg-gray-50"
            placeholder='[{"din":34,"DIV_LOG2":2,"expected":9}]'
          />
          {sampleError && (
            <p className="text-red-600 text-sm font-semibold mt-1">{sampleError}</p>
          )}
        </div>

        {/* All Testcases */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileJson className="w-5 h-5 text-secondary-500" />
            <label className="text-sm font-bold text-gray-700">
              All Testcases (full test suite for grading)
            </label>
          </div>
          <textarea
            value={allJson}
            onChange={(e) => handleAllChange(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-mono text-sm resize-none bg-gray-50"
            placeholder='[{"din":0,"DIV_LOG2":0,"expected":0},{"din":1,"DIV_LOG2":0,"expected":1}]'
          />
          {allError && (
            <p className="text-red-600 text-sm font-semibold mt-1">{allError}</p>
          )}
        </div>

        <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-xl">
          <p className="text-sm text-blue-800 font-semibold">
            <strong>Format:</strong> Each testcase should be a JSON object with input fields matching your input signals and an "expected" field for the output.
          </p>
        </div>
      </div>
    </div>
  )
}
