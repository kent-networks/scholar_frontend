'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { ArrowLeft, Download, Hand, Link2, Share2 } from 'lucide-react'

// No user required - public access

const contentData: Record<string, any> = {
  '1': {
    title: 'Science Oxygen',
    author: 'simon@uchoter',
    content: 'This is a comprehensive study on the role of oxygen in scientific research. Oxygen plays a crucial role in various scientific processes and research methodologies.',
    category: 'Research',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
  },
  '2': {
    title: 'Web Development',
    author: 'Justine@scholar',
    content: 'Exploring modern web development practices, frameworks, and best practices for building scalable applications.',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
  },
}

export default function ContentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contentId = params.id as string
  const content = contentData[contentId] || contentData['1']
  
  const [reaction, setReaction] = useState('')
  const [hi5Count, setHi5Count] = useState(0)

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Content Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                {content.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{content.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span>By {content.author}</span>
            </div>
          </div>

          {/* Main Content Image */}
          <div className="mb-8 rounded-xl overflow-hidden">
            <img src={content.image} alt={content.title} className="w-full h-96 object-cover" />
          </div>

          {/* Content Body */}
          <div className="mb-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">{content.content}</p>
            </div>
          </div>

          {/* Reaction Section */}
          <div className="mb-8 p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800">
            <label htmlFor="reaction" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Add your reaction
            </label>
            <textarea
              id="reaction"
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setHi5Count(hi5Count + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
            >
              <Hand className="h-4 w-4" />
              <span>Hi5</span>
              {hi5Count > 0 && <span className="text-sm">({hi5Count})</span>}
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Get</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Link2 className="h-4 w-4" />
              <span>Link</span>
            </button>
          </div>

          {/* Related Videos Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-surface-light dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-slate-800 p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg mb-3"></div>
                  <h3 className="font-medium text-slate-900 dark:text-white">Related Video {i}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-64 border-l border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark flex-shrink-0 p-6 overflow-y-auto">
        <div className="space-y-4">
          <div className="text-right">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">SCHOLAR</h2>
            <div className="space-y-2">
              <Link
                href="/research-lab"
                className="block text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Research-Lab
              </Link>
              <Link
                href="/scoop"
                className="block text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                  Scoop
                </span>
              </Link>
              <Link
                href="/environment"
                className="block text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Environment
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

