'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  Trophy, Flame, Target, Award, Code, TrendingUp, Star, CheckCircle, Zap,
  Camera, Edit, MapPin, Calendar, Github, Twitter, Linkedin, Mail, Globe,
  User, Clock, Activity, BookOpen, Settings, Eye, Download, ExternalLink,
  ChevronRight, Plus, Upload, Lock
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

const tabs = ['Overview', 'Achievements', 'About', 'Settings']

const userProfile = {
  name: 'John Doe',
  title: 'Senior Electronics Engineer',
  bio: 'Passionate electronics engineer with 5+ years of experience in VLSI design and embedded systems. Love solving complex problems and building innovative solutions.',
  location: 'San Francisco, CA',
  joinDate: 'January 2024',
  email: 'john.doe@email.com',
  website: 'johndoe.dev',
  github: 'johndoe',
  linkedin: 'john-doe-engineer',
  twitter: '@johndoe_eng',
  stats: {
    problemsSolved: 186,
    currentStreak: 30,
    successRate: 87,
    globalRank: 148,
    difficulty: {
      easy: 78,
      medium: 65,
      hard: 43
    }
  }
}

const achievements = [
  { icon: Flame, title: 'Fire Starter', description: '30 day streak', unlocked: true, color: 'bg-orange-200', date: '2024-03-15' },
  { icon: Trophy, title: 'Problem Crusher', description: 'Solved 100+ problems', unlocked: true, color: 'bg-amber-200', date: '2024-03-10' },
  { icon: Star, title: 'Perfect Score', description: 'Got 100% on hard problem', unlocked: true, color: 'bg-yellow-200', date: '2024-03-05' },
  { icon: Target, title: 'Sharpshooter', description: 'Solved 10 in a row', unlocked: true, color: 'bg-green-200', date: '2024-02-28' },
  { icon: Award, title: 'Competition Winner', description: 'Won monthly contest', unlocked: false, color: 'bg-purple-200', date: null },
  { icon: Code, title: 'Code Master', description: 'Solved 500+ problems', unlocked: false, color: 'bg-blue-200', date: null },
  { icon: Zap, title: 'Speed Demon', description: 'Fastest solution time', unlocked: true, color: 'bg-cyan-200', date: '2024-02-20' },
  { icon: BookOpen, title: 'Knowledge Seeker', description: 'Completed 5 courses', unlocked: true, color: 'bg-indigo-200', date: '2024-02-15' },
]

const allSubmissions = [
  { id: 1, problem: 'Advanced VLSI Design', status: 'Accepted', time: '2 hours ago', language: 'Verilog', score: 100, difficulty: 'Hard', category: 'VLSI' },
  { id: 2, problem: 'Full Adder Circuit', status: 'Accepted', time: '1 day ago', language: 'VHDL', score: 100, difficulty: 'Medium', category: 'VLSI' },
  { id: 3, problem: '4-bit ALU Design', status: 'Wrong Answer', time: '2 days ago', language: 'Verilog', score: 60, difficulty: 'Medium', category: 'VLSI' },
  { id: 4, problem: 'UART Protocol Implementation', status: 'Accepted', time: '3 days ago', language: 'C++', score: 95, difficulty: 'Hard', category: 'Embedded' },
  { id: 5, problem: 'I2C Communication', status: 'Accepted', time: '4 days ago', language: 'C', score: 88, difficulty: 'Medium', category: 'Embedded' },
  { id: 6, problem: 'FIR Filter Design', status: 'Partial', time: '5 days ago', language: 'MATLAB', score: 75, difficulty: 'Hard', category: 'DSP' },
  { id: 7, problem: 'Digital Signal Processing', status: 'Accepted', time: '6 days ago', language: 'Python', score: 92, difficulty: 'Medium', category: 'DSP' },
  { id: 8, title: 'Memory Management', status: 'Accepted', time: '1 week ago', language: 'C++', score: 85, difficulty: 'Hard', category: 'Software' },
]

// Activity data generation will be added later

const monthlyStats = [
  { month: 'Jan', problems: 45, streak: 15, points: 1200 },
  { month: 'Feb', problems: 52, streak: 28, points: 1450 },
  { month: 'Mar', problems: 38, streak: 12, points: 980 },
  { month: 'Apr', problems: 61, streak: 22, points: 1680 },
  { month: 'May', problems: 47, streak: 18, points: 1320 },
  { month: 'Jun', problems: 55, streak: 25, points: 1550 },
]

