'use client'

import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

const scoopItems = [
  {
    id: 1,
    title: 'Revolutionary Breakthrough in Quantum Computing',
    excerpt: 'Scientists at Scholar Research Lab have discovered a new method for sustainable energy production that could revolutionize the industry. The breakthrough involves advanced quantum algorithms that optimize energy storage and distribution.',
    author: 'Dr. Jane Smith',
    date: '2 days ago',
    category: 'Research',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
    views: 2340,
    featured: true,
  },
  {
    id: 2,
    title: 'Annual Research Symposium 2024: Call for Papers',
    excerpt: 'Join us for the annual research symposium where researchers from around the world will present their latest findings. This year\'s theme focuses on sustainable technology and environmental solutions.',
    author: 'Community Team',
    date: '5 days ago',
    category: 'Event',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    views: 1890,
    featured: false,
  },
  {
    id: 3,
    title: 'Forest HU College Partners with Scholar Platform',
    excerpt: 'We\'re excited to announce a new partnership with Forest HU College, expanding our network of academic institutions. This collaboration will enable joint research programs and student exchanges.',
    author: 'Partnership Team',
    date: '1 week ago',
    category: 'Partnership',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
    views: 1560,
    featured: true,
  },
  {
    id: 4,
    title: 'New AI Research Lab Opens at Scholar',
    excerpt: 'The new state-of-the-art AI research lab is now open, featuring cutting-edge equipment and facilities for machine learning and artificial intelligence research.',
    author: 'Dr. Michael Chen',
    date: '3 days ago',
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    views: 2100,
    featured: false,
  },
  {
    id: 5,
    title: 'Climate Change Research Initiative Launched',
    excerpt: 'Scholar launches a comprehensive research initiative to study climate change impacts and develop sustainable solutions. The program involves multiple institutions and research teams.',
    author: 'Dr. Sarah Johnson',
    date: '4 days ago',
    category: 'Research',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop',
    views: 1780,
    featured: false,
  },
  {
    id: 6,
    title: 'Student Research Grant Program Now Accepting Applications',
    excerpt: 'Applications are now open for the 2024 Student Research Grant Program. This program supports undergraduate and graduate students in their research endeavors.',
    author: 'Grants Committee',
    date: '6 days ago',
    category: 'Opportunity',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
    views: 1450,
    featured: false,
  },
]

const categories = ['All', 'Research', 'Event', 'Partnership', 'Announcement', 'Opportunity']

export default function ScoopPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full mb-4">
              <span className="text-sm font-medium">Scoop</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Latest News & Updates</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Stay informed about the latest happenings in the Scholar community
            </p>
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

          {/* Featured Articles */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scoopItems
                .filter((item) => item.featured)
                .map((item) => (
                  <Link
                    key={item.id}
                    href={`/scoop/${item.id}`}
                    className="group bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-primary/50"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{item.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                        <span>By {item.author}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">visibility</span>
                            {item.views}
                          </span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* All Articles */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">All News</h2>
            <div className="space-y-6">
              {scoopItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/scoop/${item.id}`}
                  className="group block bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all hover:border-primary-300 dark:hover:border-primary-700"
                >
                  <div className="flex gap-6">
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                          {item.category}
                        </span>
                        {item.featured && (
                          <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{item.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                        <span>By {item.author}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">visibility</span>
                            {item.views}
                          </span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

