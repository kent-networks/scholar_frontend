"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { ArrowLeft, MessageCircle, Heart, Bookmark, Video, Grid3x3, List, Settings, Send } from "lucide-react";
import Link from "next/link";

// Mock data - in real app, fetch from API
const mockProfile = {
  id: "sarah-chen",
  name: "Dr. Sarah Chen",
  username: "@sarahchen",
  bio: "Quantum Computing Researcher | MIT | Exploring the future of computation",
  photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  followers: 12450,
  following: 320,
  likes: 8920,
  isFollowing: false,
  isOwnProfile: false,
};

const mockVideos = [
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
  {
    id: 6,
    title: "AI Research Methods",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=600&fit=crop",
    views: 1340,
    likes: 105,
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"videos" | "liked" | "saved">("videos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [profile, setProfile] = useState(mockProfile);

  const handleFollow = () => {
    setProfile((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
    }));
  };

  const handleMessage = () => {
    router.push(`/inbox/${profile.id}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 pb-20 overflow-y-auto bg-white md:pb-0 dark:bg-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl px-4 py-4 mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">{profile.name}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{mockVideos.length} videos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl px-4 py-6 mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col gap-6 mb-8 md:flex-row">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="object-cover w-24 h-24 border-4 border-white rounded-full shadow-lg md:w-32 md:h-32 dark:border-slate-800"
                />
              ) : (
                <div className="flex items-center justify-center w-24 h-24 text-3xl font-bold text-white border-4 border-white rounded-full shadow-lg md:w-32 md:h-32 bg-primary md:text-4xl dark:border-slate-800">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="mb-1 text-2xl font-bold md:text-3xl text-slate-900 dark:text-white">
                    {profile.name}
                  </h2>
                  <p className="mb-2 text-slate-600 dark:text-slate-400">{profile.username}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{profile.bio}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!profile.isOwnProfile && (
                    <>
                      <button
                        onClick={handleMessage}
                        className="flex items-center gap-2 px-4 py-2 font-bold transition-colors bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                      <button
                        onClick={handleFollow}
                        className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                          profile.isFollowing
                            ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                            : "bg-primary text-white hover:bg-primary-dark"
                        }`}
                      >
                        {profile.isFollowing ? "Following" : "Follow"}
                      </button>
                    </>
                  )}
                  {profile.isOwnProfile && (
                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-4 py-2 font-bold transition-colors bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </Link>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{profile.followers.toLocaleString()}</span>
                  <span className="ml-1 text-slate-600 dark:text-slate-400">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{profile.following}</span>
                  <span className="ml-1 text-slate-600 dark:text-slate-400">Following</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{profile.likes.toLocaleString()}</span>
                  <span className="ml-1 text-slate-600 dark:text-slate-400">Likes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`pb-4 px-1 font-bold transition-colors border-b-2 ${
                    activeTab === "videos"
                      ? "text-primary border-primary"
                      : "text-slate-500 dark:text-slate-400 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4" />
                    Videos
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
                    Liked
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
                    Saved
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
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
              {mockVideos.map((video) => (
                <Link
                  key={video.id}
                  href={`/research-lab`}
                  className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100">
                    <div className="absolute text-white bottom-2 left-2 right-2">
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
            <div className="space-y-4">
              {mockVideos.map((video) => (
                <Link
                  key={video.id}
                  href={`/research-lab`}
                  className="flex gap-4 p-4 transition-colors rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 group"
                >
                  <div className="relative flex-shrink-0 w-32 h-48 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary">
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
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 pb-safe">
        <MobileBottomNav />
      </div>
    </div>
  );
}

