'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Tooltip from '@/components/Tooltip'
import { mockLoggedIn } from '@/lib/mockState'
import ButtonDropdown from '@/components/ButtonDropdown'
import {
  GraduationCap,
  FlaskConical,
  Video,
  Users,
  Link2,
  UserCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiresAuth?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Research Lab', href: '/research-lab', icon: FlaskConical },
  { name: 'Scoop', href: '/scoop', icon: Video },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Scholink', href: '/scholink', icon: Link2 },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const isLoggedIn = mockLoggedIn
  const mockUser = { name: "Dr. Scholar", email: "user@scholar" }

  return (
    <nav className="flex items-center justify-around px-2 py-2">
      {NAV_ITEMS.map((item) => {
        if (item.requiresAuth && !isLoggedIn) return null
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors min-w-[64px] ${
              isActive ? 'text-primary bg-primary/10' : 'text-slate-700'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-medium leading-tight text-center">{item.name}</span>
          </Link>
        )
      })}
      {/* Account button with photo on mobile */}
      {isLoggedIn && (
        <ButtonDropdown
          buttonContent={
            <div className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors min-w-[64px]">
              <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-primary">
                {(mockUser?.name || 'Dr. Scholar').charAt(0).toUpperCase()}
              </div>
              <span className="text-[10px] font-medium leading-tight text-center">Account</span>
            </div>
          }
          buttonClassName=""
          options={[
            {
              label: 'My Profile',
              value: 'profile',
              icon: UserCircle2,
              onClick: () => {
                window.location.href = '/account'
              },
            },
            {
              label: 'Settings',
              value: 'settings',
              icon: UserCircle2,
              onClick: () => {
                window.location.href = '/account'
              },
            },
            {
              label: 'Logout',
              value: 'logout',
              danger: true,
              icon: LogOut,
              onClick: () => console.log('Logout clicked'),
            },
          ]}
        />
      )}
    </nav>
  )
}

export default function Sidebar({ user }: { user?: { name: string; email: string } }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isLoggedIn = mockLoggedIn || !!user
  const items = useMemo(() => NAV_ITEMS, [])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('scholar.sidebarCollapsed')
      if (stored === '1') setCollapsed(true)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('scholar.sidebarCollapsed', collapsed ? '1' : '0')
    } catch {}
  }, [collapsed])

  const wrapTooltip = (node: React.ReactNode, label: string) => {
    if (!collapsed) return node
    return (
      <Tooltip content={label} position="right">
        {node}
      </Tooltip>
    )
  }

  return (
    <aside
      className={`hidden md:flex flex-col justify-between flex-shrink-0 h-screen overflow-hidden transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } bg-[#030e2a] border-r border-white/10`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-5 border-b border-white/10">
          <div className={`flex items-center gap-2 ${collapsed ? 'flex-col justify-center' : 'justify-between'}`}>
            <Link href="/" className={`flex items-center min-w-0 gap-2 ${collapsed ? 'flex-col' : ''}`}>
              <GraduationCap className="flex-shrink-0 h-7 w-7 text-primary" />
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  collapsed ? 'w-0 opacity-0 h-0' : 'w-auto opacity-100'
                }`}
              >
                <h1 className="text-xl font-bold leading-tight tracking-tight text-white whitespace-nowrap">
                  Scholar
                </h1>
                <p className="text-slate-300/80 text-xs font-normal mt-0.5 whitespace-nowrap">
                  Academic Ecosystem
                </p>
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCollapsed((v) => !v);
              }}
              className={`flex items-center justify-center transition-colors rounded-lg size-10 hover:bg-white/10 flex-shrink-0 ${
                collapsed ? 'mt-2' : ''
              }`}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-slate-200" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-slate-200" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 px-4 py-4 ${collapsed ? 'flex flex-col items-center justify-center space-y-2' : 'space-y-2 overflow-y-auto'}`}>
          {items.map((item) => {
            if (item.requiresAuth && !isLoggedIn) return null

            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            const Icon = item.icon

            const link = (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (collapsed) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Navigate directly without expanding
                    window.location.href = item.href;
                  }
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  collapsed ? 'justify-center w-12' : ''
                } ${
                  isActive
                    ? 'bg-white/10 text-white border-l-2 border-slate-200'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <Icon className="flex-shrink-0 w-5 h-5" />
                <span
                  className={`text-sm font-medium transition-all duration-300 overflow-hidden ${
                    collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            )
            return wrapTooltip(link, item.name)
          })}
        </nav>

        {/* User with Dropdown */}
        {isLoggedIn && (
          <div className="p-4 border-t border-white/10">
            <ButtonDropdown
              buttonContent={
                <div className={`flex items-center gap-3 w-full ${collapsed ? 'justify-center' : ''}`}>
                  <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white rounded-full w-9 h-9 bg-primary">
                    {(user?.name || 'Dr. Scholar').charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`flex-1 text-left transition-all duration-300 overflow-hidden ${
                      collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                    }`}
                  >
                    <p className="text-sm font-bold text-white truncate">{user?.name || 'Dr. Scholar'}</p>
                    <p className="text-xs truncate text-slate-300/80">{user?.email || 'user@scholar'}</p>
                  </div>
                </div>
              }
              buttonClassName="w-full hover:bg-white/5 rounded-lg p-2 transition-colors"
              options={[
                {
                  label: 'My Profile',
                  value: 'profile',
                  icon: UserCircle2,
                  onClick: () => {
                    window.location.href = '/account'
                  },
                },
                {
                  label: 'Settings',
                  value: 'settings',
                  icon: UserCircle2,
                  onClick: () => {
                    window.location.href = '/account'
                  },
                },
                {
                  label: 'Logout',
                  value: 'logout',
                  danger: true,
                  icon: LogOut,
                  onClick: () => console.log('Logout clicked'),
                },
              ]}
            />
          </div>
        )}
      </div>
    </aside>
  )
}


