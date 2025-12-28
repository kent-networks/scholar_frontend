'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { name: 'Research Lab', href: '/research-lab', icon: 'science' },
  { name: 'Scoop', href: '/scoop', icon: 'article' },
  { name: 'Environment', href: '/environment', icon: 'eco' },
  { name: 'Community Operations', href: '/community', icon: 'groups' },
  { name: 'Scholink', href: '/scholink', icon: 'link' },
  { name: 'Account', href: '/account', icon: 'account_circle' },
]

export default function Sidebar({ user }: { user?: { name: string; email: string } }) {
  const pathname = usePathname()
  const [showLogout, setShowLogout] = useState(false)

  return (
    <aside className="flex w-72 flex-col justify-between border-r border-slate-200 bg-surface-light dark:border-slate-800 dark:bg-surface-dark flex-shrink-0 h-screen overflow-hidden">
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex flex-col">
            <h1 className="text-primary text-2xl font-bold leading-normal tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl">school</span>
              Scholar
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal mt-1">Academic Ecosystem</p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              pathname === '/'
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}>
              home
            </span>
            <span className="text-sm font-medium">Home</span>
          </Link>

          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  className="material-symbols-outlined group-hover:text-primary transition-colors"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowLogout(!showLogout)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>

              {showLogout && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <span className="material-symbols-outlined">logout</span>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors shadow-sm shadow-primary/30"
            >
              <span className="material-symbols-outlined">person_add</span>
              <span>Join Scholar</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}

