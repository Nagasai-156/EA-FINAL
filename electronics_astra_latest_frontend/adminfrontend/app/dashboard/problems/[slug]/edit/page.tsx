'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import ProblemForm from '@/components/ProblemForm'

export default function EditProblemPage() {
  const router = useRouter()
  const params = useParams()
  const [problem, setProblem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProblem()
  }, [params.slug])

  const fetchProblem = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/problems/${params.slug}`)
      if (!response.ok) throw new Error('Failed to fetch problem')
      const data = await response.json()
      
      // Transform data to match form structure
      const formData = {
        title: data.title,
        slug: data.slug,
        category: data.category,
        difficulty: data.difficulty,
        languages: data.languages,
        points: data.points,
        tags: data.tags || [],
        description: data.description,
        diagram_url: data.diagramUrl || '',
        diagram_upload_type: 'url',
        examples: data.examples || [],
        verilog: {
          studentTemplate: '',
          testbench: '',
          referenceSolution: ''
        },
        vhdl: {
          studentTemplate: '',
          testbench: '',
          referenceSolution: ''
        },
        explanation: data.explanation || '',
        hints: data.hints || ['', '', ''],
        settings: data.settings || { waveform: true, timeout: 3000 },
        isActive: data.isActive
      }

      // Populate code from files
      if (data.files) {
        data.files.forEach((file: any) => {
          const lang = file.language.toLowerCase()
          const type = file.type.toLowerCase()
          
          if (lang === 'verilog') {
            if (type === 'student_template') formData.verilog.studentTemplate = file.content || ''
            if (type === 'testbench') formData.verilog.testbench = file.content || ''
            if (type === 'reference_solution') formData.verilog.referenceSolution = file.content || ''
          } else if (lang === 'vhdl') {
            if (type === 'student_template') formData.vhdl.studentTemplate = file.content || ''
            if (type === 'testbench') formData.vhdl.testbench = file.content || ''
            if (type === 'reference_solution') formData.vhdl.referenceSolution = file.content || ''
          }
        })
      }

      setProblem(formData)
    } catch (error) {
      console.error('Error fetching problem:', error)
      alert('Failed to load problem')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (problemData: any, publish: boolean) => {
    setSaving(true)
    
    try {
      // Get problem ID first
      const problemsResponse = await fetch('http://localhost:4000/api/problems')
      const problems = await problemsResponse.json()
      const currentProblem = problems.find((p: any) => p.slug === params.slug)
      
      if (!currentProblem) throw new Error('Problem not found')

      // Update problem metadata
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

      const response = await fetch(`http://localhost:4000/api/problems/${currentProblem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problemPayload)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update problem')
      }
      
      setSaving(false)
      alert(`✅ Problem updated successfully!`)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating problem:', error)
      alert('Failed to update problem')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading problem...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!problem) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 font-semibold">Problem not found</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-display font-black text-black">Edit Problem</h1>
            <p className="text-gray-600 font-semibold mt-1">Update problem details</p>
          </div>
        </div>

        <ProblemForm 
          onSave={handleSave} 
          saving={saving}
          initialData={problem}
        />
      </div>
    </AdminLayout>
  )
}
