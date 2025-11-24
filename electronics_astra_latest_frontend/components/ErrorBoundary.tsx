'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-red-100 rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6"
            >
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </motion.div>
            
            <h1 className="text-4xl font-black text-black mb-4">Oops! Something went wrong</h1>
            <p className="text-lg text-gray-700 font-semibold mb-8">
              Don't worry, our engineers are on it! Try refreshing the page or go back to the homepage.
            </p>
            
            {this.state.error && (
              <details className="mb-8 text-left">
                <summary className="cursor-pointer font-bold text-gray-600 hover:text-black transition-colors">
                  Technical Details
                </summary>
                <pre className="mt-4 p-4 bg-gray-100 rounded-xl border-2 border-gray-300 text-sm overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.resetError}
                className="flex items-center gap-2 px-8 py-4 bg-secondary-500 text-white rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 px-8 py-4 bg-accent-500 text-black rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary