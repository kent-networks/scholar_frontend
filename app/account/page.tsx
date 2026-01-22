"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { KeyRound, Pencil, Activity, FileText, Users, Heart, Bookmark, Video, Grid3x3, List, Settings } from "lucide-react";
import Link from "next/link";

const mockMyVideos = [
  {
    id: 1,
    title: "Quantum Computing Explained",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop",
    views: 1240,
    likes: 89,
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=600&fit=crop",
    views: 2100,
    likes: 145,
  },
  {
    id: 3,
    title: "Sustainable Energy",
    thumbnail: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=600&fit=crop",
    views: 890,
    likes: 67,
  },
];

const mockLikedVideos = [
  {
    id: 4,
    title: "Climate Research",
    thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=600&fit=crop",
    views: 980,
    likes: 78,
  },
  {
    id: 5,
    title: "Biotech Breakthroughs",
    thumbnail: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=600&fit=crop",
    views: 1560,
    likes: 92,
  },
];

const mockSavedVideos = [
  {
    id: 6,
    title: "AI Research Methods",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=600&fit=crop",
    views: 1340,
    likes: 105,
  },
];

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"uploads" | "liked" | "saved">("uploads");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  // Use user data from auth context
  const displayUser = {
    name: user.name,
    role: user.role,
    email: user.email,
    photo: user.profilePhotoPath,
    followers: 0, // TODO: Get from API
    following: 0, // TODO: Get from API
    likes: 0, // TODO: Get from API
  };

  const getCurrentVideos = () => {
    switch (activeTab) {
      case "uploads":
        return mockMyVideos;
      case "liked":
        return mockLikedVideos;
      case "saved":
        return mockSavedVideos;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto md:pb-0 pb-20 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Account</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your profile, content, and settings</p>
          </div>

          {/* Profile Card - Modern Design */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl border border-primary/20 dark:border-primary/30 p-8 shadow-lg mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {displayUser.photo ? (
                <img
                  src={displayUser.photo}
                  alt={displayUser.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white dark:border-slate-800">
                  {displayUser.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {displayUser.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-1">{displayUser.role}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">{displayUser.email}</p>
                
                {/* Stats */}
                <div className="flex justify-center md:justify-start gap-6 mb-4">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-lg">{displayUser.followers.toLocaleString()}</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-lg">{displayUser.following}</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-1">Following</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-lg">{displayUser.likes.toLocaleString()}</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-1">Likes</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors shadow-md"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                  <Link
                    href={`/profile/${user.id}`}
                    className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("uploads")}
                  className={`pb-4 px-1 font-bold transition-colors border-b-2 ${
                    activeTab === "uploads"
                      ? "text-primary border-primary"
                      : "text-slate-500 dark:text-slate-400 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    My Uploads ({mockMyVideos.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("liked")}
                  className={`pb-4 px-1 font-bold transition-colors border-b-2 ${
                    activeTab === "liked"
                      ? "text-primary border-primary"
                      : "text-slate-500 dark:text-slate-400 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Liked ({mockLikedVideos.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`pb-4 px-1 font-bold transition-colors border-b-2 ${
                    activeTab === "saved"
                      ? "text-primary border-primary"
                      : "text-slate-500 dark:text-slate-400 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    Saved ({mockSavedVideos.length})
                  </div>
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {getCurrentVideos().map((video) => (
                <Link
                  key={video.id}
                  href={`/research-lab`}
                  className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <p className="text-xs font-bold line-clamp-1">{video.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          {video.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {video.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {getCurrentVideos().map((video) => (
                <Link
                  key={video.id}
                  href={`/research-lab`}
                  className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                >
                  <div className="relative w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        {video.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {video.likes} likes
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Settings Section */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Settings</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <Pencil className="h-5 w-5 text-slate-600" />
                  <span className="font-bold text-slate-900 dark:text-white">Edit Profile</span>
                </div>
                <span className="text-slate-400">›</span>
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-slate-600" />
                  <span className="font-bold text-slate-900 dark:text-white">Change Password</span>
                </div>
                <span className="text-slate-400">›</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 z-50 shadow-lg pb-safe">
        <MobileBottomNav />
      </div>
    </div>
  );
}
