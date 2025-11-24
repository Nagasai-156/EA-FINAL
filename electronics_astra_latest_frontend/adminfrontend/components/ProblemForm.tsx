'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Eye } from 'lucide-react'
import MetadataSection from './form/MetadataSection'
import DescriptionSection from './form/DescriptionSection'
import ExamplesSection from './form/ExamplesSection'
import CodeEditorsSection from './form/CodeEditorsSection'
import SolutionExplanationSection from './form/SolutionExplanationSection'
import AutogradingSection from './form/AutogradingSection'

interface ProblemFormProps {
  onSave: (data: any, publish: boolean) => void
  saving: boolean
  initialData?: any
}

export default function ProblemForm({ onSave, saving, initialData }: ProblemFormProps) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    slug: '',
    category: 'VLSI',
    difficulty: 'BEGINNER',
    languages: [],
    points: 100,
    tags: [],
    description: '',
    diagram_url: '',
    diagram_upload_type: 'url',
    examples: [],
    verilog: {
      studentTemplate: '',
      testbench: '',
      referenceSolution: ''
    },
    vhdl: {
      studentTemplate: '',
      testbench: '',
      referenceSolution: ''
    },
    explanation: '',
    hints: ['', '', ''],
    settings: {
      waveform: true,
      timeout: 3000
    },
    isActive: false
  })

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    if (!initialData) {
      setFormData({ ...formData, title, slug: generateSlug(title) })
    } else {
      setFormData({ ...formData, title })
    }
  }

  const validateForm = () => {
    if (!formData.title || !formData.slug || !formData.description) {
      alert('Please fill in all required fields (Title, Slug, Description)')
      return false
    }
    if (!formData.languages || formData.languages.length === 0) {
      alert('Please select at least one language (Verilog or VHDL)')
      return false
    }
    
    // Validate Verilog code if selected
    if (formData.languages.includes('VERILOG')) {
      if (!formData.verilog?.studentTemplate || !formData.verilog?.testbench) {
        alert('Please provide Verilog Student Template and Testbench code')
        return false
      }
    }
    
    // Validate VHDL code if selected
    if (formData.languages.includes('VHDL')) {
      if (!formData.vhdl?.studentTemplate || !formData.vhdl?.testbench) {
        alert('Please provide VHDL Student Template and Testbench code')
        return false
      }
    }
    
    return true
  }

  const handleSave = (publish: boolean) => {
    if (!validateForm()) return
    onSave(formData, publish)
  }

  return (
    <div className="space-y-6">
      <MetadataSection 
        data={formData}
        onTitleChange={handleTitleChange}
        onUpdate={updateField}
      />

      <DescriptionSection 
        data={formData}
        onUpdate={updateField}
      />

      <ExamplesSection 
        data={formData}
        onUpdate={updateField}
      />

      <CodeEditorsSection 
        data={formData}
        onUpdate={updateField}
      />

      <SolutionExplanationSection 
        data={formData}
        onUpdate={updateField}
      />

      <AutogradingSection 
        data={formData}
        onUpdate={updateField}
      />

      {/* Action Buttons */}
      <div className="sticky bottom-4 bg-white rounded-2xl border-3 border-black shadow-sticker p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-500 text-white rounded-xl font-black border-3 border-black shadow-button hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            Save as Draft
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-secondary-500 text-white rounded-xl font-black border-3 border-black shadow-button hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                Publish Problem
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
