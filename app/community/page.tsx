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
import NoDataYet from "@/components/NoDataYet";

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

  // Reset to discover tab if user logs out
  useEffect(() => {
    if (!isAuthenticated && (activeTab === "my-communities" || activeTab === "created")) {
      setActiveTab("discover");
    }
  }, [isAuthenticated, activeTab]);

  const fetchCommunities = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
      }
      const currentOffset = reset ? 0 : offset;
      
      // Determine filter based on active tab
      let filter: 'all' | 'discover' | 'joined' | 'created' = 'all';
      if (activeTab === 'discover') {
        filter = 'discover';
      } else if (activeTab === 'my-communities') {
        filter = 'joined';
      } else if (activeTab === 'created') {
        filter = 'created';
      }
      
      const result = await communityApi.getCommunities({
        search: searchQuery || undefined,
        limit: 20,
        offset: currentOffset,
        filter,
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
  }, [searchQuery, researchField, type, size, activeTab]);

  const filteredCommunities = communities.filter((community) => {
    if (researchField && community.category !== researchField) return false;
    // Type and size filtering can be added here if needed
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden transition-all bg-white border rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
                      <div className="w-20 h-6 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                      <div className="w-3/4 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    </div>
                    <div className="h-16 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    <div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    <div className="rounded-lg h-11 bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCommunities.length === 0 ? (
            <NoDataYet title="No communities found" message="Try adjusting your search or filter criteria" icon="search" />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCommunities.map((community) => (
                  <CommunityCard 
                    key={community.id} 
                    community={community} 
                    onUpdate={() => fetchCommunities(true)}
                  />
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
            fetchCommunities(true);
          }}
        />
      )}
    </div>
  );
}
