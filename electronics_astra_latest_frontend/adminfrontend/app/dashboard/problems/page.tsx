'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Edit, Trash2, Eye, FileText } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'

interface Problem {
  id: string
  title: string
  slug: string
  difficulty: 'beginner' | 'medium' | 'hard'
  tags: string[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export default function ProblemsPage() {
  const router = useRouter()
  const [problems, setProblems] = useState<Problem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/problems')
      if (!response.ok) throw new Error('Failed to fetch problems')
      const data = await response.json()
      
      // Transform backend data to match frontend interface
      const transformedProblems = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty.toLowerCase(),
        tags: p.tags || [],
        is_published: p.isActive,
        created_at: p.createdAt,
        updated_at: p.createdAt
      }))
      
      setProblems(transformedProblems)
    } catch (error) {
      console.error('Error fetching problems:', error)
      alert('Failed to load problems')
    }
  }

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = filterDifficulty === 'all' || problem.difficulty === filterDifficulty
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && problem.is_published) ||
                         (filterStatus === 'draft' && !problem.is_published)
    return matchesSearch && matchesDifficulty && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return

    try {
      const response = await fetch(`http://localhost:4000/api/problems/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete')
      
      alert('Problem deleted successfully!')
      fetchProblems() // Refresh the list
    } catch (error) {
      console.error('Error deleting problem:', error)
      alert('Failed to delete problem')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'hard': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black text-black">All Problems</h1>
            <p className="text-gray-600 font-semibold mt-1">Manage and organize your problems</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/dashboard/problems/create')}
            className="flex items-center gap-2 px-6 py-3 bg-secondary-500 text-white rounded-xl font-black border-3 border-black shadow-button hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Problem
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-bold bg-white"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-bold bg-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-white rounded-2xl border-3 border-black shadow-card overflow-hidden">
          <div className="p-6 border-b-3 border-black">
            <h2 className="text-xl font-display font-black text-black">
              Problems ({filteredProblems.length})
            </h2>
          </div>
          
          <div className="divide-y-2 divide-gray-200">
            {filteredProblems.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-semibold mb-4">No problems found</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/dashboard/problems/create')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-500 text-white rounded-xl font-black border-3 border-black shadow-button"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Problem
                </motion.button>
              </div>
            ) : (
              filteredProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-black truncate">{problem.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty.toUpperCase()}
                        </span>
                        {problem.is_published ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border-2 border-green-300">
                            PUBLISHED
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border-2 border-gray-300">
                            DRAFT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 font-semibold mb-3">/{problem.slug}</p>
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold border border-primary-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/dashboard/problems/${problem.slug}/view`)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/dashboard/problems/${problem.slug}/edit`)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5 text-green-600" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(problem.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
