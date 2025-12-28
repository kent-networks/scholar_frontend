'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-8">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary-600 dark:text-primary-400 text-4xl">account_circle</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sign in to access your account</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Create an account or sign in to manage your profile, preferences, and academic activities
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                Sign In / Join Scholar
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const mockUser = {
    name: 'Sam',
    email: 'sam@scholar',
    role: 'Researcher',
    institution: 'Forest HU College',
    joinDate: '2023-01-15',
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar user={mockUser} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Account Settings</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your account information and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Profile Information</h2>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {mockUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{mockUser.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{mockUser.email}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{mockUser.role} • {mockUser.institution}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                Change Profile Picture
              </button>
            </div>

            {/* Account Details */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Account Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    defaultValue={mockUser.name}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={mockUser.email}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Institution</label>
                  <input
                    type="text"
                    defaultValue={mockUser.institution}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Your Activity</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">12</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Projects</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">45</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Publications</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">8</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Collaborations</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">234</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Contributions</p>
                </div>
              </div>
            </div>

            {/* Preamble Section */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4"># Preamble</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Welcome to Scholar, your academic ecosystem for research, collaboration, and community engagement. 
                Share your academic journey, research interests, and professional background with the community.
              </p>
              <textarea
                placeholder="Add your preamble or bio... Share your research interests, academic background, and what you're working on."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={6}
              />
              <button className="mt-4 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                Save Preamble
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

