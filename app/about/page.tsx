"use client";

import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { GraduationCap, Users, Target, Zap } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: GraduationCap,
      title: "Excellence in Education",
      description: "We strive for the highest standards in academic research and learning.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Building bridges between researchers, educators, and students worldwide.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Pushing boundaries and exploring new frontiers in academic research.",
    },
    {
      icon: Zap,
      title: "Accessibility",
      description: "Making knowledge accessible to everyone, everywhere.",
    },
  ];

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
            About Scholar
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 md:text-xl">
            Your Academic Ecosystem for Research, Collaboration, and Discovery
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Scholar is dedicated to creating a unified platform where researchers, educators, and students
              can connect, collaborate, and share groundbreaking research. We believe that knowledge should be
              accessible, collaborative, and transformative.
            </p>
          </motion.section>

          {/* Values Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Our Values</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="p-6 border rounded-xl bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                          {value.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">{value.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Vision Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
            <p className="text-slate-700 dark:text-slate-300">
              We envision a world where academic research is seamlessly connected, where collaboration
              transcends boundaries, and where knowledge flows freely to inspire the next generation of
              innovators and thinkers.
            </p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

