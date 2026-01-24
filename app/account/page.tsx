"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Bookmark, Video, Grid3x3, List } from "lucide-react";
import { videoApi, Video as VideoType } from "@/lib/api/videos";
import { userApi } from "@/lib/api/users";
import toast from "react-hot-toast";
import ModalDialog from "@/components/ModalDialog";
import ProfileCard from "./components/ProfileCard";
import VideoCard from "./components/VideoCard";

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"uploads" | "liked" | "saved">("uploads");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileStats, setProfileStats] = useState({ followers: 0, following: 0, likes: 0 });
  const [deleteConfirm, setDeleteConfirm] = useState<{ videoId: number | null; open: boolean }>({ videoId: null, open: false });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.username) return;
      try {
        const profile = await userApi.getProfile(user.username);
        setBio(profile.bio || "");
        setProfilePhoto(profile.photo || null);
        setProfileStats({
          followers: profile.followers,
          following: profile.following,
          likes: profile.likes,
        });
      } catch (error: any) {
        console.error("Failed to load profile:", error);
      }
    };
    if (isAuthenticated && user) {
      fetchProfile();
    }
  }, [isAuthenticated, user]);

  // Fetch videos based on active tab
  useEffect(() => {
    const fetchVideos = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        let fetchedVideos: VideoType[] = [];
        switch (activeTab) {
          case "uploads":
            fetchedVideos = await videoApi.getUserVideos(user.id);
            break;
          case "liked":
            fetchedVideos = await videoApi.getUserLikedVideos(user.id);
            break;
          case "saved":
            fetchedVideos = await videoApi.getUserSavedVideos(user.id);
            break;
        }
        setVideos(fetchedVideos);
      } catch (error: any) {
        if (error.response?.status === 403) {
          toast.error("You don't have permission to view this content");
          setVideos([]);
        } else if (error.response?.status === 401) {
          router.push("/login");
        } else {
          toast.error(error.response?.data?.message || "Failed to load videos");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.id) {
      fetchVideos();
    }
  }, [activeTab, isAuthenticated, user?.id]);


  const handleDeleteVideo = async () => {
    if (!deleteConfirm.videoId) return;
    try {
      await videoApi.deleteVideo(deleteConfirm.videoId);
      setVideos((prev) => prev.filter((v) => v.id !== deleteConfirm.videoId));
      setDeleteConfirm({ videoId: null, open: false });
      toast.success("Video deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete video");
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 rounded-full border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 pb-20 overflow-y-auto bg-white md:pb-0 dark:bg-slate-900">
        <div className="max-w-6xl p-4 mx-auto md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">My Account</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your profile, content, and settings</p>
          </div>

          {/* Profile Card */}
          <ProfileCard
            profilePhoto={profilePhoto}
            setProfilePhoto={setProfilePhoto}
            bio={bio}
            setBio={setBio}
            profileStats={profileStats}
            refreshUser={refreshUser}
          />

          {/* Tabs */}
          <div className="mb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("uploads")}
                  className={`pb-4 px-1 transition-colors border-b-2 ${
                    activeTab === "uploads"
                      ? "text-primary border-primary"
                      : "text-slate-500 dark:text-slate-400 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    My Uploads ({activeTab === "uploads" ? videos.length : 0})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("liked")}
                  className={`pb-4 px-1 transition-colors border-b-2 ${
                    activeTab === "liked"
                      ? "text-primary border-primary"
                      : "text-slate-500 dark:text-slate-400 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Liked ({activeTab === "liked" ? videos.length : 0})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`pb-4 px-1 transition-colors border-b-2 ${
                    activeTab === "saved"
                      ? "text-primary border-primary"
                      : "text-slate-500 dark:text-slate-400 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    Saved ({activeTab === "saved" ? videos.length : 0})
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 rounded-full border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : videos.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                No {activeTab === "uploads" ? "uploads" : activeTab === "liked" ? "liked videos" : "saved videos"} yet.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-3 lg:grid-cols-4">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  viewMode={viewMode}
                  activeTab={activeTab}
                  onDelete={activeTab === "uploads" ? (id) => setDeleteConfirm({ videoId: id, open: true }) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="mb-8 space-y-4">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  viewMode={viewMode}
                  activeTab={activeTab}
                  onDelete={activeTab === "uploads" ? (id) => setDeleteConfirm({ videoId: id, open: true }) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ModalDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ videoId: null, open: false })}
        title="Delete Video"
        clickOutside={false}
      >
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to delete this video? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteConfirm({ videoId: null, open: false })}
              className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteVideo}
              className="px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </ModalDialog>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 pb-safe">
        <MobileBottomNav />
      </div>
    </div>
  );
}
