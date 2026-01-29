"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [savedVideos, setSavedVideos] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingOpenIndexRef = useRef<number | null>(null);
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const limit = 10;
  
  const isGlobalAdmin = user?.role === "admin";

  function dedupeVideosById(list: Video[]): Video[] {
    const seen = new Set<number>();
    return list.filter((v) => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
  }

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
      if (reset) setLoading(true);
      else setLoadingMore(true);
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
      setLoadingMore(false);
    }
  }, [offset, searchQuery]);

  // Initial load and search
  useEffect(() => {
    fetchVideos(true);
  }, [searchQuery]);

  // Open specific video from ?video=id (e.g. from landing trending cards)
  const videoIdParam = searchParams.get("video");
  useEffect(() => {
    if (!videoIdParam || loading || videos.length === 0) return;
    const id = parseInt(videoIdParam, 10);
    if (Number.isNaN(id)) return;
    const index = videos.findIndex((v) => v.id === id);
    if (index >= 0) {
      setCurrentIndex(index);
      pendingOpenIndexRef.current = index;
    }
  }, [videoIdParam, loading, videos]);

  // Endless scroll: load more when sentinel enters view
  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          fetchVideos(false);
          break;
        }
      },
      { root: container, rootMargin: "200px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, fetchVideos]);

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
  // IntersectionObserver: which card is in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container || videos.length === 0) return;

    const wrappers = container.querySelectorAll("[data-video-index]");
    if (wrappers.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) continue;
          const index = parseInt((entry.target as HTMLElement).dataset.videoIndex ?? "", 10);
          if (!Number.isNaN(index) && index >= 0 && index < videos.length) {
            setCurrentIndex(index);
            break;
          }
        }
      },
      { root: container, threshold: 0.5, rootMargin: "0px" }
    );

    wrappers.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [videos.length]);

  // Scroll to index when opening from ?video=id (runs after videos load and index is set)
  useEffect(() => {
    const idx = pendingOpenIndexRef.current;
    if (idx === null || videos.length === 0) return;
    pendingOpenIndexRef.current = null;
    const container = containerRef.current;
    if (container) {
      const videoHeight = container.clientHeight || window.innerHeight;
      requestAnimationFrame(() => {
        container.scrollTo({ top: idx * videoHeight, behavior: "smooth" });
      });
    }
  }, [videos.length]);

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
          <div className="absolute left-0 flex items-center justify-between px-4 right-3 top-3">
            {/* Small: search, For You/Following, upload centered in the middle */}
            <div className="flex items-center justify-center flex-1 gap-3 md:hidden">
              <button
                className="p-2 text-white rounded-full bg-white/10"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-6 text-white">
                {/* <button
                  onClick={() => setActiveTab("following")}
                  className={`text-sm font-bold transition-opacity ${activeTab === "following" ? "opacity-100" : "opacity-60"}`}
                >
                  Following
                </button> */}
                <button
                  onClick={() => setActiveTab("forYou")}
                  className={`text-sm font-bold transition-opacity ${activeTab === "forYou" ? "opacity-100" : "opacity-60"}`}
                >
                  Scoop
                </button>
              </div>
              {isAuthenticated && isGlobalAdmin && (
                <button
                  className="p-2 text-white rounded-full bg-white/10"
                  onClick={() => router.push("/scoop/upload")}
                  aria-label="Upload"
                >
                  <UploadCloud className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Big: input in the middle, upload on the right */}
            <div className="flex-1 hidden min-w-0 md:flex" />
            <div className="items-center flex-shrink-0 hidden md:flex">
              <div className="relative w-64 min-w-0 sm:w-72 md:max-w-md">
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
            <div className="items-center justify-end flex-1 hidden min-w-0 md:flex">
              {isAuthenticated && isGlobalAdmin && (
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
              <div
                key={video.id}
                data-video-index={index}
                className="flex-shrink-0 w-full h-[100svh] md:h-screen snap-start snap-always"
              >
                <VideoCard
                video={{
                  id: video.id,
                  title: video.title,
                  description: video.description,
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
                onShare={async () => {
                  const shareUrl = `${window.location.origin}/scoop?video=${video.id}`;
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: video.title,
                        text: video.description,
                        url: shareUrl,
                      });
                      toast.success("Link shared!");
                    } catch (err: any) {
                      if (err?.name !== "AbortError") {
                        await navigator.clipboard?.writeText(shareUrl).catch(() => {});
                        toast.success("Link copied to clipboard!");
                      }
                    }
                  } else {
                    await navigator.clipboard.writeText(shareUrl);
                    toast.success("Link copied to clipboard!");
                  }
                }}
                onSave={() => handleSave(video.id)}
                onViewIncremented={(videoId) => {
                  setVideos((prev) =>
                    prev.map((v) =>
                      v.id === videoId ? { ...v, views: (v.views || 0) + 1 } : v
                    )
                  );
                }}
                liked={likedVideos.has(video.id)}
                saved={savedVideos.has(video.id)}
              />
              </div>
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

          {/* Endless scroll sentinel */}
          {videos.length > 0 && hasMore && (
            <div
              ref={loadMoreSentinelRef}
              className="flex-shrink-0 w-full h-1 min-h-[1px]"
              aria-hidden
            />
          )}
          {loadingMore && videos.length > 0 && (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

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
