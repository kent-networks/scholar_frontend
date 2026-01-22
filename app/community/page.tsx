"use client";

import { useState } from "react";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import CommunityCard from "./components/CommunityCard";
import SearchBar from "../scoop/components/SearchBar";

const mockCommunities = [
  {
    id: 1,
    name: "Quantum Computing Research",
    description: "A community for researchers working on quantum computing and quantum algorithms",
    memberCount: 234,
    storageUsed: 30,
    storageLimit: 50,
  },
  {
    id: 2,
    name: "Environmental Science Network",
    description: "Collaborative space for environmental research and sustainability projects",
    memberCount: 456,
    storageUsed: 45,
    storageLimit: 100,
  },
  {
    id: 3,
    name: "AI & Machine Learning Lab",
    description: "Discussion and collaboration on AI research, neural networks, and ML applications",
    memberCount: 789,
    storageUsed: 28,
    storageLimit: 75,
  },
  {
    id: 4,
    name: "Biotechnology Innovations",
    description: "Sharing breakthroughs and research in biotechnology and medical sciences",
    memberCount: 321,
    storageUsed: 38,
    storageLimit: 60,
  },
  {
    id: 5,
    name: "Climate Action Research",
    description: "Research community focused on climate change solutions and environmental policy",
    memberCount: 567,
    storageUsed: 52,
    storageLimit: 80,
  },
  {
    id: 6,
    name: "Data Science Collective",
    description: "Community for data scientists, statisticians, and analytics researchers",
    memberCount: 890,
    storageUsed: 67,
    storageLimit: 120,
  },
];

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommunities = mockCommunities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto md:pb-0 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Community Discovery
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Find and join communities of researchers and scholars
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search communities..."
            />
          </div>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">No communities found</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
