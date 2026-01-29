"use client";

import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { GraduationCap, Users, Target, Zap, Sparkles } from "lucide-react";

const values = [
  {
    icon: GraduationCap,
    title: "Excellence in Education",
    description: "We pursue the highest standards in research quality, integrity, and impact.",
  },
  {
    icon: Users,
    title: "True Collaboration",
    description: "Connecting researchers, educators, and students across disciplines and borders.",
  },
  {
    icon: Target,
    title: "Bold Innovation",
    description: "Challenging conventions and exploring new ways to advance human knowledge.",
  },
  {
    icon: Zap,
    title: "Radical Accessibility",
    description: "Breaking down barriers so anyone, anywhere can access and contribute to science.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light via-slate-50/40 to-background-light dark:from-background-dark dark:via-slate-950/30 dark:to-background-dark">
      <TopNav />

      <main className="px-5 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-24 lg:py-28">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center lg:mb-28"
        >
          <h1 className="pb-1 text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl xl:text-7xl bg-clip-text bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-white dark:via-primary dark:to-white">
            About Bwati
          </h1>
          <p className="max-w-3xl mx-auto mt-5 text-xl font-light sm:text-2xl text-slate-600 dark:text-slate-300">
            Building the next generation academic ecosystem — open, collaborative, and fearless.
          </p>
        </motion.div>

        {/* Mission + Vision – stacked with visual separation */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 space-y-20 lg:space-y-28 lg:mb-28"
        >
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="flex items-center gap-3 mb-6 text-3xl font-bold lg:text-4xl text-slate-900 dark:text-white">
                <Sparkles className="w-9 h-9 text-primary" />
                Our Mission
              </h2>
              <p className="text-lg leading-relaxed prose text-slate-700 dark:text-slate-200 dark:prose-invert max-w-none">
                Bwati exists to empower researchers, educators, and students to connect, collaborate, and create — without friction. 
                We build tools that make high-quality research discoverable, discussion seamless, and global teamwork effortless.
              </p>
            </div>

            <div className="p-8 border shadow-xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl border-slate-200/70 dark:border-slate-700/40 rounded-3xl lg:p-10">
              <h2 className="mb-6 text-3xl font-bold lg:text-4xl text-slate-900 dark:text-white">
                Our Vision
              </h2>
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                A world where knowledge has no gatekeepers. Where breakthroughs happen faster because brilliant minds find each other instantly. 
                Where every student — no matter their background or location — can stand on the shoulders of giants.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Values */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="mb-12 text-3xl font-bold text-center lg:text-4xl text-slate-900 dark:text-white lg:mb-16">
            Core Values
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={cardVariants}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="relative overflow-hidden transition-all duration-300 border shadow-md group bg-white/70 dark:bg-slate-800/50 backdrop-blur-lg border-slate-200/60 dark:border-slate-700/40 rounded-2xl p-7 hover:shadow-2xl"
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className="mb-5 inline-flex p-3.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:from-primary/20 group-hover:to-primary/10 transition-all">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold transition-colors text-slate-900 dark:text-white group-hover:text-primary">
                      {value.title}
                    </h3>
                    <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Optional small CTA / closing statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center lg:mt-32"
        >
          <p className="max-w-3xl mx-auto text-xl text-slate-700 dark:text-slate-200">
            We're just getting started — and we're looking for curious, kind, and capable people to help shape the future of knowledge.
          </p>
          <a
            href="/careers"
            className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Join the mission →
          </a>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}