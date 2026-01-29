"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, Users, FolderOpen, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminSummary } from "../../../lib/api/admin";

export interface SummaryCardItem {
  title: string;
  value: number;
  icon: LucideIcon;
}

interface AdminSummaryCardsProps {
  summary: AdminSummary | null;
  loading?: boolean;
  defaultExpanded?: boolean;
}

export default function AdminSummaryCards({
  summary,
  loading = false,
  defaultExpanded = true,
}: AdminSummaryCardsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const cards: SummaryCardItem[] = [
    { title: "Total users", value: summary?.totalUsers ?? 0, icon: Users },
    { title: "Active users", value: summary?.activeUsers ?? 0, icon: CheckCircle2 },
    { title: "Communities", value: summary?.totalCommunities ?? 0, icon: FolderOpen },
    { title: "Uploads", value: summary?.totalVideos ?? 0, icon: Video },
  ];

  return (
    <div className="mb-8 overflow-hidden border shadow-sm rounded-xl border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark">
      <button
        type="button"
        onClick={() => setIsExpanded((e) => !e)}
        className="flex items-center justify-between w-full px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
      >
        <span className="text-base font-semibold text-slate-900 dark:text-white">Summary</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-2 lg:grid-cols-4">
              {cards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    className="relative flex flex-col gap-4 p-6 transition-colors bg-white border rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="w-5 h-5" strokeWidth={1.5}/>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                        {loading ? "..." : card.value}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
