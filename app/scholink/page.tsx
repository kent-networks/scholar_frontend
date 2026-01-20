"use client";

import Sidebar, { MobileBottomNav } from "@/components/Sidebar";

// Mock state
const mockIsPaidSchool = false; // Change to true to see competitions

const mockCompetitions = [
  {
    id: 1,
    name: "International Science Fair 2024",
    category: "Science",
    institution: "Global Science Foundation",
    date: "2024-06-15",
  },
  {
    id: 2,
    name: "AI Innovation Challenge",
    category: "Technology",
    institution: "Tech University",
    date: "2024-07-20",
  },
  {
    id: 3,
    name: "Environmental Research Competition",
    category: "Environment",
    institution: "Green Institute",
    date: "2024-08-10",
  },
  {
    id: 4,
    name: "Biotechnology Excellence Award",
    category: "Biotechnology",
    institution: "Medical Research Center",
    date: "2024-09-05",
  },
];

export default function ScholinkPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto md:pb-0 pb-20">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Scholink</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Access academic competitions and opportunities
            </p>
          </div>

          {!mockIsPaidSchool ? (
            /* Locked View */
            <div className="max-w-2xl mx-auto">
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-4xl text-slate-400">lock</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Upgrade to access Scholink
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  This feature is available for paid school accounts. Upgrade your account to access
                  academic competitions and exclusive opportunities.
                </p>
                <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors shadow-sm shadow-primary/30">
                  Upgrade Account
                </button>
              </div>
            </div>
          ) : (
            /* Competitions List */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCompetitions.map((competition) => (
                  <div
                    key={competition.id}
                    className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all hover:border-primary/50"
                  >
                    <div className="mb-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-2 inline-block">
                        {competition.category}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {competition.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {competition.institution}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(competition.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <button className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors shadow-sm shadow-primary/30">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 z-50 shadow-lg pb-safe">
        <MobileBottomNav />
      </div>
    </div>
  );
}
