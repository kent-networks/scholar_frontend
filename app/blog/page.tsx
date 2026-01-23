"use client";

import { useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Academic Research",
    excerpt: "Exploring how technology is transforming the way we conduct and share research.",
    author: "Dr. Sarah Chen",
    date: "January 15, 2024",
    category: "Research",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Building Collaborative Research Communities",
    excerpt: "How online platforms are bringing researchers together from around the world.",
    author: "Prof. Michael Johnson",
    date: "January 10, 2024",
    category: "Community",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Open Access: The Path Forward",
    excerpt: "The importance of making research accessible to everyone, everywhere.",
    author: "Dr. Emily Rodriguez",
    date: "January 5, 2024",
    category: "Open Access",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["All", "Research", "Community", "Open Access", "Technology"];

  const filteredPosts = selectedCategory && selectedCategory !== "All"
    ? blogPosts.filter((post) => post.category === selectedCategory)
    : blogPosts;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <TopNav />

      <main className="max-w-6xl mx-auto px-4 py-12 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            Blog
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 md:text-xl">
            Insights, updates, and stories from the Scholar community
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category || (category === "All" && !selectedCategory)
                  ? "bg-primary text-white"
                  : "bg-surface-light dark:bg-surface-dark text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-primary/50"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="overflow-hidden transition-all border shadow-sm group bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-primary/50"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="mb-2 text-xl font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary line-clamp-2">
                  {post.title}
                </h2>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary-dark font-medium"
                >
                  Read more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

