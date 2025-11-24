'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { 
  Play, BookOpen, Code, Zap, Clock, Users, Star, ChevronRight, 
  CheckCircle, Lock, Video, FileText, Headphones, Monitor,
  Cpu, Smartphone, Waves, Database, ArrowRight, Trophy,
  Target, Lightbulb, Rocket, Award
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'

const tutorialCategories = [
  {
    id: 'vlsi',
    title: 'VLSI Design',
    description: 'Master digital circuit design and hardware description languages',
    icon: Cpu,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    tutorials: 12,
    duration: '8 hours',
    level: 'Beginner to Advanced'
  },
  {
    id: 'embedded',
    title: 'Embedded Systems',
    description: 'Learn microcontroller programming and real-time systems',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    tutorials: 10,
    duration: '6 hours',
    level: 'Intermediate'
  },
  {
    id: 'dsp',
    title: 'Digital Signal Processing',
    description: 'Understand signal analysis and digital filter design',
    icon: Waves,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-400',
    tutorials: 8,
    duration: '5 hours',
    level: 'Advanced'
  },
  {
    id: 'software',
    title: 'Software Engineering',
    description: 'Build efficient algorithms and data structures',
    icon: Database,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-400',
    tutorials: 15,
    duration: '10 hours',
    level: 'All Levels'
  }
]

const featuredTutorials = [
  {
    id: 1,
    title: 'Complete VLSI Design Bootcamp',
    description: 'From basic logic gates to complex processor design',
    category: 'VLSI',
    duration: '2.5 hours',
    lessons: 12,
    level: 'Beginner',
    rating: 4.9,
    students: 2340,
    instructor: 'Dr. Sarah Chen',
    thumbnail: '/api/placeholder/400/225',
    type: 'video',
    free: true,
    topics: ['Logic Gates', 'Combinational Circuits', 'Sequential Design', 'Verilog HDL']
  },
  {
    id: 2,
    title: 'Embedded Systems Fundamentals',
    description: 'Master microcontroller programming and IoT development',
    category: 'Embedded',
    duration: '3 hours',
    lessons: 15,
    level: 'Intermediate',
    rating: 4.8,
    students: 1890,
    instructor: 'Prof. Mike Johnson',
    thumbnail: '/api/placeholder/400/225',
    type: 'interactive',
    free: false,
    topics: ['ARM Cortex', 'RTOS', 'Communication Protocols', 'IoT Integration']
  },
  {
    id: 3,
    title: 'DSP Algorithms Deep Dive',
    description: 'Advanced signal processing techniques and implementations',
    category: 'DSP',
    duration: '4 hours',
    lessons: 18,
    level: 'Advanced',
    rating: 4.7,
    students: 1234,
    instructor: 'Dr. Alex Rodriguez',
    thumbnail: '/api/placeholder/400/225',
    type: 'hands-on',
    free: false,
    topics: ['FFT', 'Filter Design', 'MATLAB', 'Real-time Processing']
  }
]

const learningPaths = [
  {
    id: 'beginner',
    title: 'Electronics Engineering Fundamentals',
    description: 'Perfect starting point for new engineers',
    duration: '4 weeks',
    courses: 6,
    icon: Lightbulb,
    color: 'bg-green-100',
    steps: [
      'Basic Circuit Analysis',
      'Digital Logic Design',
      'Introduction to HDL',
      'Simple Projects',
      'Testing & Validation',
      'Final Project'
    ]
  },
  {
    id: 'intermediate',
    title: 'Advanced System Design',
    description: 'Build complex electronic systems',
    duration: '6 weeks',
    courses: 8,
    icon: Target,
    color: 'bg-yellow-100',
    steps: [
      'Advanced VLSI Concepts',
      'Embedded Programming',
      'Signal Processing',
      'System Integration',
      'Performance Optimization',
      'Industry Project'
    ]
  },
  {
    id: 'expert',
    title: 'Professional Mastery',
    description: 'Industry-level expertise and specialization',
    duration: '8 weeks',
    courses: 12,
    icon: Trophy,
    color: 'bg-purple-100',
    steps: [
      'Research Methods',
      'Advanced Algorithms',
      'System Architecture',
      'Team Leadership',
      'Innovation Projects',
      'Certification Prep'
    ]
  }
]

