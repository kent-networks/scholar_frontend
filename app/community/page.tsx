'use client'

import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

const activities = [
  {
    id: 1,
    type: 'event',
    title: 'Monthly Research Symposium',
    description: 'Join us for the monthly research symposium featuring presentations from leading researchers',
    author: 'Community Team',
    time: '2 hours ago',
    participants: 45,
    icon: 'event',
  },
  {
    id: 2,
    type: 'discussion',
    title: 'New Discussion: Climate Change Solutions',
    description: 'A new discussion thread has been started about innovative climate change solutions',
    author: 'Dr. Sarah Chen',
    time: '5 hours ago',
    participants: 23,
    icon: 'forum',
  },
  {
    id: 3,
    type: 'project',
    title: 'Community Project: Sustainable Campus Initiative',
    description: 'A new community project has been launched to make our campuses more sustainable',
    author: 'Environmental Committee',
    time: '1 day ago',
    participants: 67,
    icon: 'eco',
  },
  {
    id: 4,
    type: 'announcement',
    title: 'New Partnership with Forest HU College',
    description: 'We\'re excited to announce a new partnership that will expand research opportunities',
    author: 'Partnership Team',
    time: '2 days ago',
    participants: 0,
    icon: 'campaign',
  },
  {
    id: 5,
    type: 'workshop',
    title: 'Workshop: Introduction to Quantum Computing',
    description: 'Free workshop for community members interested in learning about quantum computing',
    author: 'Research Lab',
    time: '3 days ago',
    participants: 89,
    icon: 'science',
  },
  {
    id: 6,
    type: 'collaboration',
    title: 'New Collaborative Research Opportunity',
    description: 'Researchers from multiple institutions are invited to collaborate on a new project',
    author: 'Research Coordination',
    time: '4 days ago',
    participants: 12,
    icon: 'handshake',
  },
]

const upcomingEvents = [
  { id: 1, title: 'Annual Research Conference', date: '2024-02-15', location: 'Virtual', attendees: 1200 },
  { id: 2, title: 'Student Research Showcase', date: '2024-02-20', location: 'Main Campus', attendees: 450 },
  { id: 3, title: 'Industry Partnership Forum', date: '2024-02-25', location: 'Conference Center', attendees: 300 },
]

export default function CommunityPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Community Operations</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and participate in community activities, events, and collaborative projects
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">groups</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Active Members</h2>
              </div>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">12,890</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Community members</p>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">event</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Events</h2>
              </div>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">12</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Events this month</p>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">forum</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Active Discussions</h2>
              </div>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">234</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Ongoing conversations</p>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">handshake</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Projects</h2>
              </div>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">89</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Active projects</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activities */}
            <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Activities</h2>
                <Link
                  href="#"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary-600 dark:text-primary-400">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded">
                          {activity.type}
                        </span>
                      </div>
                      <p className="text-slate-900 dark:text-white font-semibold mb-1">{activity.title}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>By {activity.author}</span>
                        <div className="flex items-center gap-4">
                          {activity.participants > 0 && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">people</span>
                              {activity.participants}
                            </span>
                          )}
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Upcoming Events</h2>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{event.title}</h3>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">people</span>
                        <span>{event.attendees} registered</span>
                      </div>
                    </div>
                    <button className="mt-3 w-full px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors">
                      Register
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

