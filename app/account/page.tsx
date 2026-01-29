"use client";

import { useState, useEffect, useRef } from "react";
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
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [profileStats, setProfileStats] = useState({ followers: 0, following: 0, likes: 0 });
  const [deleteConfirm, setDeleteConfirm] = useState<{ videoId: number | null; open: boolean }>({ videoId: null, open: false });
  const mainRef = useRef<HTMLElement>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);

  const PAGE_SIZE = 12;

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

  // Fetch first page of videos when tab or user changes
  useEffect(() => {
    const fetchVideos = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setNextCursor(null);
        let result: { data: VideoType[]; nextCursor: number | null };
        switch (activeTab) {
          case "uploads":
            result = await videoApi.getUserVideos(user.id, { limit: PAGE_SIZE });
            break;
          case "liked":
            result = await videoApi.getUserLikedVideos(user.id, { limit: PAGE_SIZE });
            break;
          case "saved":
            result = await videoApi.getUserSavedVideos(user.id, { limit: PAGE_SIZE });
            break;
          default:
            result = { data: [], nextCursor: null };
        }
        setVideos(result.data);
        setNextCursor(result.nextCursor);
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

  // Endless scroll: load more when sentinel enters view
  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    const root = mainRef.current;
    if (!sentinel || !root || nextCursor == null || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          loadMoreVideos();
          break;
        }
      },
      { root, rootMargin: "200px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextCursor, loadingMore, activeTab, user?.id]);

  const loadMoreVideos = async () => {
    if (!user?.id || nextCursor == null || loadingMore) return;
    try {
      setLoadingMore(true);
      let result: { data: VideoType[]; nextCursor: number | null };
      switch (activeTab) {
        case "uploads":
          result = await videoApi.getUserVideos(user.id, { limit: PAGE_SIZE, cursor: nextCursor });
          break;
        case "liked":
          result = await videoApi.getUserLikedVideos(user.id, { limit: PAGE_SIZE, cursor: nextCursor });
          break;
        case "saved":
          result = await videoApi.getUserSavedVideos(user.id, { limit: PAGE_SIZE, cursor: nextCursor });
          break;
        default:
          result = { data: [], nextCursor: null };
      }
      setVideos((prev) => [...prev, ...result.data]);
      setNextCursor(result.nextCursor);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  };


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

      <main ref={mainRef} className="flex-1 pb-20 overflow-y-auto bg-[#eef2f7] md:pb-0 dark:bg-slate-900">
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
          <div className="sticky top-0 z-20 bg-white border-b rounded-xl dark:bg-black border-slate-200 dark:border-slate-800">
    <div className="flex items-center justify-between px-2 sm:px-4">

    {/* Tabs */}
    <div className="flex justify-start flex-1 gap-8">
        {[
          { key: "uploads", icon: Video, label: "Uploads" },
          { key: "liked", icon: Heart, label: "Liked" },
          { key: "saved", icon: Bookmark, label: "Saved" },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`relative py-3 transition-colors ${
              activeTab === key
                ? "text-primary "
                : "text-slate-400"
            }`}
          >
            <div className="flex items-center gap-1 sm:flex-row sm:gap-2">
              <Icon className="w-5 h-5" strokeWidth={1.5}/>
              <span className="inline text-sm font-medium">
                {label}
              </span>
            </div>

            {/* Active indicator */}
            {activeTab === key && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* View mode (hidden on very small screens) */}
      <div className="flex justify-end gap-1">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-full transition ${
            viewMode === "grid"
              ? "bg-primary text-white"
              : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
              >
                <Grid3x3 className="w-5 h-5" strokeWidth={1.5}/>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "text-slate-400 hover:bg-slate-100 "
                }`}
              >
                <List className="w-5 h-5" strokeWidth={1.5}/>
              </button>
          </div>
          </div>
        </div>


          {/* Content Grid/List */}
          {loading ? (
            <div className="flex items-center justify-center py-12 mt-2">
              <div className="w-8 h-8 border-4 rounded-full border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : videos.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                No {activeTab === "uploads" ? "uploads" : activeTab === "liked" ? "liked videos" : "saved videos"} yet.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 p-2 mt-2 mb-8 bg-white md:grid-cols-3 lg:grid-cols-4 rounded-xl">
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
            <div className="mt-2 mb-8 space-y-4">
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
          {/* Endless scroll sentinel */}
          {!loading && videos.length > 0 && nextCursor != null && (
            <div
              ref={loadMoreSentinelRef}
              className="w-full h-1 min-h-[1px] py-6"
              aria-hidden
            />
          )}
          {loadingMore && videos.length > 0 && (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
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
