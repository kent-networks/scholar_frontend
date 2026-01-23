"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  FlaskConical,
  Folder,
  GraduationCap,
  Link2,
  Users,
  Video,
} from "lucide-react";
import { statsApi, Stats, TrendingVideo } from "@/lib/api/stats";
import AnimatedCounter from "@/components/AnimatedCounter";


const featuredCategories = [
  { name: "Research Lab", href: "/research-lab", icon: FlaskConical, count: 450 },
  { name: "Scoop", href: "/scoop", icon: Video, count: 120 },
  { name: "Scholink", href: "/scholink", icon: Link2, count: 89 },
  { name: "Community", href: "/community", icon: Users, count: 2340 },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [trendingVideos, setTrendingVideos] = useState<TrendingVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        setScrollY(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, videosData] = await Promise.all([
          statsApi.getStats(),
          statsApi.getTrendingVideos(6),
        ]);
        setStats(statsData);
        setTrendingVideos(videosData);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const imageOffset = scrollY * 0.5;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <TopNav />

      {/* Main Content */}
      <main className="overflow-y-auto">
        <div className="">
          {/* Hero Section - Enhanced */}
          <div
            ref={heroRef}
            className="mb-12 relative overflow-hidden shadow-2xl shadow-primary/20 min-h-[400px] md:min-h-[500px]"
          >
            {/* Background Image with Parallax */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                transform: `translateY(${imageOffset}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80"
                alt="Academic campus"
                className="absolute inset-0 object-cover w-full h-full scale-110"
              />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/30" />
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }} />
            </div>
            {/* Content */}
            <div className="relative z-10 p-8 text-white md:p-12">
              <div className="max-w-6xl">
                
                <div className="w-40 h-2 mb-3 bg-primary"/>

                <div className="pb-2 text-5xl font-bold text-primary">
                  Scholar
                </div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-4 text-5xl font-bold leading-tight text-white md:text-6xl"
                >
                  Your Academic Ecosystem
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl"
                >
                  Connect, collaborate, and discover groundbreaking research in one unified platform
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="flex flex-col gap-4 sm:flex-row"
                >
                  <Link
                    href="/research-lab"
                    className="px-8 py-4 text-lg transition-all transform bg-white shadow-lg rounded-xl text-primary hover:scale-105"
                  >
                    Explore Research
                  </Link>
                  <Link
                    href="/login"
                    className="px-8 py-4 text-lg transition-all border-2 border-white rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/30"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8">
              
            {/* Stats Section */}
            <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Active Researchers
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                    {loading ? "..." : <AnimatedCounter value={stats?.activeResearchers || 0} prefix="+" />}
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <div className="p-2 text-purple-600 rounded-lg bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400">
                    <Folder className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Research Projects
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                    {loading ? "..." : <AnimatedCounter value={stats?.researchProjects || 0} prefix="+" />}
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Partner Institutions
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                    {loading ? "..." : <AnimatedCounter value={stats?.partnerInstitutions || 0} prefix="+" />}
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Community Members
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                    {loading ? "..." : <AnimatedCounter value={stats?.communityMembers || 0} prefix="+" />}
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
                  (() => {
                    const Icon = category.icon
                    return (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="p-5 transition-all border shadow-sm group bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-primary/50"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
                        <Icon className="w-5 h-5" />
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
                    )
                  })()
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
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="py-12 text-center col-span-full text-slate-500 dark:text-slate-400">
                    Loading trending content...
                  </div>
                ) : trendingVideos.length === 0 ? (
                  <div className="py-12 text-center col-span-full text-slate-500 dark:text-slate-400">
                    No trending content available
                  </div>
                ) : (
                  trendingVideos.map((item) => (
                    <Link
                      key={item.id}
                      href={`/scoop`}
                      className="overflow-hidden transition-all duration-300 border shadow-sm group bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-primary/50"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop"}
                          alt={item.title}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                            {item.category}
                          </span>
                        </div>
                        <div className="absolute flex items-center gap-2 px-2 py-1 text-xs text-white rounded-full bottom-4 right-4 bg-black/50 backdrop-blur-sm">
                          <Eye className="w-4 h-4" />
                          {item.views}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="mb-2 text-xl font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary line-clamp-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>By {item.author}</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
