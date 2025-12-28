'use client'

import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

const researchProjects = [
  {
    id: 1,
    title: 'Advanced Quantum Computing Algorithms',
    description: 'Developing new quantum algorithms for complex computational problems',
    field: 'Quantum Physics',
    researchers: 12,
    status: 'Active',
    progress: 75,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'Sustainable Energy Solutions',
    description: 'Research on renewable energy sources and storage technologies',
    field: 'Environmental Science',
    researchers: 8,
    status: 'Active',
    progress: 60,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'AI-Powered Medical Diagnostics',
    description: 'Machine learning applications in early disease detection',
    field: 'Artificial Intelligence',
    researchers: 15,
    status: 'Active',
    progress: 45,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    title: 'Climate Change Impact Analysis',
    description: 'Comprehensive study on global climate patterns and their effects',
    field: 'Climate Science',
    researchers: 20,
    status: 'Active',
    progress: 80,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    title: 'Biotechnology Innovations',
    description: 'Novel approaches in genetic engineering and biotech applications',
    field: 'Biotechnology',
    researchers: 10,
    status: 'Active',
    progress: 55,
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    title: 'Neural Network Optimization',
    description: 'Improving efficiency and accuracy of deep learning models',
    field: 'Computer Science',
    researchers: 18,
    status: 'Active',
    progress: 70,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
  },
  {
    id: 7,
    title: 'Space Exploration Technologies',
    description: 'Advanced propulsion systems and space mission planning',
    field: 'Aerospace Engineering',
    researchers: 14,
    status: 'Active',
    progress: 40,
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop',
  },
  {
    id: 8,
    title: 'Marine Biology Research',
    description: 'Studying marine ecosystems and biodiversity conservation',
    field: 'Marine Science',
    researchers: 9,
    status: 'Active',
    progress: 65,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
  },
  {
    id: 9,
    title: 'Materials Science Breakthroughs',
    description: 'Development of new materials with unique properties',
    field: 'Materials Science',
    researchers: 11,
    status: 'Active',
    progress: 50,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
  },
]

const categories = ['All', 'Quantum Physics', 'AI', 'Environmental', 'Biotechnology', 'Computer Science']

export default function ResearchLabPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Research Lab</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Explore cutting-edge research projects and collaborate with researchers worldwide
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[20px]">article</span>
                <p className="text-xs font-bold uppercase tracking-wider">Publications</p>
              </div>
              <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">450+</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                <p className="text-xs font-bold uppercase tracking-wider">Active Projects</p>
              </div>
              <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">2,450</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[20px]">handshake</span>
                <p className="text-xs font-bold uppercase tracking-wider">Partners</p>
              </div>
              <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">156</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[20px]">people</span>
                <p className="text-xs font-bold uppercase tracking-wider">Researchers</p>
              </div>
              <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">89</p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  category === 'All'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:border-primary/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Research Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchProjects.map((project) => (
              <Link
                key={project.id}
                href={`/research/${project.id}`}
                className="group bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-primary/50"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                      {project.field}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="material-symbols-outlined text-base">people</span>
                      <span>{project.researchers} researchers</span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

