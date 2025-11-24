'use client'

import { useState, useRef, useEffect } from 'react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  className?: string
}

export default function CodeEditor({ value, onChange, language, className = '' }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineNumbers, setLineNumbers] = useState<number[]>([])

  useEffect(() => {
    const lines = value.split('\n').length
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1))
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const lineNumbersEl = document.querySelector('.line-numbers')
    if (lineNumbersEl) {
      lineNumbersEl.scrollTop = e.currentTarget.scrollTop
    }
  }

  return (
    <div className={`flex h-full ${className}`}>
      {/* Line Numbers */}
      <div className="line-numbers bg-gray-800 px-4 py-4 text-right border-r border-gray-700 overflow-hidden">
        {lineNumbers.map((num) => (
          <div key={num} className="text-gray-500 font-mono text-sm leading-6 select-none">
            {num}
          </div>
        ))}
      </div>

      {/* Code Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        className="flex-1 p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none leading-6 caret-white selection:bg-blue-500/30"
        spellCheck={false}
        style={{ 
          tabSize: 2,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
        }}
        placeholder={`// Write your ${language} code here...`}
      />
    </div>
  )
}