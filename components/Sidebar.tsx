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
  { name: 'Account', href: '/account', icon: UserCircle2, requiresAuth: true },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const isLoggedIn = mockLoggedIn

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
            <Icon className="h-6 w-6" />
            <span className="text-[10px] font-medium leading-tight text-center">{item.name}</span>
          </Link>
        )
      })}
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
        collapsed ? 'w-20' : 'w-72'
      } bg-[#030e2a] border-r border-white/10`}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <GraduationCap className="h-7 w-7 text-primary" />
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}
              >
                <h1 className="text-white text-xl font-bold leading-tight tracking-tight whitespace-nowrap">
                  Scholar
                </h1>
                <p className="text-slate-300/80 text-xs font-normal mt-0.5 whitespace-nowrap">
                  Academic Ecosystem
                </p>
              </div>
            </Link>
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="size-10 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-5 w-5 text-slate-200" />
              ) : (
                <PanelLeftClose className="h-5 w-5 text-slate-200" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {items.map((item) => {
            if (item.requiresAuth && !isLoggedIn) return null

            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            const Icon = item.icon

            if (item.name === 'Account') {
              const trigger = (
                <div
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span
                    className={`text-sm font-medium transition-all duration-300 overflow-hidden ${
                      collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                    }`}
                  >
                    Account
                  </span>
                </div>
              )

              return wrapTooltip(
                <ButtonDropdown
                  buttonContent={trigger}
                  buttonClassName="w-full"
                  options={[
                    {
                      label: 'Open Account',
                      value: 'account',
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
                />,
                'Account'
              )
            }

            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
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

        {/* User */}
        {isLoggedIn && (
          <div className="p-4 border-t border-white/10">
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                {(user?.name || 'Dr. Scholar').charAt(0).toUpperCase()}
              </div>
              <div
                className={`flex-1 text-left transition-all duration-300 overflow-hidden ${
                  collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}
              >
                <p className="text-sm font-bold truncate text-white">{user?.name || 'Dr. Scholar'}</p>
                <p className="text-xs text-slate-300/80 truncate">{user?.email || 'user@scholar'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}


