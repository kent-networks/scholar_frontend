"use client";

import { useRouter } from "next/navigation";
import { Users, Brain, Atom, Leaf, Dna, Users2, Database, Computer, FlaskConical, Beaker } from "lucide-react";
import { Community } from "@/lib/api/communities";

interface CommunityCardProps {
  community: Community;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Neuroscience: Brain,
  "Quantum Physics": Atom,
  Environmental: Leaf,
  Genomics: Dna,
  "Social Sciences": Users2,
  "Data Science": Database,
  "Computer Science": Computer,
  Physics: Atom,
  Biotechnology: Beaker,
  "Environmental Science": Leaf,
};

const categoryColors: Record<string, { bg: string; text: string; hover: string }> = {
  Neuroscience: { bg: "bg-primary/10", text: "text-primary", hover: "group-hover:text-primary" },
  "Quantum Physics": { bg: "bg-amber-500/10", text: "text-amber-500", hover: "group-hover:text-amber-500" },
  Environmental: { bg: "bg-emerald-500/10", text: "text-emerald-500", hover: "group-hover:text-emerald-500" },
  Genomics: { bg: "bg-indigo-500/10", text: "text-indigo-500", hover: "group-hover:text-indigo-500" },
  "Social Sciences": { bg: "bg-rose-500/10", text: "text-rose-600", hover: "group-hover:text-rose-500" },
  "Data Science": { bg: "bg-violet-500/10", text: "text-violet-600", hover: "group-hover:text-violet-500" },
  "Computer Science": { bg: "bg-blue-500/10", text: "text-blue-600", hover: "group-hover:text-blue-500" },
  Physics: { bg: "bg-purple-500/10", text: "text-purple-600", hover: "group-hover:text-purple-500" },
  Biotechnology: { bg: "bg-indigo-500/10", text: "text-indigo-600", hover: "group-hover:text-indigo-500" },
  "Environmental Science": { bg: "bg-emerald-500/10", text: "text-emerald-600", hover: "group-hover:text-emerald-500" },
};

export default function CommunityCard({ community }: CommunityCardProps) {
  const router = useRouter();
  const category = community.category || "Research";
  const IconComponent = categoryIcons[category] || FlaskConical;
  const colorConfig = categoryColors[category] || { bg: "bg-primary/10", text: "text-primary", hover: "group-hover:text-primary" };
  const isActive = community.isActive ?? Math.random() > 0.5; // Mock for now
  const isMember = false; // TODO: Check if user is a member

  const formatMemberCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getActiveStatus = () => {
    if (isActive) {
      return { text: "Active now", color: "text-emerald-500" };
    }
    if (community.lastActive) {
      return { text: community.lastActive, color: "text-slate-400" };
    }
    return { text: "Active today", color: "text-slate-400" };
  };

  const activeStatus = getActiveStatus();

  return (
    <div className="overflow-hidden transition-all border group bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 hover:shadow-xl">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`${colorConfig.bg} p-3 rounded-lg ${colorConfig.text}`}>
            <IconComponent className="w-8 h-8" />
          </div>
          <span className={`${colorConfig.bg} ${colorConfig.text} text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded`}>
            {category}
          </span>
        </div>
        <h3 className={`text-slate-900 dark:text-white text-xl font-bold mb-2 ${colorConfig.hover} transition-colors`}>
          {community.name}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
          {community.description || "No description available"}
        </p>
        <div className="flex items-center justify-between text-xs font-medium text-slate-400 dark:text-slate-500 mb-6">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{formatMemberCount(community.memberCount)} Members</span>
          </div>
          <div className={`flex items-center gap-1 ${activeStatus.color}`}>
            {isActive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{activeStatus.text}</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                <span>{activeStatus.text}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            if (isMember) {
              router.push(`/community/${community.id}`);
            } else {
              // TODO: Handle join
            }
          }}
          className={`w-full h-11 ${
            isMember
              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
              : "bg-primary text-white hover:bg-primary/90"
          } font-bold rounded-lg transition-colors`}
        >
          {isMember ? "Open Community" : "Join Community"}
        </button>
      </div>
    </div>
  );
}
