'use client'

import { useEffect } from 'react'

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLink = document.createElement('link')
      fontLink.rel = 'preload'
      fontLink.href = '/fonts/inter.woff2'
      fontLink.as = 'font'
      fontLink.type = 'font/woff2'
      fontLink.crossOrigin = 'anonymous'
      document.head.appendChild(fontLink)
    }

    // Optimize images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        if (!img.loading) {
          img.loading = 'lazy'
        }
      })
    }

    // Debounce resize events
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        // Handle resize logic here
        window.dispatchEvent(new Event('optimizedResize'))
      }, 250)
    }

    // Add performance optimizations
    preloadCriticalResources()
    optimizeImages()
    
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  return null // This component doesn't render anything
}