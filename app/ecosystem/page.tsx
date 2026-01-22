"use client";

import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
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

      <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
            Scholar Ecosystem
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400">
            A comprehensive platform connecting students, educators, and creators in one unified academic ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="p-6 transition-all bg-white border group dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 hover:shadow-lg"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-400">{feature.description}</p>
                <div className="flex items-center font-bold text-primary">
                  Explore <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-8 text-center bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl md:p-12">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
            Ready to get started?
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            Join thousands of users already on Scholar
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 text-white transition-colors rounded-2xl bg-primary hover:bg-primary-dark"
          >
            Join Scholar
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

