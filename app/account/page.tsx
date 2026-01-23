"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { KeyRound, Pencil, Heart, Bookmark, Video, Grid3x3, List, Settings, Trash2, Upload, X, Camera } from "lucide-react";
import Link from "next/link";
import { videoApi, Video as VideoType } from "@/lib/api/videos";
import { userApi } from "@/lib/api/users";
import { uploadApi } from "@/lib/api/upload";
import toast from "react-hot-toast";
import ModalDialog from "@/components/ModalDialog";
import Tooltip from "@/components/Tooltip";

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"uploads" | "liked" | "saved">("uploads");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileStats, setProfileStats] = useState({ followers: 0, following: 0, likes: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        toast.error(error.response?.data?.message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.id) {
      fetchVideos();
    }
  }, [activeTab, isAuthenticated, user?.id]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadingPhoto(true);
      const result = await uploadApi.uploadProfilePhoto(file);
      setProfilePhoto(result.data.url || result.data.path);
      await refreshUser?.();
      toast.success("Profile photo updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await userApi.deleteProfilePhoto();
      setProfilePhoto(null);
      await refreshUser?.();
      toast.success("Profile photo deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete photo");
    }
  };

  const handleBioSave = async () => {
    try {
      await userApi.updateBio(bio);
      setEditingBio(false);
      toast.success("Bio updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update bio");
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

      <main className="flex-1 pb-20 overflow-y-auto bg-white md:pb-0 dark:bg-slate-900">
        <div className="max-w-6xl p-4 mx-auto md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">My Account</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your profile, content, and settings</p>
          </div>

          {/* Profile Card - Modern Design */}
          <div className="p-8 mb-8 border shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl border-primary/20 dark:border-primary/30">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              {/* Profile Photo with Edit/Delete */}
              <div className="relative group">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={user.name}
                    className="object-cover w-32 h-32 border-4 border-white rounded-full shadow-xl dark:border-slate-800"
                  />
                ) : (
                  <div className="flex items-center justify-center w-32 h-32 text-4xl font-bold text-white border-4 border-white rounded-full shadow-xl bg-primary dark:border-slate-800">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 transition-opacity rounded-full opacity-0 bg-black/50 group-hover:opacity-100">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="p-2 text-white transition-colors rounded-full bg-primary hover:bg-primary-dark disabled:opacity-50"
                    title="Upload photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  {profilePhoto && (
                    <Tooltip content="Delete photo">
                      <button
                      onClick={handleDeletePhoto}
                      className="p-2 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    </Tooltip>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="mb-1 text-slate-600 dark:text-slate-400">{user.role}</p>
                <p className="mb-4 text-sm text-slate-500 dark:text-slate-500">{user.email}</p>

                {/* Bio Section */}
                <div className="mb-4">
                  {editingBio ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleBioSave}
                          className="px-4 py-1 text-sm font-bold text-white rounded-lg bg-primary hover:bg-primary-dark"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingBio(false);
                            setBio(user.bio || "");
                          }}
                          className="px-4 py-1 text-sm font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                        {bio || "No bio yet. Click edit to add one."}
                      </p>
                      <button
                        onClick={() => setEditingBio(true)}
                        className="p-1 transition-colors text-slate-500 hover:text-primary"
                        title="Edit bio"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-6 mb-4 md:justify-start">
                  <div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{profileStats.followers.toLocaleString()}</span>
                    <span className="ml-1 text-slate-600 dark:text-slate-400">Followers</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{profileStats.following}</span>
                    <span className="ml-1 text-slate-600 dark:text-slate-400">Following</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{profileStats.likes.toLocaleString()}</span>
                    <span className="ml-1 text-slate-600 dark:text-slate-400">Likes</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 md:justify-start">
                  <Link
                    href={`/profile/${user.username}`}
                    className="px-6 py-2 font-bold transition-colors bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

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
                <div key={video.id} className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
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
                    {activeTab === "uploads" && (
                      <Tooltip content="Delete video">
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm({ videoId: video.id, open: true });
                            }}
                            className="p-2 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-8 space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="flex gap-4 p-4 transition-colors rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 group">
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
                    <div className="flex items-center justify-between">
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
                      {activeTab === "uploads" && (
                        <Tooltip content="Delete video">
                          <div>
                            <button
                              onClick={() => setDeleteConfirm({ videoId: video.id, open: true })}
                              className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
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
      >
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to delete this video? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm({ videoId: null, open: false })}
              className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
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
