'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment, useEffect, useMemo, useState } from 'react'
import Tooltip from '@/components/Tooltip'
import { useAuth } from '@/contexts/AuthContext'
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
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const displayUser = user ? { name: user.name, email: user.email, username: user.username, photo: user.profilePhotoPath } : null

  return (
    <nav className="flex items-center justify-around px-2 py-2">
      {NAV_ITEMS.map((item) => {
        if (item.requiresAuth && !isAuthenticated) return null
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
      {/* Profile button with dropdown - shows photo/initials only */}
      {isAuthenticated && displayUser && (
        <ButtonDropdown
          buttonContent={
            <div className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors min-w-[64px] ${
              pathname?.startsWith('/profile') ? 'text-primary bg-primary/10' : ''
            }`}>
              {displayUser.photo ? (
                <img
                  src={displayUser.photo}
                  alt={displayUser.name}
                  className="w-6 h-6 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-primary">
                  {displayUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          }
          buttonClassName=""
          options={[
            {
              label: 'My Profile',
              value: 'profile',
              icon: UserCircle2,
              onClick: () => {
                router.push(`/profile/${displayUser.username || displayUser.name.toLowerCase().replace(/\s+/g, '-')}`)
              },
            },
            {
              label: 'My Account',
              value: 'account',
              icon: UserCircle2,
              onClick: () => {
                router.push('/account')
              },
            },
            {
              label: 'Logout',
              value: 'logout',
              danger: true,
              icon: LogOut,
              onClick: async () => {
                await logout()
              },
            },
          ]}
        />
      )}
    </nav>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

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
    return <Tooltip content={label} position="right">{node}</Tooltip>
  }

  return (
    <aside
      className={`hidden md:flex flex-col flex-shrink-0 h-screen overflow-hidden transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } bg-[#030e2a] border-r border-white/10`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex-shrink-0 px-4 border-b border-white/10 ${collapsed ? 'py-3' : 'py-5'}`}>
          <div className={`flex items-center gap-2 ${collapsed ? 'flex-col justify-center gap-1' : 'justify-between'}`}>
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
                e.preventDefault()
                e.stopPropagation()
                setCollapsed((v) => !v)
              }}
              className="flex items-center justify-center flex-shrink-0 transition-colors rounded-lg size-10 hover:bg-white/10"
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

        {/* Main content – grows and pushes footer down */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Navigation */}
          <nav
            className={`
              px-3
              ${collapsed
                ? 'py-6 flex flex-col items-center space-y-5'
                : 'flex-1 py-4 space-y-1.5 overflow-y-auto'}
            `}
          >
            {items.map((item) => {
              if (item.requiresAuth && !isAuthenticated) return null

              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              const Icon = item.icon

              const content = collapsed ? (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className={`
                    flex items-center justify-center size-11 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-white/10 text-white border-l-2 border-slate-200'
                      : 'text-slate-200 hover:bg-white/10 active:bg-white/15'}
                  `}
                  aria-label={item.name}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                    ${isActive
                      ? 'bg-white/10 text-white border-l-2 border-slate-200'
                      : 'text-slate-200 hover:bg-white/10 active:bg-white/15'}
                  `}
                >
                  <Icon className="flex-shrink-0 w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              )

              return <Fragment key={item.href}>{wrapTooltip(content, item.name)}</Fragment>
            })}
          </nav>

          {/* Invisible spacer when collapsed → keeps user section at bottom */}
          {collapsed && <div className="flex-1" />}
        </div>

        {/* User section – always stays at bottom */}
        {isAuthenticated && user && (
          <div className="flex-shrink-0 p-2 border-t border-white/10">
            <ButtonDropdown
              buttonContent={
                <div className={`flex items-center gap-3 w-full ${collapsed ? 'justify-center' : ''}`}>
                  {user.profilePhotoPath ? (
                    <img
                      src={user.profilePhotoPath}
                      alt={user.name}
                      className="flex-shrink-0 w-9 h-9 rounded-full object-cover border-2 border-white/20"
                    />
                  ) : (
                    <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white rounded-full w-9 h-9 bg-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`flex-1 text-left transition-all duration-300 overflow-hidden ${
                      collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                    }`}
                  >
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs truncate text-slate-300/80">{user.email}</p>
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
                    router.push(`/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '-')}`)
                  },
                },
                {
                  label: 'My Account',
                  value: 'account',
                  icon: UserCircle2,
                  onClick: () => {
                    router.push('/account')
                  },
                },
                {
                  label: 'Logout',
                  value: 'logout',
                  danger: true,
                  icon: LogOut,
                  onClick: async () => {
                    await logout()
                  },
                },
              ]}
            />
          </div>
        )}
      </div>
    </aside>
  )
}