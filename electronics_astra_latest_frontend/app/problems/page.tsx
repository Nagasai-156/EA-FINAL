'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, Zap, Clock, CheckCircle, Star, Flame, Calendar, Circle, ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { getPublishedProblems } from '@/lib/api'

// Mock data for fallback
const mockProblems = [
  // VLSI Problems
  {
    id: 1,
    title: 'Basic Logic Gates',
    difficulty: 'Beginner',
    category: 'VLSI',
    tags: ['Verilog', 'Logic Design'],
    status: 'solved',
    time: '15 min',
    solvers: 1234,
    points: 10
  },
  {
    id: 2,
    title: 'Full Adder Circuit',
    difficulty: 'Beginner',
    category: 'VLSI',
    tags: ['VHDL', 'Arithmetic'],
    status: 'solved',
    time: '20 min',
    solvers: 987,
    points: 15
  },
  {
    id: 3,
    title: '4-bit ALU Design',
    difficulty: 'Intermediate',
    category: 'VLSI',
    tags: ['Verilog', 'ALU'],
    status: 'partial',
    time: '45 min',
    solvers: 543,
    points: 30
  },
  {
    id: 4,
    title: 'Sequential Counter',
    difficulty: 'Intermediate',
    category: 'VLSI',
    tags: ['VHDL', 'Sequential'],
    status: 'unsolved',
    time: '30 min',
    solvers: 678,
    points: 25
  },
  {
    id: 5,
    title: 'Pipelined Processor',
    difficulty: 'Expert',
    category: 'VLSI',
    tags: ['Verilog', 'Architecture'],
    status: 'unsolved',
    time: '120 min',
    solvers: 156,
    points: 50
  },
  {
    id: 6,
    title: 'Cache Controller',
    difficulty: 'Expert',
    category: 'VLSI',
    tags: ['VHDL', 'Memory'],
    status: 'unsolved',
    time: '90 min',
    solvers: 234,
    points: 45
  },
  {
    id: 7,
    title: 'Multiplexer Design',
    difficulty: 'Beginner',
    category: 'VLSI',
    tags: ['Verilog', 'Combinational'],
    status: 'unsolved',
    time: '20 min',
    solvers: 892,
    points: 12
  },
  {
    id: 8,
    title: 'Flip-Flop Implementation',
    difficulty: 'Beginner',
    category: 'VLSI',
    tags: ['VHDL', 'Sequential'],
    status: 'unsolved',
    time: '25 min',
    solvers: 756,
    points: 15
  },

  // Embedded Problems
  {
    id: 9,
    title: 'UART Protocol',
    difficulty: 'Intermediate',
    category: 'Embedded',
    tags: ['Communication', 'Protocol'],
    status: 'unsolved',
    time: '60 min',
    solvers: 567,
    points: 35
  },
  {
    id: 10,
    title: 'I2C Master Controller',
    difficulty: 'Intermediate',
    category: 'Embedded',
    tags: ['I2C', 'Communication'],
    status: 'partial',
    time: '55 min',
    solvers: 423,
    points: 32
  },
  {
    id: 11,
    title: 'GPIO Configuration',
    difficulty: 'Beginner',
    category: 'Embedded',
    tags: ['GPIO', 'Basics'],
    status: 'solved',
    time: '20 min',
    solvers: 892,
    points: 10
  },
  {
    id: 12,
    title: 'Interrupt Handler',
    difficulty: 'Expert',
    category: 'Embedded',
    tags: ['Interrupts', 'Real-time'],
    status: 'unsolved',
    time: '75 min',
    solvers: 234,
    points: 48
  },
  {
    id: 13,
    title: 'SPI Communication',
    difficulty: 'Intermediate',
    category: 'Embedded',
    tags: ['SPI', 'Protocol'],
    status: 'unsolved',
    time: '50 min',
    solvers: 445,
    points: 30
  },
  {
    id: 14,
    title: 'PWM Generator',
    difficulty: 'Beginner',
    category: 'Embedded',
    tags: ['PWM', 'Timers'],
    status: 'unsolved',
    time: '30 min',
    solvers: 678,
    points: 18
  },

  // DSP Problems
  {
    id: 15,
    title: 'FIR Filter Design',
    difficulty: 'Intermediate',
    category: 'DSP',
    tags: ['Filters', 'Signal Processing'],
    status: 'partial',
    time: '50 min',
    solvers: 456,
    points: 35
  },
  {
    id: 16,
    title: 'FFT Implementation',
    difficulty: 'Expert',
    category: 'DSP',
    tags: ['FFT', 'Transform'],
    status: 'unsolved',
    time: '90 min',
    solvers: 189,
    points: 50
  },
  {
    id: 17,
    title: 'Digital Oscillator',
    difficulty: 'Beginner',
    category: 'DSP',
    tags: ['Oscillator', 'Waveform'],
    status: 'unsolved',
    time: '30 min',
    solvers: 678,
    points: 15
  },
  {
    id: 18,
    title: 'IIR Filter Design',
    difficulty: 'Intermediate',
    category: 'DSP',
    tags: ['Filters', 'IIR'],
    status: 'unsolved',
    time: '55 min',
    solvers: 345,
    points: 32
  },
  {
    id: 19,
    title: 'Convolution Algorithm',
    difficulty: 'Intermediate',
    category: 'DSP',
    tags: ['Convolution', 'Processing'],
    status: 'unsolved',
    time: '45 min',
    solvers: 398,
    points: 28
  },
  {
    id: 20,
    title: 'Adaptive Filter',
    difficulty: 'Expert',
    category: 'DSP',
    tags: ['Adaptive', 'Filters'],
    status: 'unsolved',
    time: '100 min',
    solvers: 167,
    points: 55
  },

  // Software Problems
  {
    id: 21,
    title: 'FIFO Buffer Implementation',
    difficulty: 'Intermediate',
    category: 'Software',
    tags: ['Data Structures', 'Memory'],
    status: 'unsolved',
    time: '40 min',
    solvers: 789,
    points: 28
  },
  {
    id: 22,
    title: 'Circular Buffer',
    difficulty: 'Beginner',
    category: 'Software',
    tags: ['Buffer', 'Queue'],
    status: 'solved',
    time: '25 min',
    solvers: 1045,
    points: 12
  },
  {
    id: 23,
    title: 'State Machine Design',
    difficulty: 'Intermediate',
    category: 'Software',
    tags: ['FSM', 'Design Pattern'],
    status: 'partial',
    time: '45 min',
    solvers: 567,
    points: 30
  },
  {
    id: 24,
    title: 'Memory Pool Allocator',
    difficulty: 'Expert',
    category: 'Software',
    tags: ['Memory', 'Optimization'],
    status: 'unsolved',
    time: '80 min',
    solvers: 198,
    points: 48
  },
  {
    id: 25,
    title: 'Binary Search Tree',
    difficulty: 'Intermediate',
    category: 'Software',
    tags: ['Trees', 'Data Structures'],
    status: 'unsolved',
    time: '50 min',
    solvers: 634,
    points: 32
  },
  {
    id: 26,
    title: 'Hash Table Implementation',
    difficulty: 'Intermediate',
    category: 'Software',
    tags: ['Hash', 'Data Structures'],
    status: 'unsolved',
    time: '55 min',
    solvers: 512,
    points: 35
  },
]

