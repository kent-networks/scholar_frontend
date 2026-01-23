"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { communityApi, Community } from "@/lib/api/communities";
import CommunityCard from "./components/CommunityCard";
import SearchAndFilters from "./components/SearchAndFilters";
import Tabs from "./components/Tabs";
import CreateCommunityModal from "./components/CreateCommunityModal";
import { PlusIcon } from "lucide-react";

export default function CommunityPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [researchField, setResearchField] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState<"discover" | "my-communities" | "created">("discover");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCommunities = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
      }
      const currentOffset = reset ? 0 : offset;
      const result = await communityApi.getCommunities({
        search: searchQuery || undefined,
        limit: 20,
        offset: currentOffset,
      });
      
      if (reset) {
        setCommunities(result.data);
      } else {
        setCommunities((prev) => [...prev, ...result.data]);
      }
      setHasMore(result.pagination.hasMore);
      setOffset(result.pagination.offset + result.data.length);
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities(true);
  }, [searchQuery, researchField, type, size]);

  const filteredCommunities = communities.filter((community) => {
    if (researchField && community.category !== researchField) return false;
    // TODO: Add type and size filtering
    return true;
  });

  const handleCreateCommunity = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setShowCreateModal(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 pb-20 overflow-y-auto md:pb-0">
        <div className="max-w-[1024px] mx-auto px-6 py-8">
          {/* Page Heading */}
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div className="flex flex-col max-w-2xl gap-3">
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Community Discovery
              </h1>
              <p className="text-lg font-normal leading-relaxed text-slate-500 dark:text-slate-400">
                Connect with fellow researchers, join specialized groups, and accelerate your research
                impact through collaboration.
              </p>
            </div>
            <button
              onClick={handleCreateCommunity}
              className="flex min-w-[160px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-12 px-6 bg-primary text-white transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              {/* <span className="material-symbols-outlined">add</span> */}
              <PlusIcon className="w-6 h-6" />
              <span>Create Community</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            researchField={researchField}
            onResearchFieldChange={setResearchField}
            type={type}
            onTypeChange={setType}
            size={size}
            onSizeChange={setSize}
          />

          {/* Navigation Tabs */}
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Communities Grid */}
          {loading ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              Loading communities...
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              No communities found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCommunities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
              {/* Pagination/Load More */}
              {hasMore && (
                <div className="flex justify-center mt-12 mb-20">
                  <button
                    onClick={() => fetchCommunities(false)}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 font-semibold transition-all bg-white border rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    <span>{loading ? "Loading..." : "Show More Communities"}</span>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 pb-safe">
        <MobileBottomNav />
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <CreateCommunityModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            // Refresh communities
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
