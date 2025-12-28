"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";

const contentItems = [
  {
    id: 1,
    title: "Science Oxygen: The Foundation of Life",
    category: "Research",
    description:
      "Exploring the fundamentals of oxygen in scientific research and its critical role in biological processes",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
    author: "Dr. Sarah Chen",
    views: 1240,
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Modern Web Development Practices",
    category: "Technology",
    description:
      "Comprehensive guide to modern web development practices, frameworks, and best practices for building scalable applications",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    author: "Prof. Michael Johnson",
    views: 890,
    date: "5 days ago",
  },
  {
    id: 3,
    title: "Machine Learning Fundamentals",
    category: "AI",
    description:
      "Introduction to machine learning algorithms, neural networks, and their applications in real-world scenarios",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    author: "Dr. Emily Rodriguez",
    views: 2100,
    date: "1 week ago",
  },
  {
    id: 4,
    title: "Quantum Computing Principles",
    category: "Physics",
    description:
      "Understanding quantum computing principles, qubits, and the future of computational technology",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
    author: "Prof. David Kim",
    views: 1560,
    date: "3 days ago",
  },
  {
    id: 5,
    title: "Climate Change Research Initiatives",
    category: "Environment",
    description:
      "Latest research on climate change mitigation strategies and sustainable environmental practices",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
    author: "Dr. Lisa Anderson",
    views: 980,
    date: "4 days ago",
  },
  {
    id: 6,
    title: "Biotechnology Breakthroughs",
    category: "Research",
    description:
      "Recent advances in biotechnology and their potential impact on healthcare and medicine",
    image:
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
    author: "Prof. James Wilson",
    views: 1340,
    date: "6 days ago",
  },
];

const stats = [
  { label: "Active Researchers", value: "2,450", icon: "science" },
  { label: "Research Projects", value: "1,230", icon: "folder" },
  { label: "Partner Institutions", value: "156", icon: "school" },
  { label: "Community Members", value: "12,890", icon: "groups" },
];

const featuredCategories = [
  { name: "Research Lab", href: "/research-lab", icon: "science", count: 450 },
  { name: "Scoop", href: "/scoop", icon: "article", count: 120 },
  { name: "Environment", href: "/environment", icon: "eco", count: 89 },
  { name: "Community", href: "/community", icon: "groups", count: 2340 },
];

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Hero Section */}
          <div className="mb-12 relative rounded-xl overflow-hidden shadow-lg shadow-blue-500/30 min-h-[300px]">
            {/* Background Image */}
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80"
              alt="Academic campus"
              className="absolute inset-0 object-cover w-full h-full"
            />
            {/* Blue Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/75 to-blue-700/75" />
            {/* Content */}
            <div className="relative z-10 p-8 text-white">
              <h1 className="mb-3 text-4xl font-bold">Welcome to Scholar</h1>
              <p className="mb-6 text-xl text-blue-100">
                Your academic ecosystem for research, collaboration, and
                community engagement
              </p>
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="px-6 py-3 font-semibold transition-colors bg-white rounded-lg shadow-sm text-primary hover:bg-blue-50"
                >
                  Get Started
                </Link>
                <Link
                  href="/research-lab"
                  className="px-6 py-3 font-semibold text-white transition-all border rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20"
                >
                  Explore Research
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary">
                  <span className="material-symbols-outlined">science</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Active Researchers
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  2,450
                </p>
              </div>
            </div>
            <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
              <div className="flex items-start justify-between">
                <div className="p-2 text-purple-600 rounded-lg bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400">
                  <span className="material-symbols-outlined">folder</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Research Projects
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  1,230
                </p>
              </div>
            </div>
            <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                  <span className="material-symbols-outlined">school</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Partner Institutions
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  156
                </p>
              </div>
            </div>
            <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined">groups</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Community Members
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  12,890
                </p>
              </div>
            </div>
          </div>

          {/* Featured Categories */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
              Explore Scholar
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {featuredCategories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="p-5 transition-all border shadow-sm group bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-primary/50"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
                      <span className="material-symbols-outlined">
                        {category.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {category.count} items
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Content */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Trending Research
              </h2>
              <Link
                href="/research-lab"
                className="flex items-center gap-2 font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                View All
                <span className="text-lg material-symbols-outlined">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {contentItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/content/${item.id}`}
                  className="overflow-hidden transition-all duration-300 border shadow-sm group bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-primary/50"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute flex items-center gap-2 px-2 py-1 text-xs text-white rounded-full bottom-4 right-4 bg-black/50 backdrop-blur-sm">
                      <span className="text-sm material-symbols-outlined">
                        visibility
                      </span>
                      {item.views}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-xl font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>By {item.author}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
