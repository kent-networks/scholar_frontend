"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import VideoCard from "./components/VideoCard";
import CommentsSidePanel from "@/components/CommentsSidePanel";
import ModalDialog from "@/components/ModalDialog";
import { useAuth } from "@/contexts/AuthContext";
import { videoApi, Video } from "@/lib/api/videos";
import { Plus, Search, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export default function ScoopPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [savedVideos, setSavedVideos] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const limit = 10;
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'educator' || user?.role === 'creator';

  useEffect(() => {
    const handler = (e: Event) => {
      const { videoId, delta } = (e as CustomEvent<{ videoId: number; delta: number }>).detail || {};
      if (!videoId || !delta) return;
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId ? { ...v, comments: Math.max(0, (v.comments || 0) + delta) } : v
        )
      );
    };
    if (typeof window !== "undefined") {
      window.addEventListener("videoCommentsDelta", handler as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("videoCommentsDelta", handler as EventListener);
      }
    };
  }, []);

  // Fetch videos from backend
  const fetchVideos = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;
      const fetchedVideos = await videoApi.getVideos({
        type: "scoop",
        limit,
        offset: currentOffset,
        search: searchQuery || undefined,
      });

      if (reset) {
        setVideos(fetchedVideos);
        setOffset(fetchedVideos.length);
      } else {
        setVideos((prev) => [...prev, ...fetchedVideos]);
        setOffset((prev) => prev + fetchedVideos.length);
      }

      setHasMore(fetchedVideos.length === limit);
      
      // Update liked/saved sets from API response
      const likedSet = new Set<number>();
      const savedSet = new Set<number>();
      fetchedVideos.forEach((video) => {
        if (video.isLiked) likedSet.add(video.id);
        if (video.isSaved) savedSet.add(video.id);
      });
      setLikedVideos((prev) => new Set([...Array.from(prev), ...Array.from(likedSet)]));
      setSavedVideos((prev) => new Set([...Array.from(prev), ...Array.from(savedSet)]));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }, [offset, searchQuery]);

  // Initial load and search
  useEffect(() => {
    fetchVideos(true);
  }, [searchQuery]);

  // Load more on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasMore || loading) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 500) {
        fetchVideos(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, fetchVideos]);

  const handleLike = async (videoId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const wasLiked = likedVideos.has(videoId);
    
    // Optimistic update
    setLikedVideos((prev) => {
      const newSet = new Set(prev);
      if (wasLiked) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });

    // Update video likes count
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, likes: wasLiked ? v.likes - 1 : v.likes + 1, isLiked: !wasLiked } : v))
    );

    try {
      await videoApi.likeVideo(videoId);
    } catch (error: any) {
      // Revert on error
      setLikedVideos((prev) => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(videoId);
        } else {
          newSet.delete(videoId);
        }
        return newSet;
      });
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, likes: wasLiked ? v.likes + 1 : v.likes - 1, isLiked: wasLiked } : v))
      );
      toast.error(error.response?.data?.message || "Failed to like video");
    }
  };

  const handleSave = async (videoId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const wasSaved = savedVideos.has(videoId);
    
    // Optimistic update
    setSavedVideos((prev) => {
      const newSet = new Set(prev);
      if (wasSaved) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });

    // Update video saved state
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, isSaved: !wasSaved } : v))
    );

    try {
      await videoApi.saveVideo(videoId);
      toast.success(wasSaved ? "Video unsaved" : "Video saved!");
    } catch (error: any) {
      // Revert on error
      setSavedVideos((prev) => {
        const newSet = new Set(prev);
        if (wasSaved) {
          newSet.add(videoId);
        } else {
          newSet.delete(videoId);
        }
        return newSet;
      });
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, isSaved: wasSaved } : v))
      );
      toast.error(error.response?.data?.message || "Failed to save video");
    }
  };

  const handleComment = (videoId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setSelectedVideoId(videoId);
    setCommentsOpen(true);
  };

  // Handle scroll to snap to videos
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isScrolling) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      setIsScrolling(true);

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        const scrollTop = container.scrollTop;
        const videoHeight = container.clientHeight || window.innerHeight;
        const newIndex = Math.round(scrollTop / videoHeight);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
          setCurrentIndex(newIndex);
        }
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentIndex, videos.length, isScrolling]);

  // Scroll to current video
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isScrolling) return;

    const videoHeight = container.clientHeight || window.innerHeight;
    container.scrollTo({
      top: currentIndex * videoHeight,
      behavior: "smooth",
    });
  }, [currentIndex, isScrolling]);

  return (
    <div className="flex h-[100svh] md:h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="relative flex flex-col flex-1 overflow-hidden bg-black">
        {/* TikTok-like top overlay */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="h-20 bg-gradient-to-b from-black/80 to-transparent" />
          <div className="absolute left-0 right-0 flex items-center justify-between px-4 top-3">
            <button
              className="p-2 text-white rounded-full bg-white/10 md:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Desktop Search */}
            <div className="items-center flex-1 hidden max-w-md gap-4 mx-auto md:flex">
              <div className="relative flex-1">
                <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full py-2 pl-10 pr-4 text-white border rounded-lg bg-white/10 backdrop-blur-sm border-white/20 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 mx-auto text-white md:hidden">
              <button
                onClick={() => setActiveTab("following")}
                className={`text-sm font-bold transition-opacity ${activeTab === "following" ? "opacity-100" : "opacity-60"}`}
              >
                Following
              </button>
              <button
                onClick={() => setActiveTab("forYou")}
                className={`text-sm font-bold transition-opacity ${activeTab === "forYou" ? "opacity-100" : "opacity-60"}`}
              >
                For You
              </button>
            </div>

            {isAuthenticated && isAdmin && (
              <button
                className="p-2 text-white rounded-full bg-white/10"
                onClick={() => router.push("/scoop/upload")}
                aria-label="Upload"
              >
                <UploadCloud className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Video Feed Container */}
        <div
          ref={containerRef}
          className="flex-1 pb-20 overflow-y-scroll snap-y snap-mandatory scroll-smooth md:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx global>{`
            .snap-y::-webkit-scrollbar {
              display: none;
            }
            @supports (-webkit-touch-callout: none) {
              .pb-safe {
                padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
              }
            }
          `}</style>

          {videos.length > 0 ? (
            videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={{
                  id: video.id,
                  title: video.title,
                  subject: video.subject || "General",
                  author: video.author,
                  authorId: video.authorId,
                  authorUserId: video.authorUserId,
                  authorPhoto: video.authorPhoto,
                  views: video.views,
                  likes: video.likes,
                  comments: video.comments,
                  date: formatDistanceToNow(new Date(video.date), { addSuffix: true }),
                  poster: video.poster || "",
                  videoUrl: video.videoUrl,
                  imageUrls: video.imageUrls,
                  isImageCollection: video.isImageCollection,
                }}
                isActive={index === currentIndex}
                isNearActive={Math.abs(index - currentIndex) <= 1}
                onLike={() => handleLike(video.id)}
                onComment={() => handleComment(video.id)}
                onShare={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: video.title,
                      text: video.description,
                      url: `${window.location.origin}/scoop`,
                    });
                  } else {
                    navigator.clipboard.writeText(`${window.location.origin}/scoop`);
                    toast.success("Link copied to clipboard!");
                  }
                }}
                onSave={() => handleSave(video.id)}
                liked={likedVideos.has(video.id)}
                saved={savedVideos.has(video.id)}
              />
            ))
          ) : !loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-200">
                  No videos found
                </p>
              </div>
            </div>
          ) : null}
          
          {loading && videos.length === 0 && (
            <div className="flex items-center justify-center h-screen">
              <div className="w-12 h-12 border-4 rounded-full border-white/30 border-t-white animate-spin" />
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 pb-safe">
          <MobileBottomNav />
        </div>
      </main>

      {/* Comments Side Panel */}
      <CommentsSidePanel
        isOpen={commentsOpen}
        onClose={() => {
          setCommentsOpen(false);
          setSelectedVideoId(null);
        }}
        videoId={selectedVideoId || undefined}
        commentsCount={selectedVideoId ? videos.find((v) => v.id === selectedVideoId)?.comments || 0 : 0}
        videoOwnerId={selectedVideoId ? videos.find((v) => v.id === selectedVideoId)?.authorUserId : undefined}
      />

      {/* Mobile Search Modal */}
      <ModalDialog
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search Videos"
        mode="bottom"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full py-3 pl-10 pr-4 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              autoFocus
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchOpen(false);
              }}
              className="w-full px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              Clear search
            </button>
          )}
        </div>
      </ModalDialog>
    </div>
  );
}
