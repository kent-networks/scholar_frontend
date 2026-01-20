"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import VideoCard from "./components/VideoCard";
import SearchBar from "./components/SearchBar";

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
  },
];

export default function ScoopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [savedVideos, setSavedVideos] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

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

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Search Bar - Desktop only */}
        <div className="hidden md:block p-4 border-b border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark z-10">
          <div className="max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
            filteredVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                isActive={index === currentIndex}
                onLike={() => handleLike(video.id)}
                onComment={() => console.log("Comment", video.id)}
                onShare={() => console.log("Share", video.id)}
                onSave={() => handleSave(video.id)}
                liked={likedVideos.has(video.id)}
                saved={savedVideos.has(video.id)}
              />
            ))
          ) : (
            <div className="h-screen flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-slate-400 mb-4">
                  search_off
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
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
    </div>
  );
}
