'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Trash2, Code } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'

export default function ViewProblemPage() {
  const router = useRouter()
  const params = useParams()
  const [problem, setProblem] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProblem()
  }, [params.slug])

  const fetchProblem = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/problems/${params.slug}`)
      if (!response.ok) throw new Error('Failed to fetch problem')
      const data = await response.json()
      setProblem(data)
    } catch (error) {
      console.error('Error fetching problem:', error)
      alert('Failed to load problem')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this problem?')) return

    try {
      const response = await fetch(`http://localhost:4000/api/problems/${problem.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete')
      
      alert('Problem deleted successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting problem:', error)
      alert('Failed to delete problem')
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/dashboard/problems/${problem.slug}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-bold border-2 border-black hover:bg-green-600"
            >
              <Edit className="w-4 h-4" />
              Edit
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-bold border-2 border-black hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </motion.button>
          </div>
        </div>

        {/* Problem Info */}
        <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-display font-black text-black mb-2">{problem.title}</h1>
              <p className="text-gray-600 font-semibold">/{problem.slug}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${
                problem.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700 border-green-300' :
                problem.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                'bg-red-100 text-red-700 border-red-300'
              }`}>
                {problem.difficulty}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${
                problem.isActive ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}>
                {problem.isActive ? 'PUBLISHED' : 'DRAFT'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm font-bold text-gray-600">Category</p>
              <p className="text-lg font-black text-black">{problem.category}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-600">Points</p>
              <p className="text-lg font-black text-black">{problem.points}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-600">Languages</p>
              <p className="text-lg font-black text-black">{problem.languages.join(', ')}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-600">Files</p>
              <p className="text-lg font-black text-black">{problem.files?.length || 0}</p>
            </div>
          </div>

          {problem.tags && problem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg font-bold border-2 border-primary-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
          <h2 className="text-xl font-display font-black text-black mb-4">Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 font-semibold whitespace-pre-wrap">{problem.description}</p>
          </div>
          
          {problem.diagramUrl && (
            <div className="mt-4">
              <img src={problem.diagramUrl} alt="Diagram" className="max-w-full rounded-xl border-2 border-gray-300" />
            </div>
          )}
        </div>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
            <h2 className="text-xl font-display font-black text-black mb-4">Examples</h2>
            <div className="space-y-4">
              {problem.examples.map((example: any, index: number) => (
                <div key={index} className="p-4 bg-neutral-50 rounded-xl border-2 border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-2">Example {index + 1}</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-bold text-gray-700">Input:</span>
                      <span className="ml-2 font-mono text-sm">{example.input}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Output:</span>
                      <span className="ml-2 font-mono text-sm">{example.output}</span>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="font-bold text-gray-700">Explanation:</span>
                        <p className="mt-1 text-gray-600">{example.explanation}</p>
                      </div>
                    )}
                    {example.image && (
                      <img src={example.image} alt={`Example ${index + 1}`} className="mt-2 max-w-sm rounded-lg border-2 border-gray-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Files */}
        {problem.files && problem.files.length > 0 && (
          <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
            <h2 className="text-xl font-display font-black text-black mb-4">Code Files</h2>
            <div className="space-y-3">
              {problem.files.map((file: any) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-secondary-500" />
                    <div>
                      <p className="font-bold text-gray-800">{file.type.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-gray-600">{file.language}</p>
                    </div>
                  </div>
                  {file.url && (
                    <a
                      href={`http://localhost:4000${file.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-secondary-500 text-white rounded-lg font-bold text-sm hover:bg-secondary-600"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explanation & Hints */}
        {(problem.explanation || (problem.hints && problem.hints.length > 0)) && (
          <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
            <h2 className="text-xl font-display font-black text-black mb-4">Solution Guide</h2>
            
            {problem.explanation && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-800 mb-2">Explanation</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{problem.explanation}</p>
              </div>
            )}
            
            {problem.hints && problem.hints.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Hints</h3>
                <div className="space-y-2">
                  {problem.hints.map((hint: string, index: number) => (
                    hint && (
                      <div key={index} className="flex gap-2">
                        <span className="font-bold text-secondary-500">{index + 1}.</span>
                        <p className="text-gray-700">{hint}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
          <h2 className="text-xl font-display font-black text-black mb-4">Auto-Grading Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-bold text-gray-600">Waveform</p>
              <p className="text-lg font-black text-black">{problem.settings?.waveform ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-600">Timeout</p>
              <p className="text-lg font-black text-black">{problem.settings?.timeout || 3000}ms</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
