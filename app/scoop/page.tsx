"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import VideoCard from "./components/VideoCard";
import SearchBar from "./components/SearchBar";
import CommentsSidePanel from "@/components/CommentsSidePanel";
import { mockLoggedIn } from "@/lib/mockState";
import { Plus, Search } from "lucide-react";

const mockVideos = [
  {
    id: 1,
    title: "Introduction to Quantum Computing: Understanding Qubits and Superposition",
    subject: "Physics",
    author: "Dr. Sarah Chen",
    views: 1240,
    likes: 89,
    comments: 23,
    date: "2 days ago",
    poster:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions for the Future",
    subject: "Environmental Science",
    author: "Prof. Michael Johnson",
    views: 890,
    likes: 67,
    comments: 15,
    date: "5 days ago",
    poster:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 3,
    title: "Machine Learning Fundamentals: Neural Networks Explained",
    subject: "AI",
    author: "Dr. Emily Rodriguez",
    views: 2100,
    likes: 145,
    comments: 42,
    date: "1 week ago",
    poster:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 4,
    title: "Climate Change Research: Latest Findings and Solutions",
    subject: "Climate Science",
    author: "Dr. Lisa Anderson",
    views: 980,
    likes: 78,
    comments: 19,
    date: "4 days ago",
    poster:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 5,
    title: "Biotechnology Breakthroughs in Medical Science",
    subject: "Biotechnology",
    author: "Prof. James Wilson",
    views: 1560,
    likes: 92,
    comments: 28,
    date: "3 days ago",
    poster:
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function ScoopPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [savedVideos, setSavedVideos] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  const filteredVideos = mockVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLike = (videoId: number) => {
    setLikedVideos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleSave = (videoId: number) => {
    setSavedVideos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
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
        const videoHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / videoHeight);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < filteredVideos.length) {
          setCurrentIndex(newIndex);
        }
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentIndex, filteredVideos.length, isScrolling]);

  // Scroll to current video
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isScrolling) return;

    const videoHeight = window.innerHeight;
    container.scrollTo({
      top: currentIndex * videoHeight,
      behavior: "smooth",
    });
  }, [currentIndex, isScrolling]);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden relative bg-black">
        {/* TikTok-like top overlay */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="h-20 bg-gradient-to-b from-black/80 to-transparent" />
          <div className="absolute top-3 left-0 right-0 flex items-center justify-between px-4">
            <button
              className="p-2 rounded-full bg-white/10 text-white md:hidden"
              onClick={() => setSearchQuery("")}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-6 mx-auto text-white">
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

            {mockLoggedIn && (
              <button
                className="p-2 rounded-full bg-white/10 text-white"
                onClick={() => router.push("/scoop/upload")}
                aria-label="Upload"
              >
                <Plus className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Video Feed Container */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth md:pb-0 pb-20"
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

          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onLike={() => handleLike(video.id)}
                onComment={() => {
                  setSelectedVideoId(video.id);
                  setCommentsOpen(true);
                }}
                onShare={() => console.log("Share", video.id)}
                onSave={() => handleSave(video.id)}
                liked={likedVideos.has(video.id)}
                saved={savedVideos.has(video.id)}
              />
            ))
          ) : (
            <div className="h-screen flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-200 text-lg font-semibold">
                  No videos found
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 z-50 shadow-lg pb-safe">
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
        commentsCount={selectedVideoId ? filteredVideos.find(v => v.id === selectedVideoId)?.comments : 0}
      />
    </div>
  );
}
