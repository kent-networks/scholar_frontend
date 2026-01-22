"use client";

import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { BookOpen, Video, Users, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    icon: BookOpen,
    title: "Access Research",
    description: "Explore thousands of research papers and academic resources",
  },
  {
    icon: Video,
    title: "Learn from Videos",
    description: "Watch educational content from top educators and creators",
  },
  {
    icon: Users,
    title: "Join Communities",
    description: "Connect with students and experts in your field",
  },
  {
    icon: Award,
    title: "Build Your Profile",
    description: "Showcase your work and achievements",
  },
];

export default function ForStudentsPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <TopNav />

      <main>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For Students</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Discover research, learn from experts, and connect with a global community of learners
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

