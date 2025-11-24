'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/AdminLayout'
import ProblemForm from '@/components/ProblemForm'

async function uploadCodeFile(problemId: string, type: string, language: string, content: string) {
  const formData = new FormData()
  formData.append('type', type)
  formData.append('language', language)
  formData.append('content', content)

  const response = await fetch(`http://localhost:4000/api/files/${problemId}`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to upload ${language} ${type}: ${error.error}`)
  }

  return response.json()
}

export default function CreateProblemPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const handleSave = async (problemData: any, publish: boolean) => {
    setSaving(true)
    
    try {
      // Step 1: Create problem
      const problemPayload = {
        title: problemData.title,
        slug: problemData.slug,
        category: problemData.category,
        difficulty: problemData.difficulty,
        languages: problemData.languages,
        points: problemData.points,
        tags: problemData.tags,
        description: problemData.description,
        diagram_url: problemData.diagram_url,
        examples: problemData.examples,
        explanation: problemData.explanation,
        hints: problemData.hints.filter((h: string) => h.trim() !== ''),
        settings: problemData.settings,
        isActive: publish
      }

      console.log('Step 1 - Creating problem:', problemPayload)
      
      // Create problem via API
      const response = await fetch('http://localhost:4000/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problemPayload)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create problem')
      }
      
      const { problemId } = await response.json()
      console.log('Problem created with ID:', problemId)

      // Step 2: Upload code files for each language
      const uploadPromises = []

      // Verilog files
      if (problemData.languages.includes('VERILOG')) {
        // Student Template
        uploadPromises.push(
          uploadCodeFile(problemId, 'STUDENT_TEMPLATE', 'VERILOG', problemData.verilog.studentTemplate)
        )
        // Testbench
        uploadPromises.push(
          uploadCodeFile(problemId, 'TESTBENCH', 'VERILOG', problemData.verilog.testbench)
        )
        // Reference Solution (optional)
        if (problemData.verilog.referenceSolution) {
          uploadPromises.push(
            uploadCodeFile(problemId, 'REFERENCE_SOLUTION', 'VERILOG', problemData.verilog.referenceSolution)
          )
        }
      }

      // VHDL files
      if (problemData.languages.includes('VHDL')) {
        // Student Template
        uploadPromises.push(
          uploadCodeFile(problemId, 'STUDENT_TEMPLATE', 'VHDL', problemData.vhdl.studentTemplate)
        )
        // Testbench
        uploadPromises.push(
          uploadCodeFile(problemId, 'TESTBENCH', 'VHDL', problemData.vhdl.testbench)
        )
        // Reference Solution (optional)
        if (problemData.vhdl.referenceSolution) {
          uploadPromises.push(
            uploadCodeFile(problemId, 'REFERENCE_SOLUTION', 'VHDL', problemData.vhdl.referenceSolution)
          )
        }
      }

      console.log('Step 2 - Uploading code files...')
      await Promise.all(uploadPromises)
      console.log('All files uploaded successfully!')

      // Store in localStorage for demo (backup)
      const problems = JSON.parse(localStorage.getItem('problems') || '[]')
      const newProblem = {
        ...problemPayload,
        id: problemId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      problems.push(newProblem)
      localStorage.setItem('problems', JSON.stringify(problems))
      
      setSaving(false)
      alert(`✅ Problem ${publish ? 'published' : 'saved as draft'} successfully!\n\nProblem ID: ${problemId}\nSlug: ${problemPayload.slug}`)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving problem:', error)
      alert('Failed to save problem. Please try again.')
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-black text-black">Create New Problem</h1>
          <p className="text-gray-600 font-semibold mt-1">Fill in the details to create a new problem</p>
        </div>

        <ProblemForm onSave={handleSave} saving={saving} />
      </div>
    </AdminLayout>
  )
}
