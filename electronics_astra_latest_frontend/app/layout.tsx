import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import PerformanceOptimizer from '@/components/PerformanceOptimizer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ 
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Electronics Astra - Gamified Learning Platform',
  description: 'Learn. Build. Simulate. Compete.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <head>
        <meta name="color-scheme" content="light only" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-neutral-100`} style={{ colorScheme: 'light' }}>
        <PerformanceOptimizer />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
