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
import { statsApi, Stats, TrendingVideo, FeaturedCategory } from "@/lib/api/stats";
import AnimatedCounter from "@/components/AnimatedCounter";

type FeaturedCategoryWithIcon = FeaturedCategory & {
  icon: any;
};

const defaultFeaturedCategories: FeaturedCategoryWithIcon[] = [
  { name: "Research Lab", href: "/", icon: FlaskConical, count: 0 },
  { name: "Scoop", href: "/scoop", icon: Video, count: 0 },
  { name: "Scholink", href: "/scholink", icon: Link2, count: 0 },
  { name: "Community", href: "/community", icon: Users, count: 0 },
];

function attachCategoryIcons(categories: FeaturedCategory[]): FeaturedCategoryWithIcon[] {
  const iconByHref: Record<string, any> = {
    "/": FlaskConical,
    "/research-lab": FlaskConical,
    "/scoop": Video,
    "/scholink": Link2,
    "/community": Users,
  };

  return categories.map((c) => {
    const href = c.href === "/research-lab" ? "/" : c.href;
    return { ...c, href, icon: iconByHref[c.href] || iconByHref[href] || Users };
  });
}

export default function HomeLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [trendingVideos, setTrendingVideos] = useState<TrendingVideo[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<FeaturedCategoryWithIcon[]>(
    defaultFeaturedCategories
  );
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
        const [statsData, videosData, categoriesData] = await Promise.all([
          statsApi.getStats(),
          statsApi.getTrendingVideos(6),
          statsApi.getFeaturedCategories(),
        ]);
        setStats(statsData);
        setTrendingVideos(videosData);
        setFeaturedCategories(attachCategoryIcons(categoriesData));
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const imageOffset = scrollY * 0.5;

  // Animation Variants
  const heroContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  const barVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "10rem",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const scholarContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  };

  const scholarLetter = {
    hidden: { opacity: 0, y: 48, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const scholarText = "Bwati";
  const scholarLetters = Array.from(scholarText);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <TopNav />

      <main className="overflow-y-auto">
        <div className="">
          {/* Hero Section */}
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
                loading="eager"
                alt="Academic campus"
                className="absolute inset-0 object-cover w-full h-full scale-110"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/30" />

            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            {/* Hero Content with Animations */}
            <motion.div
              className="relative z-10 p-8 text-white md:p-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={heroContainer}
            >
              <div className="max-w-6xl">
                {/* Growing progress bar */}
                <motion.div
                  className="h-2 mb-3 rounded-full bg-primary"
                  variants={barVariants}
                  style={{ originX: 0 }}
                />

                {/* Scholar – letter by letter */}
                <motion.div
                  className="flex pb-2 text-5xl font-bold text-primary"
                  variants={scholarContainer}
                >
                  {scholarLetters.map((letter, i) => (
                    <motion.span
                      key={`${letter}-${i}`}
                      variants={scholarLetter}
                      className="inline-block"
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, delay: 1.1, ease: "easeOut" },
                    },
                  }}
                  className="mb-4 text-5xl font-bold leading-tight text-white md:text-6xl"
                >
                  Your Academic Ecosystem
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, delay: 1.3, ease: "easeOut" },
                    },
                  }}
                  className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl"
                >
                  Connect, collaborate, and discover groundbreaking research in one unified platform
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, delay: 1.5, ease: "easeOut" },
                    },
                  }}
                  className="flex flex-col gap-4 sm:flex-row"
                >
                  <Link
                    href="/"
                    className="px-8 py-4 text-lg font-medium transition-all transform bg-white shadow-lg rounded-xl text-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    Explore Research
                  </Link>
                  <Link
                    href="/login"
                    className="px-8 py-4 text-lg font-medium transition-all border-2 border-white rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="p-4 md:p-8">
            {/* Stats Section – all 4 cards restored */}
            <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
              {/* Active Researchers */}
              <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary">
                    <FlaskConical className="w-5 h-5" strokeWidth={1.5} />
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

              {/* Research Projects */}
              <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <div className="p-2 text-purple-600 rounded-lg bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400">
                    <Folder className="w-5 h-5" strokeWidth={1.5} />
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

              {/* Partner Institutions */}
              <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                    <GraduationCap className="w-5 h-5" strokeWidth={1.5} />
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

              {/* Community Members */}
              <div className="relative flex flex-col gap-4 p-6 transition-colors border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 group hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                    <Users className="w-5 h-5" strokeWidth={1.5}  />
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
                Explore Bwati
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {featuredCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="p-5 transition-all border shadow-sm group bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-primary/50"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
                          <Icon className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary">
                            {category.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {loading ? (
                              "..."
                            ) : (
                              <>
                                <AnimatedCounter value={category.count || 0} prefix="+" /> items
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Trending Content */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Trending Research
                </h2>
                <Link
                  href="/"
                  className="
                    group inline-flex items-center gap-2 px-5 py-2.5
                    text-sm font-medium text-primary
                    bg-white
                    hover:scale-105
                    active:bg-primary/90
                    border border-primary/20
                    rounded-full transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2
                  "
                >
                  View All
                  <ArrowRight className="w-4 h-4 transition-transform opacity-80 group-hover:translate-x-1" strokeWidth={1.5} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (

                  [...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200 dark:border-slate-800 dark:bg-surface-dark animate-pulse"
                    >
                      {/* Image placeholder */}
                      <div className="relative h-48 bg-slate-200 dark:bg-slate-700">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-wave" />
                      </div>

                      {/* Content placeholder */}
                      <div className="p-5 space-y-4">
                        {/* Category badge */}
                        <div className="w-24 h-5 rounded-full bg-slate-200 dark:bg-slate-700" />

                        {/* Title lines */}
                        <div className="space-y-2">
                          <div className="w-5/6 h-6 rounded bg-slate-200 dark:bg-slate-700" />
                          <div className="w-4/6 h-6 rounded bg-slate-200 dark:bg-slate-700" />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-700" />
                          <div className="w-5/6 h-4 rounded bg-slate-200 dark:bg-slate-700" />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between">
                          <div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-700" />
                          <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-700" />
                        </div>
                      </div>
                    </div>
                  ))

                ) : trendingVideos.length === 0 ? (
                  <div className="py-12 text-center col-span-full text-slate-500 dark:text-slate-400">
                    No trending content available
                  </div>
                ) : (
                  trendingVideos.map((item) => (
                    <Link
                      key={item.id}
                      href={`/?video=${item.id}`}
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
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
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
            <div className="flex justify-center md:hidden">
            <Link
              href="/"
              className="
                group inline-flex items-center gap-2 px-5 py-2.5
                text-sm font-medium text-primary
                bg-white
                hover:scale-105
                active:bg-primary/90
                border border-primary/20
                rounded-full transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2
              "
              >
                View All
                <ArrowRight className="w-4 h-4 transition-transform opacity-80 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
