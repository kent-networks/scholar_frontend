'use client'

import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

const availableLinks = [
  {
    id: 1,
    title: 'Research Database Access',
    description: 'Connect to comprehensive research databases and academic journals',
    type: 'Resource',
    institutions: 45,
    icon: 'database',
  },
  {
    id: 2,
    title: 'Collaborative Research Network',
    description: 'Join a network of researchers working on similar projects',
    type: 'Network',
    institutions: 78,
    icon: 'hub',
  },
  {
    id: 3,
    title: 'Student Exchange Program',
    description: 'Connect with institutions offering student exchange opportunities',
    type: 'Program',
    institutions: 32,
    icon: 'swap_horiz',
  },
  {
    id: 4,
    title: 'Joint Publication Platform',
    description: 'Platform for collaborative research publications',
    type: 'Platform',
    institutions: 56,
    icon: 'article',
  },
  {
    id: 5,
    title: 'Funding Opportunities',
    description: 'Access to research grants and funding opportunities',
    type: 'Resource',
    institutions: 89,
    icon: 'payments',
  },
  {
    id: 6,
    title: 'Academic Conference Network',
    description: 'Connect with academic conferences and symposiums',
    type: 'Network',
    institutions: 67,
    icon: 'event',
  },
]

const jointPrograms = [
  { id: 1, name: 'Climate Research Initiative', partners: 12, status: 'Active', description: 'Multi-institutional climate research program' },
  { id: 2, name: 'Quantum Computing Consortium', partners: 8, status: 'Active', description: 'Collaborative quantum computing research' },
  { id: 3, name: 'Sustainable Energy Partnership', partners: 15, status: 'Active', description: 'Renewable energy research collaboration' },
]

const jointAreas = [
  { name: 'Artificial Intelligence', programs: 23, researchers: 450 },
  { name: 'Environmental Science', programs: 18, researchers: 320 },
  { name: 'Biotechnology', programs: 15, researchers: 280 },
  { name: 'Quantum Physics', programs: 12, researchers: 190 },
  { name: 'Materials Science', programs: 14, researchers: 240 },
]

export default function ScholinkPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Scholink</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Connect and link with academic resources, partners, and collaborative opportunities
            </p>
          </div>

          {/* Available Links */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Available Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all hover:border-primary-300 dark:hover:border-primary-700"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">{link.icon}</span>
                    </div>
                    <div className="flex-1">
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded">
                        {link.type}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{link.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{link.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">school</span>
                      {link.institutions} institutions
                    </span>
                    <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors text-sm">
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Joint Program */}
          <div className="mb-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-800 p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-4xl">add</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">New Joint Program</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Start a collaborative program with other institutions. Create joint research initiatives, share resources, and work together on groundbreaking projects.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {jointPrograms.map((program) => (
                <div key={program.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{program.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{program.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">{program.partners} partners</span>
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">
                      {program.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
              Create New Program
            </button>
          </div>

          {/* New Joint Area */}
          <div className="mb-8 bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-600 dark:text-primary-400 text-4xl">arrow_forward</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Explore Joint Areas</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Discover collaborative research areas where multiple institutions work together
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {jointAreas.map((area) => (
                <div
                  key={area.name}
                  className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">{area.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Programs</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{area.programs}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Researchers</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{area.researchers}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
              Explore All Areas
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

