"use client";

import TopNav from "@/components/TopNav";
import { FlaskConical, Video, Users, Link2, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: FlaskConical,
    title: "Research Lab",
    description: "Discover and share groundbreaking research",
    href: "/research-lab",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Video,
    title: "Scoop",
    description: "Watch educational videos and content",
    href: "/scoop",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with peers and experts",
    href: "/community",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Link2,
    title: "Scholink",
    description: "Share and discover academic resources",
    href: "/scholink",
    color: "from-orange-500 to-orange-600",
  },
];

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <TopNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Scholar Ecosystem
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A comprehensive platform connecting students, educators, and creators in one unified academic ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{feature.description}</p>
                <div className="flex items-center text-primary font-bold">
                  Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Join thousands of users already on Scholar
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors"
          >
            Join Scholar
          </Link>
        </div>
      </main>
    </div>
  );
}

