"use client";

import { useRouter } from "next/navigation";
import {
  Atom,
  Beaker,
  Leaf,
  Computer,
  Calculator,
  Globe,
  Landmark,
  LineChart,
  Briefcase,
  BookOpen,
  Languages,
  HeartPulse,
  MoreVertical,
  Cpu,
  Wheat,
  Lightbulb,
  Book,
  Users2,
  Edit2,
  Trash2,
  Users,
  FlaskConical
} from "lucide-react";
import { Community } from "@/lib/api/communities";
import { useAuth } from "@/contexts/AuthContext";
import { communityApi } from "@/lib/api/communities";
import toast from "react-hot-toast";
import { useState } from "react";
import ModalDialog from "@/components/ModalDialog";
import ButtonDropdown from "@/components/ButtonDropdown";

interface CommunityCardProps {
  community: Community;
  onUpdate?: () => void;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Biology: Beaker,
  Chemistry: Beaker,
  Physics: Atom,
  Mathematics: Calculator,
  Agriculture: Wheat,
  "Environmental Studies": Leaf,

  "ICT / Computer Studies": Computer,
  "Robotics & Innovation": Cpu,

  Geography: Globe,
  History: Landmark,
  Economics: LineChart,
  Entrepreneurship: Briefcase,

  "English Language & Literature": BookOpen,
  "Local Languages": Languages,

  "Health Education": HeartPulse,
  "Social Studies & Civics": Users2,

  "Religious Education": Book,
  "Innovation & Research Projects": Lightbulb,
};

const categoryColors: Record<
  string,
  { bg: string; text: string; hover: string }
