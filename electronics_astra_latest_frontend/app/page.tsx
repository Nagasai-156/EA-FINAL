'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Zap, Trophy, Users, Code, ArrowRight, Target, Star, Rocket,
  CircuitBoard, Lightbulb, CheckCircle, Award, BookOpen, TrendingUp,
  Cpu, Brain, Play, Sparkles
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const features = [
  {
    icon: CircuitBoard,
    title: 'Interactive Circuits',
    description: 'Build and simulate real circuits with our advanced HDL editor',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    title: 'Smart Learning Paths',
    description: 'AI-powered curriculum adapted to your learning style',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Get real-time validation and detailed explanations',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Trophy,
    title: 'Global Leaderboards',
    description: 'Compete with engineers worldwide and track progress',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Cpu,
    title: 'HDL Simulation',
    description: 'Write and test Verilog, VHDL, and SystemVerilog',
    gradient: 'from-red-500 to-rose-500',
  },
  {
    icon: Award,
    title: 'Certifications',
    description: 'Earn industry-recognized certificates',
    gradient: 'from-indigo-500 to-blue-500',
  }
]

const stats = [
  { value: '10K+', label: 'Active Learners', icon: Users },
  { value: '500+', label: 'Problems', icon: Code },
  { value: '95%', label: 'Success Rate', icon: Target },
  { value: '50+', label: 'Countries', icon: Star }
]

const topics = [
  'VLSI Design', 'Digital Circuits', 'Analog Electronics', 'Microprocessors',
  'Signal Processing', 'Power Electronics', 'Embedded Systems', 'PCB Design'
]

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-accent-100 rounded-full border-2 border-accent-300 mb-6">
                  <Sparkles className="w-4 h-4 text-accent-600" />
                  <span className="text-sm font-bold text-accent-900">Trusted by 10,000+ Engineers</span>
                </div>

                <h1 className="text-6xl md:text-7xl font-display font-black text-gray-900 mb-6 leading-tight">
                  Master Electronics
                  <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Engineering
                  </span>
                </h1>

                <p className="text-xl text-gray-700 font-semibold mb-8 leading-relaxed">
                  The most comprehensive interactive platform for learning VLSI, embedded systems, and digital design. Build real projects, solve challenges, and get certified.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link 
                    href="/problems"
                    className="px-8 py-4 bg-accent-500 text-white rounded-xl font-black text-lg border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-5 h-5" />
                    Start Learning Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/problems"
                    className="px-8 py-4 bg-white text-gray-900 rounded-xl font-black text-lg border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Watch Demo
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Free forever plan</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl border-2 border-black flex items-center justify-center mb-4">
                    <stat.icon className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm font-bold text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-5 py-2 bg-primary-100 rounded-full border-2 border-primary-300 mb-4">
              <span className="text-sm font-bold text-primary-900">POWERFUL FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-black text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-700 font-semibold max-w-3xl mx-auto">
              Professional tools and features designed for serious learners
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl border-3 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 font-semibold leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border-2 border-white/20 mb-4">
              <span className="text-sm font-bold text-white">YOUR LEARNING PATH</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-4">
              From Beginner to Expert
            </h2>
            <p className="text-xl text-gray-300 font-semibold max-w-3xl mx-auto">
              Follow our proven methodology used by thousands of successful engineers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                title: 'Learn Fundamentals', 
                desc: 'Master core concepts with interactive tutorials and video lessons', 
                icon: BookOpen,
              },
              { 
                step: '02', 
                title: 'Practice & Build', 
                desc: 'Solve 500+ problems and build real-world projects', 
                icon: Code,
              },
              { 
                step: '03', 
                title: 'Get Certified', 
                desc: 'Earn industry-recognized certifications', 
                icon: Award,
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-8 border-4 border-gray-700 hover:border-white transition-all"
              >
                <div className="text-5xl font-black text-gray-700 mb-6">{item.step}</div>
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl border-3 border-white flex items-center justify-center mb-6 shadow-lg">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
                <p className="text-gray-300 font-semibold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-display font-black text-gray-900 mb-4">
              Master Every Topic
            </h2>
            <p className="text-xl text-gray-700 font-semibold">
              Comprehensive coverage of all electronics engineering domains
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="px-8 py-4 bg-white rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <span className="font-black text-gray-900">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-2xl text-white/90 font-semibold mb-10">
            Join thousands of engineers mastering electronics today
          </p>
          <Link 
            href="/signup"
            className="inline-flex items-center gap-3 px-12 py-6 bg-white text-gray-900 rounded-2xl font-black text-2xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <Rocket className="w-7 h-7" />
            Get Started Free
            <ArrowRight className="w-7 h-7" />
          </Link>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold">Free Forever Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