const difficultyConfig = {
  BEGINNER: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-400',
    label: 'Beginner'
  },
  MEDIUM: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-400',
    label: 'Medium'
  },
  HARD: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-400',
    label: 'Hard'
  },
  // Legacy support
  Beginner: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-400',
    label: 'Beginner'
  },
  Intermediate: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-400',
    label: 'Medium'
  },
  Expert: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-400',
    label: 'Hard'
  },
}

const categoryTopics = {
  VLSI: ['Combinational Circuits', 'Sequential Circuits', 'FSM Design', 'Memory Design', 'ALU Design', 'Timing Analysis'],
  Embedded: ['GPIO', 'Interrupts', 'Timers', 'Communication Protocols', 'RTOS', 'Power Management'],
  DSP: ['FIR Filters', 'IIR Filters', 'FFT', 'Convolution', 'Sampling', 'Quantization'],
  Software: ['Data Structures', 'Algorithms', 'Memory Management', 'Design Patterns', 'Optimization', 'Testing']
}

// Mock streak data - in real app, this would come from user data
const streakData = {
  current: 7,
  longest: 15,
  lastWeek: [true, true, false, true, true, true, true] // Last 7 days
}

export default function ProblemsPage() {
  const { isAuthenticated } = useAuth()
  const [category, setCategory] = useState('All')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const problemsPerPage = 10
  const guestProblemLimit = 2 // Guests can only see 2 problems

  // Fetch problems from API
  useEffect(() => {
    async function fetchProblems() {
      try {
        setLoading(true)
        const data = await getPublishedProblems()
        
        // Transform API data to match component format
        const transformedProblems = data.map((p: any, index: number) => ({
          id: index + 1, // Use index for display ID
          slug: p.slug,
          title: p.title,
          difficulty: p.difficulty,
          category: p.category,
          tags: p.tags || [],
          status: 'unsolved', // TODO: Get from user submissions
          time: '30 min', // TODO: Calculate from problem data
          solvers: Math.floor(Math.random() * 1000), // TODO: Get from submissions count
          points: p.points || 100,
          languages: p.languages || []
        }))
        
        setProblems(transformedProblems)
      } catch (error) {
        console.error('Failed to fetch problems:', error)
        // Use mock data as fallback
        setProblems(mockProblems)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProblems()
  }, [])

  const filteredProblems = problems.filter(problem => {
    const matchesCategory = category === 'All' || problem.category === category
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase())) ||
      problem.category.toLowerCase().includes(search.toLowerCase())
    const matchesTopic = !selectedTopic || problem.tags.some((tag: string) =>
      tag.toLowerCase().includes(selectedTopic.toLowerCase().split(' ')[0])
    )
    return matchesCategory && matchesDifficulty && matchesSearch && matchesTopic
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage)
  const startIndex = (currentPage - 1) * problemsPerPage
  const endIndex = startIndex + problemsPerPage
  const currentProblems = filteredProblems.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleCategoryChange = (cat: string) => {
    setCategory(cat)
    setDifficultyFilter('All')
    setCurrentPage(1)
  }

  const handleFilterChange = (filter: string) => {
    setDifficultyFilter(filter)
    setCurrentPage(1)
  }

  const handleTopicClick = (topic: string) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null)
    } else {
      setSelectedTopic(topic)
    }
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-100 transition-colors">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Header with Category Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {/* Title and Subtitle */}
                <div className="text-center mb-6">
                  <h1 className="text-5xl md:text-6xl font-display font-black mb-3">
                    <span className="text-secondary-500">{category === 'All' ? 'All' : category}</span> <span className="text-black">Problems</span>
                  </h1>
                  <p className="text-lg text-gray-700 font-semibold">
                    {category === 'All'
                      ? 'Master electronics through hands-on challenges 🎯'
                      : `Master ${category.toLowerCase()} through hands-on challenges 🎯`
                    }
                  </p>
                </div>

                {/* Category Tabs - Prominent Pills */}
                <div className="flex gap-3 justify-center flex-wrap mb-6">
                  {['All', 'VLSI', 'Embedded', 'DSP', 'Software'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-8 py-3 rounded-2xl font-black text-base transition-all border-2 ${category === cat
                        ? 'bg-secondary-500 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5'
                        : 'bg-white text-gray-700 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Guest Access Banner */}
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-2xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl border-3 border-black">
                        <Lock className="w-6 h-6 text-secondary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white mb-1">
                          Limited Access - Guest Mode
                        </h3>
                        <p className="text-white/90 font-semibold">
                          You can only access {guestProblemLimit} problems as a guest. Sign in to unlock all {problems.length}+ problems!
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href="/signin"
                        className="px-6 py-3 bg-white text-secondary-600 rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="px-6 py-3 bg-black text-white rounded-xl font-black border-3 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] transition-all"
                      >
                        Sign Up Free
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Search and Filters Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="bg-white rounded-2xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors">
                  <div className="flex flex-col lg:flex-row gap-4 items-center">
                    {/* Search Bar */}
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search problems or tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-neutral-50 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400 border-2 border-black font-semibold text-base transition-all placeholder:text-gray-500"
                      />
                    </div>

                    {/* Difficulty Filters */}
                    <div className="flex gap-2 items-center flex-shrink-0">
                      <span className="text-gray-600 font-bold text-sm px-3 py-2 bg-neutral-100 rounded-lg border-2 border-black">
                        Filter:
                      </span>
                      {['All', 'BEGINNER', 'MEDIUM', 'HARD'].map((level) => (
                        <button
                          key={level}
                          onClick={() => handleFilterChange(level)}
                          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 ${difficultyFilter === level
                            ? 'bg-accent-500 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white text-gray-600 border-black hover:bg-accent-50'
                            }`}
                        >
                          {level === 'All' ? 'All' : difficultyConfig[level as keyof typeof difficultyConfig]?.label || level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Loading State */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center"
                >
                  <div className="animate-spin w-12 h-12 border-4 border-secondary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-700 font-bold">Loading problems...</p>
                </motion.div>
              )}

              {/* Problems Table */}
              {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-colors"
              >
                {/* Table Header */}
                <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white px-6 py-4 border-b-4 border-black">
                  <div className="grid grid-cols-12 gap-3 font-black text-xs uppercase tracking-wide">
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-center">ID</div>
                    <div className="col-span-3">Problem Title</div>
                    <div className="col-span-1">Category</div>
                    <div className="col-span-2">Difficulty</div>
                    <div className="col-span-2">Tags</div>
                    <div className="col-span-1 text-center">Time</div>
                    <div className="col-span-1 text-center">Points</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y-2 divide-gray-200">
                  {currentProblems.map((problem, index) => {
                    const config = difficultyConfig[problem.difficulty as keyof typeof difficultyConfig]
                    const isLocked = !isAuthenticated && index >= guestProblemLimit

                    // Status-based row styling
                    const rowBg = isLocked 
                      ? 'bg-gray-100'
                      : problem.status === 'solved'
                      ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50'
                      : problem.status === 'partial'
                        ? 'bg-gradient-to-r from-red-50 via-rose-50 to-red-50'
                        : 'bg-white'

                    const rowHoverBg = isLocked
                      ? ''
                      : problem.status === 'solved'
                      ? 'hover:from-amber-100 hover:via-yellow-100 hover:to-amber-100'
                      : problem.status === 'partial'
                        ? 'hover:from-red-100 hover:via-rose-100 hover:to-red-100'
                        : 'hover:bg-neutral-50'

                    const content = (
                      <motion.div
                        key={problem.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {isLocked ? (
                          <div className={`grid grid-cols-12 gap-3 px-6 py-4 ${rowBg} transition-all items-center border-l-4 border-l-gray-400 opacity-60 relative`}>
                            {/* Locked Icon Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-[1px]">
                              <div className="flex flex-col items-center gap-2">
                                <div className="p-4 bg-gray-700 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                  <Lock className="w-8 h-8 text-white" />
                                </div>
                                <Link 
                                  href="/signin"
                                  className="px-4 py-2 bg-secondary-500 text-white rounded-xl font-black text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                  Sign In to Unlock
                                </Link>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="col-span-1 flex justify-center">
                              <div className="w-8 h-8 rounded-full border-2 border-gray-400 bg-gray-200 flex items-center justify-center">
                                <Lock className="w-4 h-4 text-gray-500" />
                              </div>
                            </div>

                            {/* ID */}
                            <div className="col-span-1 text-center">
                              <span className="font-black text-gray-500 text-sm">#{problem.id}</span>
                            </div>

                            {/* Title */}
                            <div className="col-span-3">
                              <h3 className="font-black text-gray-500 text-base">
                                {problem.title}
                              </h3>
                            </div>

                            {/* Category */}
                            <div className="col-span-1">
                              <span className="px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-md border border-gray-300 font-bold">
                                {problem.category}
                              </span>
                            </div>

                            {/* Difficulty */}
                            <div className="col-span-2">
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-black border-2 bg-gray-200 text-gray-500 border-gray-400">
                                {problem.difficulty}
                              </span>
                            </div>

                            {/* Tags */}
                            <div className="col-span-2 flex flex-wrap gap-1">
                              {problem.tags.slice(0, 2).map((tag: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-md border border-gray-300 font-semibold"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Time */}
                            <div className="col-span-1 text-center">
                              <div className="flex items-center justify-center gap-1 text-gray-500 font-bold text-xs">
                                <Clock className="w-3 h-3" />
                                <span>{problem.time}</span>
                              </div>
                            </div>

                            {/* Points */}
                            <div className="col-span-1 text-center">
                              <span className="px-2 py-1 bg-gray-200 text-gray-500 font-black text-sm rounded-md border-2 border-gray-400">
                                {problem.points}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <Link href={`/problems/${problem.id}`}>
                            <div className={`grid grid-cols-12 gap-3 px-6 py-4 ${rowBg} ${rowHoverBg} transition-all cursor-pointer group items-center border-l-4 ${problem.status === 'solved' ? 'border-l-amber-400' :
                              problem.status === 'partial' ? 'border-l-rose-400' :
                                'border-l-transparent'
                              }`}>
                            {/* Status */}
                            <div className="col-span-1 flex justify-center">
                              {problem.status === 'solved' ? (
                                <div className="p-2 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                  <CheckCircle className="w-4 h-4 text-amber-900" strokeWidth={3} />
                                </div>
                              ) : problem.status === 'partial' ? (
                                <div className="p-2 bg-gradient-to-br from-rose-200 to-red-300 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                  <div className="w-4 h-4 rounded-full border-2 border-rose-900" style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }} />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center">
                                  <Circle className="w-4 h-4 text-gray-400" strokeWidth={2} />
                                </div>
                              )}
                            </div>

                            {/* ID */}
                            <div className="col-span-1 text-center">
                              <span className="font-black text-gray-700 text-sm">#{problem.id}</span>
                            </div>

                            {/* Title */}
                            <div className="col-span-3">
                              <h3 className="font-black text-black group-hover:text-secondary-500 transition-colors text-base">
                                {problem.title}
                              </h3>
                            </div>

                            {/* Category */}
                            <div className="col-span-1">
                              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-md border border-primary-300 font-bold">
                                {problem.category}
                              </span>
                            </div>

                            {/* Difficulty */}
                            <div className="col-span-2">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border-2 ${config.bg} ${config.text} ${config.border}`}>
                                {problem.difficulty}
                              </span>
                            </div>

                            {/* Tags */}
                            <div className="col-span-2 flex flex-wrap gap-1">
                              {problem.tags.slice(0, 2).map((tag: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-neutral-100 text-gray-600 text-xs rounded-md border border-gray-300 font-semibold"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Time */}
                            <div className="col-span-1 text-center">
                              <div className="flex items-center justify-center gap-1 text-gray-600 font-bold text-xs">
                                <Clock className="w-3 h-3" />
                                <span>{problem.time}</span>
                              </div>
                            </div>

                            {/* Points */}
                            <div className="col-span-1 text-center">
                              <span className="px-2 py-1 bg-accent-100 text-accent-700 font-black text-sm rounded-md border-2 border-accent-400">
                                {problem.points}
                              </span>
                            </div>
                          </div>
                        </Link>
                        )}
                      </motion.div>
                    )

                    return content
                  })}
                </div>
              </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 flex items-center justify-center gap-2"
                >
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-xl font-bold border-2 transition-all flex items-center gap-2 ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-white text-black border-black hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5'
                      }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-2">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500 font-bold">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page as number)}
                          className={`px-4 py-2 rounded-xl font-black border-2 transition-all ${currentPage === page
                            ? 'bg-secondary-500 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white text-black border-gray-300 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5'
                            }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-xl font-bold border-2 transition-all flex items-center gap-2 ${currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-white text-black border-black hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5'
                      }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

            </div>

            {/* Stats Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block w-72 flex-shrink-0"
            >
              <div className="sticky top-28 space-y-4">
                {/* Streak Card */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-orange-100 via-orange-50 to-red-50 px-5 py-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      >
                        <Flame className="w-6 h-6 text-orange-600" fill="currentColor" />
                      </motion.div>
                      <span className="font-black text-base text-orange-900">Daily Streak</span>
                    </div>
                    <div className="text-3xl font-black text-orange-600">{streakData.current}</div>
                  </div>

                  {/* Last 7 Days */}
                  <div className="flex gap-2 mb-3">
                    {streakData.lastWeek.map((active, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className={`flex-1 h-10 rounded-xl border-3 transition-all ${active
                          ? 'bg-gradient-to-br from-orange-400 to-orange-500 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white border-gray-300'
                          }`}
                        title={`Day ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-orange-900">
                    <span>Last 7 days</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3" fill="currentColor" />
                      Best: {streakData.longest} days
                    </span>
                  </div>
                </motion.div>

                {/* Statistics */}
                <div>
                  <h3 className="text-sm font-black text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Statistics
                  </h3>

                  <div className="space-y-2">
                    <div className="bg-white px-4 py-3 rounded-xl border-2 border-gray-300 shadow-sm transition-colors">
                      <div className="text-2xl font-black text-black mb-0.5">{filteredProblems.length}</div>
                      <div className="text-xs font-bold text-gray-600">Total Problems</div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 px-4 py-3 rounded-xl border-2 border-amber-400 shadow-sm transition-colors">
                      <div className="text-2xl font-black text-amber-700 mb-0.5">
                        {filteredProblems.filter(p => p.status === 'solved').length}
                      </div>
                      <div className="text-xs font-bold text-amber-800">Solved</div>
                    </div>

                    <div className="bg-gradient-to-br from-rose-50 to-red-50 px-4 py-3 rounded-xl border-2 border-rose-400 shadow-sm transition-colors">
                      <div className="text-2xl font-black text-rose-700 mb-0.5">
                        {filteredProblems.filter(p => p.status === 'partial').length}
                      </div>
                      <div className="text-xs font-bold text-rose-800">Partial</div>
                    </div>

                    <div className="bg-gradient-to-br from-accent-50 to-yellow-50 px-4 py-3 rounded-xl border-2 border-accent-500 shadow-sm transition-colors">
                      <div className="text-2xl font-black text-accent-700 mb-0.5">
                        {Math.round((filteredProblems.filter(p => p.status === 'solved').length / filteredProblems.length) * 100)}%
                      </div>
                      <div className="text-xs font-bold text-accent-800">Progress</div>
                    </div>
                  </div>
                </div>

                {/* Topics */}
                {category !== 'All' && (
                  <div>
                    <h3 className="text-sm font-black text-gray-700 mb-3">{category} Topics</h3>
                    <div className="bg-gradient-to-br from-white to-neutral-50 px-4 py-4 rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex flex-wrap gap-2">
                        {/* All Button */}
                        <button
                          onClick={() => setSelectedTopic(null)}
                          className={`px-3 py-2 text-xs rounded-lg border-2 border-black font-bold transition-all ${selectedTopic === null
                            ? 'bg-secondary-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white text-gray-700 hover:bg-neutral-100'
                            }`}
                        >
                          All
                        </button>

                        {categoryTopics[category as keyof typeof categoryTopics].map((topic) => (
                          <button
                            key={topic}
                            onClick={() => handleTopicClick(topic)}
                            className={`px-3 py-2 text-xs rounded-lg border-2 border-black font-bold transition-all ${selectedTopic === topic
                              ? 'bg-secondary-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                              : 'bg-white text-gray-700 hover:bg-neutral-100'
                              }`}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  href="/problems/1"
                  className="group flex items-center justify-center gap-2 px-4 py-3 bg-accent-500 text-black rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all font-black text-sm"
                >
                  <Zap className="w-4 h-4" />
                  <span>Start Solving</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