> = {
  Biology: { bg: "bg-green-500/10", text: "text-green-600", hover: "group-hover:text-green-500" },
  Chemistry: { bg: "bg-emerald-500/10", text: "text-emerald-600", hover: "group-hover:text-emerald-500" },
  Physics: { bg: "bg-purple-500/10", text: "text-purple-600", hover: "group-hover:text-purple-500" },
  Mathematics: { bg: "bg-blue-500/10", text: "text-blue-600", hover: "group-hover:text-blue-500" },
  Agriculture: { bg: "bg-lime-500/10", text: "text-lime-600", hover: "group-hover:text-lime-500" },
  "Environmental Studies": { bg: "bg-teal-500/10", text: "text-teal-600", hover: "group-hover:text-teal-500" },

  "ICT / Computer Studies": { bg: "bg-sky-500/10", text: "text-sky-600", hover: "group-hover:text-sky-500" },
  "Robotics & Innovation": { bg: "bg-indigo-500/10", text: "text-indigo-600", hover: "group-hover:text-indigo-500" },

  Geography: { bg: "bg-cyan-500/10", text: "text-cyan-600", hover: "group-hover:text-cyan-500" },
  History: { bg: "bg-amber-500/10", text: "text-amber-600", hover: "group-hover:text-amber-500" },
  Economics: { bg: "bg-rose-500/10", text: "text-rose-600", hover: "group-hover:text-rose-500" },
  Entrepreneurship: { bg: "bg-orange-500/10", text: "text-orange-600", hover: "group-hover:text-orange-500" },

  "English Language & Literature": { bg: "bg-slate-500/10", text: "text-slate-600", hover: "group-hover:text-slate-500" },
  "Local Languages": { bg: "bg-fuchsia-500/10", text: "text-fuchsia-600", hover: "group-hover:text-fuchsia-500" },

  "Health Education": { bg: "bg-red-500/10", text: "text-red-600", hover: "group-hover:text-red-500" },
  "Social Studies & Civics": { bg: "bg-pink-500/10", text: "text-pink-600", hover: "group-hover:text-pink-500" },

  "Religious Education": { bg: "bg-yellow-500/10", text: "text-yellow-600", hover: "group-hover:text-yellow-500" },
  "Innovation & Research Projects": { bg: "bg-violet-500/10", text: "text-violet-600", hover: "group-hover:text-violet-500" },
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
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const category = community.category || "Research";
  const IconComponent = categoryIcons[category] || FlaskConical;
  
  // Get color config - use predefined if exists, otherwise use random from array
  const colorConfig = categoryColors[category] || 
    randomColors[category.charCodeAt(0) % randomColors.length];
  
  const isMember = community.isMember || community.userRole === "owner" || community.userRole === "admin" || community.userRole === "member";
  const isOwner = community.userRole === "owner";
  const isGlobalAdmin = (user?.role || "") === "admin";

  const formatMemberCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handleClick = async () => {
    if (isMember || isOwner || isGlobalAdmin) {
      router.push(`/community/${community.id}`);
    } else {
      // Join community
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      setJoinOpen(true);
    }
  };

  return (
    <div className="contents">
      <div className="overflow-hidden transition-all bg-white border group dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 hover:shadow-xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`${colorConfig.bg} p-3 rounded-lg ${colorConfig.text} relative`}>
              <IconComponent className="w-8 h-8" />
              {isMember && community.notificationCount && community.notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {community.notificationCount > 99 ? "99+" : community.notificationCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`${colorConfig.bg} ${colorConfig.text} text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded`}
              >
                {category}
              </span>

              {isGlobalAdmin && (
                <div onClick={(e) => e.stopPropagation()}>
                  <ButtonDropdown
                    buttonContent={<MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-300" strokeWidth={1.5}/>}
                    buttonClassName="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    options={[
                      {
                        label: "Edit community",
                        value: "edit",
                        icon: Edit2,
                        onClick: () => router.push(`/community/${community.id}?edit=1`),
                      },
                      {
                        label: "Delete community",
                        value: "delete",
                        icon: Trash2,
                        danger: true,
                        onClick: () => setDeleteOpen(true),
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
          <h3
            className={`text-slate-900 dark:text-white text-xl font-bold mb-2 ${colorConfig.hover} transition-colors`}
          >
            {community.name}
          </h3>
          <p className="mb-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
            {community.description || "No description available"}
          </p>
          {community.institutionName ? (
            <p className="mb-4 text-xs font-medium text-primary dark:text-primary/90">
              {community.institutionName}
            </p>
          ) : null}
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
            } font-bold rounded-2xl transition-colors disabled:opacity-50`}
          >
            {loading ? "Joining..." : isMember || isOwner ? "Open Community" : "Join Community"}
          </button>
        </div>
      </div>

      {joinOpen && (
        <ModalDialog
          isOpen={joinOpen}
          onClose={() => {
            setJoinOpen(false);
            setJoinCode("");
          }}
          title="Join Community"
          width="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter the community code to join.
            </p>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Community code"
              className="w-full px-4 py-3 bg-white border rounded-xl dark:bg-surface-dark border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setJoinOpen(false);
                  setJoinCode("");
                }}
                className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    await communityApi.joinCommunityWithCode(community.id, joinCode);
                    toast.success("Successfully joined community");
                    setJoinOpen(false);
                    setJoinCode("");
                    onUpdate?.();
                  } catch (error: any) {
                    toast.error(error.response?.data?.message || "Failed to join community");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="px-4 py-2 font-bold text-white rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50"
              >
                Join
              </button>
            </div>
          </div>
        </ModalDialog>
      )}

      {deleteOpen && (
        <ModalDialog
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          title="Delete community"
          width="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This will permanently delete <span className="font-bold">{community.name}</span> and all its content.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={async () => {
                  try {
                    setDeleting(true);
                    await communityApi.deleteCommunity(community.id);
                    toast.success("Community deleted");
                    setDeleteOpen(false);
                    onUpdate?.();
                  } catch (e: any) {
                    toast.error(e?.response?.data?.message || "Failed to delete community");
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </ModalDialog>
      )}
    </div>
  );
}