const skills = [
  { name: 'VLSI Design', level: 95, category: 'Hardware' },
  { name: 'Verilog/VHDL', level: 92, category: 'Languages' },
  { name: 'Embedded Systems', level: 88, category: 'Hardware' },
  { name: 'Digital Signal Processing', level: 85, category: 'Software' },
  { name: 'PCB Design', level: 78, category: 'Hardware' },
  { name: 'C/C++', level: 90, category: 'Languages' },
  { name: 'Python', level: 85, category: 'Languages' },
  { name: 'MATLAB', level: 82, category: 'Tools' },
]

const recentActivity = [
  { type: 'submission', action: 'Solved Advanced VLSI Design', time: '2 hours ago', icon: CheckCircle, color: 'text-green-500' },
  { type: 'achievement', action: 'Earned Fire Starter badge', time: '1 day ago', icon: Award, color: 'text-amber-500' },
  { type: 'streak', action: 'Maintained 30-day streak', time: '2 days ago', icon: Flame, color: 'text-orange-500' },
  { type: 'submission', action: 'Attempted UART Protocol', time: '3 days ago', icon: Code, color: 'text-blue-500' },
  { type: 'course', action: 'Completed FPGA Fundamentals', time: '5 days ago', icon: BookOpen, color: 'text-purple-500' },
  { type: 'submission', action: 'Solved I2C Communication', time: '1 week ago', icon: CheckCircle, color: 'text-green-500' },
]

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Overview')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showAllSubmissions, setShowAllSubmissions] = useState(false)
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [showAllActivity, setShowAllActivity] = useState(false)
  const [calendarView, setCalendarView] = useState<'month' | 'year'>('month')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [mounted, setMounted] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin')
    }
  }, [isAuthenticated, router])

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading screen while checking authentication
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <Navbar />
        <div className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <motion.div
                className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-black text-black"
              >
                Loading Profile...
              </motion.h1>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <Navbar />
        <div className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-gray-600" />
              </div>
              <h1 className="text-3xl font-black text-black mb-4">Profile Access Required</h1>
              <p className="text-lg text-gray-700 font-semibold mb-8">
                You need to be signed in to view your profile and track your progress.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/signin"
                  className="px-8 py-4 bg-secondary-500 text-white rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-4 bg-accent-500 text-black rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Sign Up Free
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }



  // Calendar will be added later

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-100 transition-colors">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Profile Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-3xl p-8 mb-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-colors"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
            </div>

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              {/* Avatar with Upload */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="w-32 h-32 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black text-5xl font-black">
                      {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || 'S'}
                    </div>
                  )}
                </motion.div>

                {/* Upload Button */}
                <label htmlFor="profile-upload" className="absolute bottom-2 right-2 cursor-pointer">
                  <div className="w-10 h-10 bg-accent-500 rounded-full border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-accent-600 transition-colors">
                    <Camera className="w-5 h-5 text-black" />
                  </div>
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-4 justify-center md:justify-start mb-2">
                  <h1 className="text-5xl font-display font-black text-white">
                    {user?.firstName || 'User'} {user?.lastName || 'Name'}
                  </h1>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 bg-white/20 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-colors"
                  >
                    <Edit className="w-5 h-5 text-white" />
                  </button>
                </div>
                <p className="text-white/90 text-xl mb-2 font-bold">{userProfile.title}</p>
                <div className="flex items-center gap-2 justify-center md:justify-start text-white/80 font-semibold mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{userProfile.location}</span>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-black font-black">30 Day Streak</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Trophy className="w-5 h-5 text-accent-500" />
                    <span className="text-black font-black">Rank #148</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Star className="w-5 h-5 text-primary-500" />
                    <span className="text-black font-black">4,300 XP</span>
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="bg-white rounded-2xl p-6 min-w-[240px] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors">
                <div className="text-black/70 text-sm mb-3 font-bold">Progress to Level 13</div>
                <div className="relative w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden border-2 border-black">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                  />
                </div>
                <div className="text-black text-sm font-black">3,225 / 4,300 XP</div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-2 mb-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors"
          >
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-2xl font-black transition-all whitespace-nowrap border-2 ${activeTab === tab
                    ? 'bg-accent-500 text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-black border-black hover:bg-neutral-100'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Code, label: 'Problems Solved', value: '186', color: 'bg-secondary-200' },
                    { icon: Flame, label: 'Current Streak', value: '30', color: 'bg-orange-200' },
                    { icon: Target, label: 'Success Rate', value: '87%', color: 'bg-green-200' },
                    { icon: TrendingUp, label: 'Global Rank', value: '#148', color: 'bg-primary-200' },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className={`${stat.color} rounded-2xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
                    >
                      <div className="w-12 h-12 bg-white rounded-xl border-4 border-black flex items-center justify-center mb-4">
                        <stat.icon className="w-6 h-6 text-black" />
                      </div>
                      <div className="text-4xl font-black text-black mb-1">{stat.value}</div>
                      <div className="text-sm text-black/70 font-bold">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Monthly Activity Calendar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-3xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-200 rounded-full blur-3xl opacity-30"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-200 rounded-full blur-3xl opacity-30"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-display font-black text-primary-700">Activity Calendar</h2>
                        <p className="text-xs font-bold text-primary-500 mt-1">
                          {selectedYear} Contribution Activity
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedYear(selectedYear - 1)}
                          className="p-1.5 bg-white rounded-lg border-2 border-black hover:bg-accent-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                        >
                          <ChevronRight className="w-3 h-3 rotate-180" />
                        </button>
                        <span className="px-3 py-1 bg-white rounded-lg border-2 border-black font-black text-xs">
                          {selectedYear}
                        </span>
                        <button
                          onClick={() => setSelectedYear(selectedYear + 1)}
                          className="p-1.5 bg-white rounded-lg border-2 border-black hover:bg-accent-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* GitHub-style Calendar */}
                    <div className="mb-4">
                      <div className="bg-white rounded-2xl p-12 border-2 border-black flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-secondary-200 rounded-xl border-3 border-black mb-4 flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-secondary-700" />
                        </div>
                        <div className="text-primary-700 font-black text-lg mb-1">Activity Calendar</div>
                        <div className="text-gray-600 font-semibold text-sm">Coming soon...</div>
                      </div>
                    </div>
                  </div>




                </motion.div>

                {/* Recent Submissions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-3xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-black text-black">Recent Submissions</h2>
                    <button
                      onClick={() => setShowAllSubmissions(!showAllSubmissions)}
                      className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-xl font-bold border-2 border-black hover:bg-secondary-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {allSubmissions.slice(0, showAllSubmissions ? allSubmissions.length : 3).map((submission, index) => (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-black hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-black text-black mb-2">{submission.problem}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                            <span className="px-2 py-1 bg-secondary-200 text-secondary-800 rounded border border-black">{submission.category}</span>
                            <span className="px-2 py-1 bg-white rounded border-2 border-black">{submission.language}</span>
                            <span>•</span>
                            <span>{submission.time}</span>
                            <span>•</span>
                            <span>{submission.score}%</span>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-xl font-black text-sm flex items-center gap-2 border-3 border-black ${submission.status === 'Accepted' ? 'bg-green-400 text-black' :
                          submission.status === 'Partial' ? 'bg-yellow-400 text-black' :
                            'bg-red-400 text-white'
                          }`}>
                          {submission.status === 'Accepted' && <CheckCircle className="w-4 h-4" />}
                          {submission.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Achievements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-3xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-black text-black">Recent Achievements</h2>
                    <button
                      onClick={() => setShowAllAchievements(!showAllAchievements)}
                      className="text-sm font-bold text-secondary-600 hover:text-secondary-700 flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {achievements.slice(0, showAllAchievements ? achievements.length : 3).map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        className={`p-4 rounded-2xl border-3 border-black transition-all ${achievement.unlocked
                          ? `${achievement.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                          : 'bg-gray-200 opacity-50'
                          }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 border-3 border-black ${achievement.unlocked ? 'bg-white' : 'bg-gray-300'
                          }`}>
                          <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? 'text-black' : 'text-gray-400'
                            }`} />
                        </div>
                        <h3 className={`font-black mb-1 ${achievement.unlocked ? 'text-black' : 'text-gray-500'
                          }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm font-semibold ${achievement.unlocked ? 'text-black/70' : 'text-gray-400'
                          }`}>
                          {achievement.description}
                        </p>
                        {achievement.date && (
                          <p className="text-xs text-gray-500 mt-2 font-medium">
                            Earned {achievement.date}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Skills Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-3xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-black text-black">Top Skills</h2>
                    <button className="text-sm font-bold text-secondary-600 hover:text-secondary-700 flex items-center gap-1">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {skills.slice(0, 4).map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-black text-sm">{skill.name}</span>
                          <span className="text-xs font-bold text-gray-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className="bg-secondary-500 h-full rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-3xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-black text-black">Recent Activity</h2>
                    <button className="text-sm font-bold text-secondary-600 hover:text-secondary-700 flex items-center gap-1">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.slice(0, 4).map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-8 h-8 rounded-xl border-2 border-black flex items-center justify-center ${activity.type === 'submission' ? 'bg-green-200' :
                          activity.type === 'achievement' ? 'bg-amber-200' :
                            activity.type === 'streak' ? 'bg-orange-200' :
                              activity.type === 'course' ? 'bg-purple-200' :
                                'bg-blue-200'
                          }`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-black text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-600 font-medium">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === 'About' && (
            <div className="space-y-8">
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Code, label: 'Problems Solved', value: userProfile.stats.problemsSolved.toString(), color: 'bg-secondary-200' },
                  { icon: Flame, label: 'Current Streak', value: userProfile.stats.currentStreak.toString(), color: 'bg-orange-200' },
                  { icon: Target, label: 'Success Rate', value: `${userProfile.stats.successRate}%`, color: 'bg-green-200' },
                  { icon: TrendingUp, label: 'Global Rank', value: `#${userProfile.stats.globalRank}`, color: 'bg-primary-200' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className={`${stat.color} rounded-2xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    <div className="w-12 h-12 bg-white rounded-xl border-4 border-black flex items-center justify-center mb-4">
                      <stat.icon className="w-6 h-6 text-black" />
                    </div>
                    <div className="text-4xl font-black text-black mb-1">{stat.value}</div>
                    <div className="text-sm text-black/70 font-bold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Difficulty Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors"
              >
                <h2 className="text-2xl font-display font-black text-black mb-6">Problems by Difficulty</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-100 rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-center">
                      <div className="text-4xl font-black text-green-700 mb-2">{userProfile.stats.difficulty.easy}</div>
                      <div className="text-green-700 font-bold">Easy</div>
                    </div>
                  </div>
                  <div className="bg-yellow-100 rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-center">
                      <div className="text-4xl font-black text-yellow-700 mb-2">{userProfile.stats.difficulty.medium}</div>
                      <div className="text-yellow-700 font-bold">Medium</div>
                    </div>
                  </div>
                  <div className="bg-red-100 rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-center">
                      <div className="text-4xl font-black text-red-700 mb-2">{userProfile.stats.difficulty.hard}</div>
                      <div className="text-red-700 font-bold">Hard</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-3xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-black text-black">About Me</h2>
                    <button className="p-2 bg-secondary-500 text-white rounded-xl border-2 border-black hover:bg-secondary-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-black text-black mb-2">Bio</h3>
                      <p className="text-gray-700 font-semibold leading-relaxed">
                        {userProfile.bio}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-black text-black mb-2">Location</h3>
                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                          <MapPin className="w-4 h-4" />
                          <span>{userProfile.location}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-black text-black mb-2">Joined</h3>
                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                          <Calendar className="w-4 h-4" />
                          <span>{userProfile.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-black text-black mb-3">Contact & Social</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl border-2 border-black flex items-center justify-center">
                            <Mail className="w-5 h-5 text-black" />
                          </div>
                          <span className="font-semibold text-gray-700">{userProfile.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl border-2 border-black flex items-center justify-center">
                            <Globe className="w-5 h-5 text-black" />
                          </div>
                          <span className="font-semibold text-gray-700">{userProfile.website}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl border-2 border-black flex items-center justify-center">
                            <Github className="w-5 h-5 text-black" />
                          </div>
                          <span className="font-semibold text-gray-700">github.com/{userProfile.github}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl border-2 border-black flex items-center justify-center">
                            <Linkedin className="w-5 h-5 text-black" />
                          </div>
                          <span className="font-semibold text-gray-700">linkedin.com/in/{userProfile.linkedin}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl border-2 border-black flex items-center justify-center">
                            <Twitter className="w-5 h-5 text-black" />
                          </div>
                          <span className="font-semibold text-gray-700">{userProfile.twitter}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Skills & Expertise */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-3xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors"
                >
                  <h2 className="text-2xl font-display font-black text-black mb-6">Skills & Expertise</h2>

                  <div className="space-y-6">
                    {['Hardware', 'Languages', 'Tools'].map((category) => (
                      <div key={category}>
                        <h3 className="font-black text-black mb-3">{category}</h3>
                        <div className="space-y-3">
                          {skills.filter(skill => skill.category === category).map((skill, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-black text-sm">{skill.name}</span>
                                <span className="text-xs font-bold text-gray-600">{skill.level}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.level}%` }}
                                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                  className="bg-secondary-500 h-full rounded-full"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === 'Achievements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className={`p-6 rounded-3xl border-4 border-black transition-all ${achievement.unlocked
                      ? `${achievement.color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`
                      : 'bg-gray-200 opacity-50'
                    }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border-4 border-black ${achievement.unlocked ? 'bg-white' : 'bg-gray-300'
                    }`}>
                    <achievement.icon className={`w-8 h-8 ${achievement.unlocked ? 'text-black' : 'text-gray-400'
                      }`} />
                  </div>
                  <h3 className={`text-xl font-black mb-2 ${achievement.unlocked ? 'text-black' : 'text-gray-500'
                    }`}>
                    {achievement.title}
                  </h3>
                  <p className={`font-semibold mb-2 ${achievement.unlocked ? 'text-black/70' : 'text-gray-400'
                    }`}>
                    {achievement.description}
                  </p>
                  {achievement.date && (
                    <p className="text-xs text-gray-500 font-medium">
                      Earned {achievement.date}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Account Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors"
              >
                <h2 className="text-2xl font-display font-black text-black mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-black text-black mb-3">Profile Visibility</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-black" />
                        <span className="font-semibold text-gray-700">Make profile public</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-black" />
                        <span className="font-semibold text-gray-700">Show submission history</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-2 border-black" />
                        <span className="font-semibold text-gray-700">Show activity calendar</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-black mb-3">Email Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-black" />
                        <span className="font-semibold text-gray-700">Weekly progress summary</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-2 border-black" />
                        <span className="font-semibold text-gray-700">New problem notifications</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-black" />
                        <span className="font-semibold text-gray-700">Achievement notifications</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-black mb-3">Account Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-3 bg-secondary-500 text-white rounded-xl font-bold border-2 border-black hover:bg-secondary-600 transition-colors">
                        Change Password
                      </button>
                      <button className="w-full px-4 py-3 bg-gray-500 text-white rounded-xl font-bold border-2 border-black hover:bg-gray-600 transition-colors">
                        Export Data
                      </button>
                      <button className="w-full px-4 py-3 bg-red-500 text-white rounded-xl font-bold border-2 border-black hover:bg-red-600 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors"
              >
                <h2 className="text-2xl font-display font-black text-black mb-6">Preferences</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-black text-black mb-3">Code Editor</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-2">Theme</label>
                        <select className="w-full px-4 py-2 bg-white text-black border-2 border-black rounded-xl font-semibold">
                          <option>Dark</option>
                          <option>Light</option>
                          <option>Auto</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-2">Font Size</label>
                        <select className="w-full px-4 py-2 bg-white text-black border-2 border-black rounded-xl font-semibold">
                          <option>12px</option>
                          <option>14px</option>
                          <option>16px</option>
                          <option>18px</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-black" />
                        <span className="font-semibold text-gray-700">Auto-complete</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-black mb-3">Language Preferences</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-2">Default Language</label>
                        <select className="w-full px-4 py-2 bg-white text-black border-2 border-black rounded-xl font-semibold">
                          <option>C++</option>
                          <option>Python</option>
                          <option>Verilog</option>
                          <option>VHDL</option>
                          <option>MATLAB</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-2 border-black" />
                        <span className="font-semibold text-gray-700">Show language hints</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-black mb-3">Difficulty Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-black" />
                        <span className="font-semibold text-gray-700">Show difficulty hints</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-2 border-black" />
                        <span className="font-semibold text-gray-700">Auto-suggest next problem</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}