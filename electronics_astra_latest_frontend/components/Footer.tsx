'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Mail, Zap, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-secondary-800 border-t-4 border-black py-16 transition-colors">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-accent-500 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-display font-black text-white">
                Electronics<span className="text-accent-400">Astra</span>
              </h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed font-semibold">
              Empowering electronics engineers through gamified learning! 🚀
            </p>
          </div>
          
          {/* Platform */}
          <div>
            <h4 className="font-black mb-4 text-white text-lg">Platform</h4>
            <ul className="space-y-3 text-white/70 text-sm font-semibold">
              <li><Link href="/problems" className="hover:text-accent-400 transition-colors">Problems</Link></li>
              <li><Link href="/profile" className="hover:text-accent-400 transition-colors">Profile</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Leaderboard</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Courses</Link></li>
            </ul>
          </div>
          
          {/* Community */}
          <div>
            <h4 className="font-black mb-4 text-white text-lg">Community</h4>
            <ul className="space-y-3 text-white/70 text-sm font-semibold">
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Forums</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Discussions</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Events</Link></li>
              <li><Link href="#" className="hover:text-accent-400 transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h4 className="font-black mb-4 text-white text-lg">Connect</h4>
            <div className="flex gap-3 mb-6">
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }} 
                href="#" 
                className="p-3 bg-white rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <Github className="w-5 h-5 text-primary-700" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }} 
                href="#" 
                className="p-3 bg-white rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <Twitter className="w-5 h-5 text-secondary-600" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }} 
                href="#" 
                className="p-3 bg-white rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <Linkedin className="w-5 h-5 text-primary-600" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }} 
                href="#" 
                className="p-3 bg-white rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <Mail className="w-5 h-5 text-accent-600" />
              </motion.a>
            </div>
            <p className="text-white/70 text-xs font-semibold">
              contact@electronicsastra.com
            </p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm font-semibold flex items-center gap-2">
            © 2024 ElectronicsAstra. Made with <Heart className="w-4 h-4 text-accent-400 fill-accent-400" /> for engineers
          </p>
          <div className="flex gap-6 text-white/70 text-sm font-semibold">
            <Link href="#" className="hover:text-accent-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-accent-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-accent-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
