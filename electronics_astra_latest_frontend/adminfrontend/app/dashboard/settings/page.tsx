'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Shield, Lock, Save, Check } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [submissionAlerts, setSubmissionAlerts] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saved, setSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    // Load settings from localStorage
    setEmail(localStorage.getItem('adminEmail') || '')
    setName(localStorage.getItem('adminName') || 'Admin User')
    setEmailNotifications(localStorage.getItem('emailNotifications') !== 'false')
    setSubmissionAlerts(localStorage.getItem('submissionAlerts') !== 'false')
  }, [])

  const handleSaveSettings = () => {
    // Save to localStorage
    localStorage.setItem('adminEmail', email)
    localStorage.setItem('adminName', name)
    localStorage.setItem('emailNotifications', emailNotifications.toString())
    localStorage.setItem('submissionAlerts', submissionAlerts.toString())
    
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChangePassword = () => {
    setPasswordError('')
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    
    // Mock password change
    alert('Password changed successfully!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-display font-black text-black">Settings</h1>
          <p className="text-gray-600 font-semibold mt-1">Manage your admin preferences</p>
        </div>

        {/* Success Message */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-bold">Settings saved successfully!</p>
          </motion.div>
        )}

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border-3 border-black shadow-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-display font-black text-black">Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold"
                placeholder="Admin User"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@electronicsastra.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold"
              />
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border-3 border-black shadow-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-accent-500" />
            <h2 className="text-xl font-display font-black text-black">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:bg-neutral-100 transition-colors">
              <div>
                <span className="font-bold text-gray-800 block">Email notifications</span>
                <span className="text-sm text-gray-600">Receive email updates about system changes</span>
              </div>
              <input 
                type="checkbox" 
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-5 h-5 accent-secondary-500" 
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:bg-neutral-100 transition-colors">
              <div>
                <span className="font-bold text-gray-800 block">Problem submission alerts</span>
                <span className="text-sm text-gray-600">Get notified when users submit solutions</span>
              </div>
              <input 
                type="checkbox" 
                checked={submissionAlerts}
                onChange={(e) => setSubmissionAlerts(e.target.checked)}
                className="w-5 h-5 accent-secondary-500" 
              />
            </label>
          </div>
        </motion.div>

        {/* Security - Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border-3 border-black shadow-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-secondary-500" />
            <h2 className="text-xl font-display font-black text-black">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold"
                placeholder="Confirm new password"
              />
            </div>
            
            {passwordError && (
              <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl">
                <p className="text-red-600 font-semibold text-sm">{passwordError}</p>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleChangePassword}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-xl font-bold border-2 border-black hover:bg-primary-600 transition-colors"
            >
              <Lock className="w-5 h-5" />
              Change Password
            </motion.button>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveSettings}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-secondary-500 text-white rounded-xl font-black border-3 border-black shadow-button hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </motion.button>
      </div>
    </AdminLayout>
  )
}
