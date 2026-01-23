"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { ArrowLeft, MessageCircle, Heart, Bookmark, Video, Grid3x3, List, Settings } from "lucide-react";
import Link from "next/link";
import { userApi, UserProfile } from "@/lib/api/users";
import { videoApi, Video as VideoType } from "@/lib/api/videos";
import { messageApi } from "@/lib/api/messages";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const username = params.id as string;
  
  const [activeTab, setActiveTab] = useState<"videos" | "liked" | "saved">("videos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await userApi.getProfile(username);
        setProfile(profileData);
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error("User not found");
          router.back();
        } else {
          toast.error(error.response?.data?.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, router]);

  // Fetch videos based on active tab
  useEffect(() => {
    const fetchVideos = async () => {
      if (!profile?.userId) return;

      try {
        setVideosLoading(true);
        let fetchedVideos: VideoType[] = [];

        switch (activeTab) {
          case "videos":
            fetchedVideos = await videoApi.getUserVideos(profile.userId);
            break;
          case "liked":
            fetchedVideos = await videoApi.getUserLikedVideos(profile.userId);
            break;
          case "saved":
            fetchedVideos = await videoApi.getUserSavedVideos(profile.userId);
            break;
        }

        setVideos(fetchedVideos);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load videos");
      } finally {
        setVideosLoading(false);
      }
    };

    if (profile?.userId) {
      fetchVideos();
    }
  }, [profile?.userId, activeTab]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!profile?.userId) return;

    const wasFollowing = profile.isFollowing;

    // Optimistic update
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isFollowing: !prev.isFollowing,
        followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
      };
    });

    try {
      setFollowLoading(true);
      const result = await userApi.toggleFollow(profile.userId);
      // Update with server response
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isFollowing: result.following,
          followers: result.following ? prev.followers + 1 : prev.followers - 1,
        };
      });
      toast.success(result.following ? "Following!" : "Unfollowed");
    } catch (error: any) {
      // Revert on error
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isFollowing: wasFollowing,
          followers: wasFollowing ? prev.followers : prev.followers - 1,
        };
      });
      toast.error(error.response?.data?.message || "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!profile?.userId) return;

    // Navigate to inbox with user ID
    router.push(`/inbox/${profile.userId}`);
  };

  const handleVideoClick = (video: VideoType) => {
    // Navigate to the appropriate feed based on video type
    if (video.videoType === "scoop") {
      router.push("/scoop");
    } else {
      router.push("/research-lab");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex items-center justify-center flex-1">
          <div className="w-12 h-12 border-4 rounded-full border-primary/30 border-t-primary animate-spin" />
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">User not found</p>
          </div>
        </main>
      </div>
    );
  }

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
                <p className="text-sm text-slate-500 dark:text-slate-400">{videos.length} {activeTab === "videos" ? "videos" : activeTab === "liked" ? "liked" : "saved"}</p>
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
                  <p className="mb-2 text-slate-600 dark:text-slate-400">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-sm text-slate-700 dark:text-slate-300">{profile.bio}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!profile.isOwnProfile && (
                    <>
                      <button
                        onClick={handleMessage}
                        disabled={followLoading}
                        className="flex items-center gap-2 px-4 py-2 font-bold transition-colors bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                      <button
                        onClick={handleFollow}
                        disabled={followLoading}
                        className={`px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 ${
                          profile.isFollowing
                            ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                            : "bg-primary text-white hover:bg-primary-dark"
                        }`}
                      >
                        {followLoading ? "..." : profile.isFollowing ? "Following" : "Follow"}
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
          {videosLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 rounded-full border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : videos.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                No {activeTab === "videos" ? "videos" : activeTab === "liked" ? "liked videos" : "saved videos"} yet.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 text-left"
                >
                  <img
                    src={video.poster || video.thumbnailUrl || ""}
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
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="flex gap-4 p-4 transition-colors rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 group w-full text-left"
                >
                  <div className="relative flex-shrink-0 w-32 h-48 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
                    <img
                      src={video.poster || video.thumbnailUrl || ""}
                      alt={video.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="mb-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {video.description}
                      </p>
                    )}
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
                </button>
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