export default function TutorialsPage() {
  const { isAuthenticated } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
              <Rocket className="w-5 h-5 text-black" />
              <span className="text-lg font-black text-black">Learn. Build. Master.</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-display font-black text-gray-900 mb-6 leading-tight">
              Electronics Engineering
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Tutorials
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 font-semibold mb-8 max-w-3xl mx-auto leading-relaxed">
              Master electronics engineering through comprehensive, hands-on tutorials. From basic concepts to advanced implementations, learn at your own pace with expert guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#featured"
                className="px-8 py-4 bg-secondary-500 text-white rounded-xl font-black text-lg border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Learning
              </Link>
              <Link
                href="#paths"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-black text-lg border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Learning Paths
              </Link>
            </div>
          </motion.div>

          {/* Tutorial Categories */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-black text-gray-900 mb-4">
                Choose Your Domain
              </h2>
              <p className="text-lg text-gray-700 font-semibold">
                Specialized tutorials for every area of electronics engineering
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tutorialCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  className={`${category.bgColor} rounded-3xl p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl border-3 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-3">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-700 font-semibold mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="space-y-2 text-sm font-bold text-gray-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{category.tutorials} tutorials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{category.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>{category.level}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Featured Tutorials */}
          <motion.section
            id="featured"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-black text-gray-900 mb-4">
                Featured Tutorials
              </h2>
              <p className="text-lg text-gray-700 font-semibold">
                Hand-picked tutorials from industry experts
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {featuredTutorials.map((tutorial, index) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white rounded-3xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all overflow-hidden group"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 border-b-4 border-black">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white rounded-2xl border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {tutorial.type === 'video' && <Video className="w-10 h-10 text-primary-600" />}
                        {tutorial.type === 'interactive' && <Monitor className="w-10 h-10 text-green-600" />}
                        {tutorial.type === 'hands-on' && <Code className="w-10 h-10 text-purple-600" />}
                      </div>
                    </div>
                    
                    {/* Free/Premium Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border-2 ${
                        tutorial.free 
                          ? 'bg-green-400 text-black border-black' 
                          : 'bg-accent-500 text-black border-black'
                      }`}>
                        {tutorial.free ? 'FREE' : 'PREMIUM'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-bold border-2 border-primary-300">
                        {tutorial.category}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold border-2 border-gray-300">
                        {tutorial.level}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-secondary-600 transition-colors">
                      {tutorial.title}
                    </h3>

                    <p className="text-gray-700 font-semibold mb-4 leading-relaxed">
                      {tutorial.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm font-bold text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{tutorial.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{tutorial.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{tutorial.rating}</span>
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tutorial.topics.slice(0, 3).map((topic, i) => (
                        <span key={i} className="px-2 py-1 bg-neutral-100 text-gray-600 text-xs rounded-md border border-gray-300 font-semibold">
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <button className="w-full py-3 bg-secondary-500 text-white rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Start Tutorial
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Learning Paths */}
          <motion.section
            id="paths"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-black text-gray-900 mb-4">
                Structured Learning Paths
              </h2>
              <p className="text-lg text-gray-700 font-semibold">
                Follow our proven curriculum to master electronics engineering
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {learningPaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`${path.color} rounded-3xl p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all`}
                >
                  <div className="w-16 h-16 bg-white rounded-2xl border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <path.icon className="w-8 h-8 text-gray-900" />
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-3">
                    {path.title}
                  </h3>

                  <p className="text-gray-700 font-semibold mb-6 leading-relaxed">
                    {path.description}
                  </p>

                  <div className="flex items-center gap-4 mb-6 text-sm font-bold text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{path.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{path.courses} courses</span>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3 mb-8">
                    {path.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white rounded-full border-2 border-black flex items-center justify-center text-xs font-black">
                          {i + 1}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2">
                    <Rocket className="w-4 h-4" />
                    Start Path
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 rounded-3xl p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-4xl font-display font-black text-white mb-6">
                Ready to Master Electronics?
              </h2>
              <p className="text-xl text-white/90 font-semibold mb-8 max-w-2xl mx-auto">
                Join thousands of engineers who have advanced their careers with our comprehensive tutorials
              </p>
              
              {!isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/signup"
                    className="px-8 py-4 bg-white text-gray-900 rounded-xl font-black text-lg border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                  >
                    <Award className="w-5 h-5" />
                    Start Free Account
                  </Link>
                  <Link
                    href="/signin"
                    className="px-8 py-4 bg-transparent text-white rounded-xl font-black text-lg border-3 border-white hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Sign In
                  </Link>
                </div>
              ) : (
                <Link
                  href="/problems"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-xl font-black text-lg border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <Code className="w-5 h-5" />
                  Practice Problems
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </motion.section>
        </div>
      </div>

      <Footer />
    </div>
  )
}