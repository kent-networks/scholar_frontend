"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface CommunityCardProps {
  community: {
    id: number;
    name: string;
    description: string;
    memberCount: number;
    storageUsed: number;
    storageLimit: number;
  };
}

export default function CommunityCard({ community }: CommunityCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const storagePercentage = (community.storageUsed / community.storageLimit) * 100;

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    // TODO: Implement join community logic
    console.log("Join community", community.id);
  };

  return (
    <Link
      href={`/community/${community.id}`}
      className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all hover:border-primary/50 block"
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {community.name}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
        {community.description}
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Members</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {community.memberCount}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-400">Storage</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {community.storageUsed}MB / {community.storageLimit}MB
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={handleJoinClick}
          className="w-full mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors shadow-sm shadow-primary/30"
        >
          Join Community
        </button>
      </div>
    </Link>
  );
}

