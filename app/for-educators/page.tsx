"use client";

import TopNav from "@/components/TopNav";
import { GraduationCap, Upload, BarChart, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Upload,
    title: "Share Content",
    description: "Upload videos, research, and educational materials",
  },
  {
    icon: BarChart,
    title: "Track Engagement",
    description: "Monitor how students interact with your content",
  },
  {
    icon: MessageSquare,
    title: "Engage with Students",
    description: "Answer questions and provide feedback",
  },
  {
    icon: GraduationCap,
    title: "Build Your Reputation",
    description: "Establish yourself as an expert in your field",
  },
];

export default function ForEducatorsPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <TopNav />

      <main>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For Educators</h1>
            <p className="text-xl text-purple-100 max-w-2xl">
              Share your knowledge, reach more students, and make a lasting impact
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors"
            >
              Join as Educator <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

