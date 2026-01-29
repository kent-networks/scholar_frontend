"use client";

import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ExternalLink, Sparkles } from "lucide-react";

const jobOpenings: any[] = [];

const perks = [
  { icon: Sparkles, text: "Work on projects that shape global research & education" },
  { icon: Sparkles, text: "Collaborate in a kind, high-talent, mission-driven team" },
  { icon: Sparkles, text: "Flexible hours, remote-first culture & strong benefits" },
  { icon: Sparkles, text: "Contribute to open-source & support academic progress" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-slate-50/40 dark:from-background-dark dark:to-slate-950/40">
      <TopNav />

      <main className="px-5 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-20 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
            Build the future of{" "}
            <span className="text-primary">academic collaboration</span>
          </h1>
          <p className="max-w-3xl mx-auto mt-5 text-xl text-slate-600 dark:text-slate-300">
            We're looking for curious, kind, and capable people who want to help researchers and students work better together.
          </p>
        </motion.div>

        {/* Perks / Why join – bento-like grid */}
        <motion.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <h2 className="mb-10 text-3xl font-bold text-center text-slate-900 dark:text-white">
            Why Bwati?
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                variants={item}
                className="relative p-6 transition-all duration-300 border shadow-sm group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/80 dark:border-slate-700/60 rounded-2xl hover:shadow-md hover:-translate-y-1"
              >
                <div className="absolute inset-0 transition-opacity opacity-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent group-hover:opacity-100" />
                <perk.icon className="w-8 h-8 mb-4 text-primary" />
                <p className="font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                  {perk.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Open Positions */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-12 text-3xl font-bold text-center text-slate-900 dark:text-white">
            Open Positions
          </h2>

          {jobOpenings.length > 0 ? (
            <div className="space-y-6 md:space-y-8">
              {jobOpenings.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative p-6 transition-all duration-300 bg-white border shadow-sm group dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-2xl md:p-8 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold transition-colors text-slate-900 dark:text-white group-hover:text-primary">
                        {job.title}
                      </h3>

                      <p className="mt-3 text-slate-600 dark:text-slate-300">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-full text-sm text-slate-700 dark:text-slate-200">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-full text-sm text-slate-700 dark:text-slate-200">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-full text-sm text-slate-700 dark:text-slate-200">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                      </div>
                    </div>

                    <motion.a
                      href="#" // ← replace with real link or modal trigger
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap min-w-[160px]"
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="px-6 py-16 text-center bg-white border dark:bg-slate-800/40 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-2xl"
            >
              <div className="max-w-md mx-auto">
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 dark:text-slate-100">
                  No open positions right now
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  We're currently not hiring, but our team is growing fast. 
                  Check back soon — or feel free to reach out if you think you'd be a great fit!
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <a
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-primary hover:bg-primary-dark rounded-xl"
                  >
                    Back Home
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Optional: always-visible "not the right role?" message when there ARE jobs */}
          {jobOpenings.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 text-center text-slate-600 dark:text-slate-400"
            >
              <p className="text-lg">
                Don't see a perfect match?
              </p>
              <a
                href="mailto:careers@scholar.app?subject=Spontaneous%20Application"
                className="inline-block mt-2 font-medium underline transition-colors text-primary hover:text-primary-dark underline-offset-4"
              >
                Drop us an open application →
              </a>
            </motion.div>
          )}
        </motion.section>

        </motion.section>
      </main>

      <Footer />
    </div>
  );
}