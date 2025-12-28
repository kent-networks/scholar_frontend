'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      router.push('/')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-background-dark dark:via-slate-900 dark:to-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-5xl text-primary-600 dark:text-primary-400">school</span>
            <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">Scholar</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Academic Ecosystem</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Join Scholar</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="account" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Account
              </label>
              <input
                id="account"
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your account"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Joining...
                </>
              ) : (
                'JOIN'
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Explore Scholar:</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/research-lab"
                className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Research Lab
              </Link>
              <Link
                href="/scoop"
                className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Scoop
              </Link>
              <Link
                href="/environment"
                className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Environment
              </Link>
              <Link
                href="/community"
                className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Community Operations
              </Link>
              <Link
                href="/scholink"
                className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Scholink
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



