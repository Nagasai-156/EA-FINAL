'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'

interface DiscussionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, content: string) => void
}

export default function DiscussionModal({ isOpen, onClose, onSubmit }: DiscussionModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit(title, content)
      setTitle('')
      setContent('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl border-4 border-black shadow-sticker max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-accent-100">
          <h2 className="text-2xl font-black text-black">New Discussion</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl transition-colors">
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block font-black text-black mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter discussion title..."
              className="w-full px-4 py-3 bg-neutral-100 text-black rounded-xl border-2 border-black focus:outline-none focus:ring-4 focus:ring-secondary-300 font-semibold placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="block font-black text-black mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, questions, or solutions..."
              rows={8}
              className="w-full px-4 py-3 bg-neutral-100 text-black rounded-xl border-2 border-black focus:outline-none focus:ring-4 focus:ring-secondary-300 font-semibold resize-none placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white text-black rounded-xl font-black border-2 border-black hover:bg-neutral-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              className="px-6 py-3 bg-accent-500 text-black rounded-xl font-black border-2 border-black shadow-button hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
            >
              Post Discussion
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
