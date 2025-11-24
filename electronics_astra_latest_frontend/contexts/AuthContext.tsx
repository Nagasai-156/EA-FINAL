'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (from localStorage) with minimal delay
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          // Ensure user data has required fields
          if (userData?.email && userData?.firstName && userData?.lastName) {
            setUser(userData)
          } else {
            // Clear invalid user data
            localStorage.removeItem('user')
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    // Use requestAnimationFrame for smooth initialization
    requestAnimationFrame(initAuth)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulate API call with smooth loading
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      firstName: email.split('@')[0] || 'User',
      lastName: 'Engineer'
    }
    
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    
    // Smooth navigation with slight delay for better UX
    setTimeout(() => router.push('/problems'), 100)
  }

  const signUp = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    // Simulate API call with smooth loading
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockUser: User = {
      id: Date.now().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName
    }
    
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    
    // Smooth navigation with slight delay for better UX
    setTimeout(() => router.push('/problems'), 100)
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
