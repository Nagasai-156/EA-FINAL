'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Mail, Lock, Github, Chrome, ArrowRight, Sparkles, Eye, EyeOff,
  Zap, Cpu, Smartphone, Car, Home, Rocket, Users, BookOpen, Award
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'

export default function SignInPage() {
  const { signIn, isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already signed in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/problems')
    }
  }, [isAuthenticated, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      await signIn(formData.email, formData.password)
    } catch (err) {
      setError('Invalid email or password')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 transition-colors">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
            
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Welcome Section */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 rounded-full border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6"
                >
                  <Sparkles className="w-5 h-5 text-black" />
                  <span className="text-sm font-black text-black">Welcome Back! 👋</span>
                </motion.div>
                
                <h1 className="text-5xl font-display font-black text-primary-500 mb-4 leading-tight">
                  Continue Your 
                  <span className="text-secondary-500"> Learning Journey</span>
                </h1>
                
                <p className="text-lg text-gray-700 font-semibold leading-relaxed mb-8">
                  Pick up right where you left off. Your progress, projects, and achievements are waiting for you.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Cpu, title: 'HDL Editor', desc: 'Advanced tools' },
                  { icon: Rocket, title: 'Fast Learning', desc: 'Optimized path' },
                  { icon: Users, title: 'Community', desc: '10K+ engineers' },
                  { icon: Award, title: 'Certificates', desc: 'Get certified' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl border-2 border-black flex items-center justify-center mb-3">
                      <item.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="font-black text-black text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600 font-semibold">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Platform Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <h3 className="text-white font-black text-lg mb-4">Why Engineers Love Us</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Users, value: '10K+', label: 'Engineers' },
                    { icon: BookOpen, value: '500+', label: 'Problems' },
                    { icon: Award, value: '98%', label: 'Success' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="w-10 h-10 bg-white rounded-xl border-2 border-black flex items-center justify-center mx-auto mb-2">
                        <stat.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="text-2xl font-black text-white">{stat.value}</div>
                      <div className="text-sm text-white/80 font-semibold">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Sign In Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto w-full transition-colors"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-display font-black text-primary-500 mb-2">Sign In</h2>
                <p className="text-gray-600 font-semibold">Access your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border-2 border-red-400 rounded-xl">
                    <p className="text-sm font-bold text-red-700">{error}</p>
                  </div>
                )}
                {/* Email */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 text-black rounded-xl focus:outline-none focus:ring-3 focus:ring-primary-300 border-2 border-black font-semibold transition-all placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 text-black rounded-xl focus:outline-none focus:ring-3 focus:ring-primary-300 border-2 border-black font-semibold transition-all placeholder:text-gray-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-primary-500 cursor-pointer border-2 border-black rounded"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-black transition-colors font-semibold">
                      Remember me
                    </span>
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs text-primary-500 hover:text-secondary-500 font-black transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="group w-full py-3 bg-secondary-500 text-white font-black rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-0.5 bg-gray-300 rounded-full" />
                <span className="text-xs text-gray-600 font-bold">or continue with</span>
                <div className="flex-1 h-0.5 bg-gray-300 rounded-full" />
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <Github className="w-4 h-4 text-black" />
                  <span className="font-black text-black text-sm">GitHub</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <Chrome className="w-4 h-4 text-black" />
                  <span className="font-black text-black text-sm">Google</span>
                </motion.button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-gray-600 font-semibold text-sm">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-primary-500 hover:text-secondary-500 font-black transition-colors inline-flex items-center gap-1 group">
                    Sign Up
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
