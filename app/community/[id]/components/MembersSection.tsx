"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inbox, Search, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { communityApi, CommunityMember } from "@/lib/api/communities";
import toast from "react-hot-toast";

interface MembersSectionProps {
  communityId: number;
  isOwner: boolean;
}

export default function MembersSection({ communityId, isOwner }: MembersSectionProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMembers(true);
  }, [communityId]);

  const fetchMembers = async (reset = false) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;
      const result = await communityApi.getCommunityMembers(communityId, {
        limit: 50,
        offset: currentOffset,
        search: searchQuery || undefined,
      });

      if (reset) {
        setMembers(result.data);
      } else {
        setMembers((prev) => [...prev, ...result.data]);
      }
      setHasMore(result.pagination.hasMore);
      setOffset(result.pagination.offset + result.data.length);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchMembers(true);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      await communityApi.removeMember(communityId, memberId);
      toast.success("Member removed successfully");
      fetchMembers(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  };

  const handleInboxClick = (member: CommunityMember) => {
    router.push(`/inbox/${member.userId}`);
  };

  const handleProfileClick = (member: CommunityMember) => {
    router.push(`/profile/${member.username}`);
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members..."
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading && members.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading members...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">No members found</div>
      ) : (
        <>
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleProfileClick(member)}
                  className="flex-shrink-0"
                >
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </button>
                <button
                  onClick={() => handleProfileClick(member)}
                  className="flex-1 text-left"
                >
                  <p className="font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">
                    {member.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    @{member.username} • {member.role}
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleInboxClick(member)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-bold text-slate-900 dark:text-white"
                  >
                    <Inbox className="h-4 w-4" />
                    Inbox
                  </button>
                  {isOwner && member.userId !== user?.id && member.role !== "owner" && (
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => fetchMembers(false)}
                disabled={loading}
                className="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

