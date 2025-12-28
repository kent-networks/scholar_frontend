'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

const partnerInstitutions = [
  { id: 1, name: 'Forest HU College', initial: 'F', description: 'Leading research institution in environmental sciences', programs: 12, students: 8500 },
  { id: 2, name: 'Tech University Global', initial: 'T', description: 'Premier technology and engineering university', programs: 18, students: 12000 },
  { id: 3, name: 'Medical Research Institute', initial: 'M', description: 'Advanced medical research and healthcare education', programs: 15, students: 6200 },
  { id: 4, name: 'Ocean Sciences Academy', initial: 'O', description: 'Marine biology and oceanography research center', programs: 8, students: 3400 },
  { id: 5, name: 'Quantum Physics Lab', initial: 'Q', description: 'Cutting-edge quantum computing research facility', programs: 10, students: 2100 },
  { id: 6, name: 'Sustainable Energy University', initial: 'S', description: 'Renewable energy and sustainability research', programs: 14, students: 7800 },
]

const allInstitutions = [
  ...partnerInstitutions,
  { id: 7, name: 'Advanced Computing Institute', initial: 'A', description: 'Computer science and AI research', programs: 16, students: 9500 },
  { id: 8, name: 'Biotechnology Center', initial: 'B', description: 'Biotech research and innovation hub', programs: 11, students: 5100 },
  { id: 9, name: 'Climate Research Foundation', initial: 'C', description: 'Climate science and environmental studies', programs: 9, students: 4200 },
  { id: 10, name: 'Data Science Academy', initial: 'D', description: 'Big data and analytics education', programs: 13, students: 6800 },
  { id: 11, name: 'Engineering Excellence University', initial: 'E', description: 'Engineering and applied sciences', programs: 20, students: 15000 },
]

export default function EnvironmentPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  const filteredInstitutions = allInstitutions.filter((inst) => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inst.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLetter = !selectedLetter || inst.name.charAt(0).toUpperCase() === selectedLetter
    return matchesSearch && matchesLetter
  })

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Environment</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Connect with other schools and institutions worldwide. Build partnerships and collaborate on research.
            </p>
          </div>

          {/* Link with other schools section */}
          <div className="mb-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-800 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Link with Other Schools</h2>
            <div className="flex items-center justify-center gap-8 mb-6">
              {partnerInstitutions.slice(0, 3).map((partner, index) => (
                <div key={partner.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-2xl mb-3 shadow-lg">
                      {partner.initial}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{partner.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{partner.programs} programs</span>
                  </div>
                  {index < 2 && (
                    <div className="flex-1 h-0.5 bg-primary-300 dark:bg-primary-700 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-slate-600 dark:text-slate-400">
              Join our network of {partnerInstitutions.length}+ partner institutions
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Search Institutions</h2>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for schools, colleges, or institutions..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined">search</span>
                Search
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                  className={`w-10 h-10 rounded-lg border font-medium transition-colors ${
                    selectedLetter === letter
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Institution */}
          <div className="mb-8 bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Featured Institution</h2>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full">
                Partner
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                F
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Forest HU College</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Leading partner institution in research and academic collaboration. Specializing in environmental sciences, sustainability, and interdisciplinary research.
                </p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{partnerInstitutions[0].programs}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Joint Programs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{partnerInstitutions[0].students.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Institutions Grid */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              All Institutions ({filteredInstitutions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstitutions.map((institution) => (
                <div
                  key={institution.id}
                  className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all hover:border-primary-300 dark:hover:border-primary-700"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl">
                      {institution.initial}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{institution.name}</h3>
                      {partnerInstitutions.find((p) => p.id === institution.id) && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded">
                          Partner
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{institution.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-base">folder</span>
                      <span>{institution.programs} programs</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-base">people</span>
                      <span>{institution.students.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

