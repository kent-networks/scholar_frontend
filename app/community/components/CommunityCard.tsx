"use client";

import { useRouter } from "next/navigation";
import { Users, Brain, Atom, Leaf, Dna, Users2, Database, Computer, FlaskConical, Beaker } from "lucide-react";
import { Community } from "@/lib/api/communities";
import { useAuth } from "@/contexts/AuthContext";
import { communityApi } from "@/lib/api/communities";
import toast from "react-hot-toast";
import { useState } from "react";

interface CommunityCardProps {
  community: Community;
  onUpdate?: () => void;
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

// Random color array for categories not in predefined list
const randomColors = [
  { bg: "bg-primary/10", text: "text-primary", hover: "group-hover:text-primary" },
  { bg: "bg-amber-500/10", text: "text-amber-500", hover: "group-hover:text-amber-500" },
  { bg: "bg-emerald-500/10", text: "text-emerald-500", hover: "group-hover:text-emerald-500" },
  { bg: "bg-indigo-500/10", text: "text-indigo-500", hover: "group-hover:text-indigo-500" },
  { bg: "bg-rose-500/10", text: "text-rose-600", hover: "group-hover:text-rose-500" },
  { bg: "bg-violet-500/10", text: "text-violet-600", hover: "group-hover:text-violet-500" },
  { bg: "bg-blue-500/10", text: "text-blue-600", hover: "group-hover:text-blue-500" },
  { bg: "bg-purple-500/10", text: "text-purple-600", hover: "group-hover:text-purple-500" },
];

export default function CommunityCard({ community, onUpdate }: CommunityCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const category = community.category || "Research";
  const IconComponent = categoryIcons[category] || FlaskConical;
  
  // Get color config - use predefined if exists, otherwise use random from array
  const colorConfig = categoryColors[category] || 
    randomColors[category.charCodeAt(0) % randomColors.length];
  
  const isMember = community.isMember || community.userRole === "owner" || community.userRole === "admin" || community.userRole === "member";
  const isOwner = community.userRole === "owner";

  const formatMemberCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handleClick = async () => {
    if (isMember || isOwner) {
      router.push(`/community/${community.id}`);
    } else {
      // Join community
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      
      try {
        setLoading(true);
        await communityApi.joinCommunity(community.id);
        toast.success("Successfully joined community");
        onUpdate?.();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to join community");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="overflow-hidden transition-all bg-white border group dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 hover:shadow-xl">
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
        <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
          {community.description || "No description available"}
        </p>
        <div className="flex items-center mb-6 text-xs font-medium text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{formatMemberCount(community.memberCount)} Members</span>
          </div>
        </div>
        <button
          onClick={handleClick}
          disabled={loading}
          className={`w-full h-11 ${
            isMember || isOwner
              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
              : "bg-primary text-white hover:bg-primary/90"
          } font-bold rounded-lg transition-colors disabled:opacity-50`}
        >
          {loading ? "Joining..." : isMember || isOwner ? "Open Community" : "Join Community"}
        </button>
      </div>
    </div>
  );
}
