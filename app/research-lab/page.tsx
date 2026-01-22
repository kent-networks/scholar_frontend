"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import VideoCard from "../scoop/components/VideoCard";
import CommentsSidePanel from "@/components/CommentsSidePanel";
import { mockLoggedIn } from "@/lib/mockState";
import { Plus, Search, UploadCloud } from "lucide-react";

// Sample video URLs for demonstration (using sample videos)
const sampleVideoUrls = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
];

const mockVideos = [
  {
    id: 1,
    title: "Quantum Computing Explained: A Visual Guide",
    subject: "Physics",
    year: 2024,
    institution: "MIT",
    author: "Dr. Sarah Chen",
    authorId: "sarah-chen",
    authorPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    views: 1240,
    likes: 89,
    comments: 23,
    date: "2 days ago",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
    videoUrl: sampleVideoUrls[0],
  },
  {
    id: 2,
    title: "Machine Learning Research Methods and Applications",
    subject: "AI",
    year: 2024,
    institution: "Stanford University",
    author: "Prof. Michael Johnson",
    authorId: "michael-johnson",
    authorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    views: 2100,
    likes: 145,
    comments: 42,
    date: "1 week ago",
    poster: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80",
    videoUrl: sampleVideoUrls[1],
  },
  {
    id: 3,
    title: "Sustainable Energy Solutions for the Future",
    subject: "Environmental Science",
    year: 2024,
    institution: "UC Berkeley",
    author: "Dr. Emily Rodriguez",
    authorId: "emily-rodriguez",
    authorPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    views: 890,
    likes: 67,
    comments: 15,
    date: "5 days ago",
    poster: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80",
    videoUrl: sampleVideoUrls[2],
  },
  {
    id: 4,
    title: "Climate Change Research: Latest Findings",
    subject: "Climate Science",
    year: 2024,
    institution: "Harvard",
    author: "Dr. Lisa Anderson",
    authorId: "lisa-anderson",
    authorPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    views: 980,
    likes: 78,
    comments: 19,
    date: "4 days ago",
    poster: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80",
    videoUrl: sampleVideoUrls[3],
  },
  {
    id: 5,
    title: "Biotechnology Breakthroughs in Medical Science",
    subject: "Biotechnology",
    year: 2024,
    institution: "Johns Hopkins",
    author: "Prof. James Wilson",
    authorId: "james-wilson",
    authorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    views: 1560,
    likes: 92,
    comments: 28,
    date: "3 days ago",
    poster: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1400&q=80",
    videoUrl: sampleVideoUrls[4],
  },
];

export default function ResearchLabPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [savedVideos, setSavedVideos] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
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

      <main className="relative flex flex-col flex-1 overflow-hidden bg-black">
        {/* TikTok-like top overlay */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="h-20 bg-gradient-to-b from-black/80 to-transparent" />
          <div className="absolute left-0 right-0 flex items-center justify-between px-4 top-3">
            <button
              className="p-2 text-white rounded-full bg-white/10 md:hidden"
              onClick={() => setSearchQuery("")}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mx-auto">
              <h1 className="text-lg font-bold text-white">Research Lab</h1>
            </div>

            {mockLoggedIn && (
              <button
                className="p-2 text-white rounded-full bg-white/10"
                onClick={() => router.push("/research-lab/upload")}
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
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-200">
                  No videos found
                </p>
              </div>
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
        commentsCount={selectedVideoId ? filteredVideos.find(v => v.id === selectedVideoId)?.comments : 0}
      />
    </div>
  );
}
