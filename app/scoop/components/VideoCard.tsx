"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import { Heart, MessageCircle, Share2, Bookmark, PlayCircle, Pause, ChevronLeft, ChevronRight } from "lucide-react";

interface VideoCardProps {
  video: {
    id: number;
    title: string;
    subject: string;
    author: string;
    authorId?: string;
    authorUserId?: number;
    authorPhoto?: string;
    views: number;
    likes: number;
    comments: number;
    date: string;
    poster: string;
    videoUrl?: string;
    imageUrls?: string[];
    isImageCollection?: boolean;
  };
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  liked: boolean;
  saved: boolean;
  isActive?: boolean;
  isNearActive?: boolean;
}

export default function VideoCard({
  video,
  onLike,
  onComment,
  onShare,
  onSave,
  liked,
  saved,
  isActive = false,
  isNearActive = false,
}: VideoCardProps) {
  const router = useRouter();
  const playerRef = useRef<any>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const lastTapAtRef = useRef<number>(0);
  const suppressClickRef = useRef(false);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTransitioningRef = useRef(false);

  const isImageCollection = video.isImageCollection && video.imageUrls && video.imageUrls.length > 0;
  const images = video.imageUrls || [];
  const hasVideo = !!video.videoUrl && !isImageCollection;

  // Auto-play / pause logic with debounce to prevent play/pause conflicts
  useEffect(() => {
    if (!hasVideo) return;

    // Clear any pending play operations
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }

    if (isActive && isNearActive) {
      // Small delay to ensure previous pause completes and prevent play/pause race condition
      isTransitioningRef.current = true;
      playTimeoutRef.current = setTimeout(() => {
        if (isActive && isNearActive) {
          setIsPlaying(true);
        }
        isTransitioningRef.current = false;
      }, 150);
    } else {
      // Pause immediately when not active
      setIsPlaying(false);
      isTransitioningRef.current = false;
      setIsLoading(true); // Reset loading when paused
    }

    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, [isActive, isNearActive, hasVideo]);

  const togglePlay = () => {
    if (!hasVideo) return;
    setIsPlaying((prev) => !prev);
  };

  // Image carousel scroll handling
  const scrollToImage = (index: number) => {
    if (!imageScrollRef.current || images.length === 0) return;
    const imageWidth = imageScrollRef.current.clientWidth;
    imageScrollRef.current.scrollTo({
      left: index * imageWidth,
      behavior: "smooth",
    });
    setCurrentImageIndex(index);
  };

  const handleImageScroll = () => {
    if (!imageScrollRef.current || images.length === 0) return;
    const imageWidth = imageScrollRef.current.clientWidth;
    const scrollLeft = imageScrollRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / imageWidth);
    setCurrentImageIndex(newIndex);
  };

  useEffect(() => {
    if (!isImageCollection || !imageScrollRef.current) return;

    imageScrollRef.current.addEventListener("scroll", handleImageScroll);
    return () => {
      imageScrollRef.current?.removeEventListener("scroll", handleImageScroll);
    };
  }, [isImageCollection, images.length]);

  return (
    <div className="relative flex-shrink-0 w-full h-[100svh] md:h-screen snap-start">
      <div
        className="relative flex items-center justify-center w-full h-full overflow-hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onPointerUp={(e) => {
          if (e.pointerType !== "touch") return;
          const now = Date.now();
          const dt = now - lastTapAtRef.current;
          lastTapAtRef.current = now;

          if (dt > 0 && dt < 280) {
            suppressClickRef.current = true;
            setTimeout(() => suppressClickRef.current = false, 350);
            onLike();
          }
        }}
        onClick={() => {
          if (suppressClickRef.current) return;
          togglePlay();
        }}
      >
        {isImageCollection ? (
          // ── Image Collection ───────────────────────────────────────────────
          <div className="relative w-full h-full">
            <div
              ref={imageScrollRef}
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
              `}</style>

              {images.map((imageUrl, index) => (
                <div key={index} className="flex-shrink-0 w-full h-full snap-start">
                  <img
                    src={imageUrl}
                    alt={`${video.title} - Image ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="object-contain w-full h-full bg-black"
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <div className="absolute z-30 top-6 right-4">
                <span className="px-3 py-1 text-xs font-semibold text-white border rounded-full bg-black/35 backdrop-blur-sm border-white/15">
                  {currentImageIndex + 1} / {images.length}
                </span>
              </div>
            )}

            {images.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToImage(currentImageIndex - 1);
                    }}
                    className="absolute z-20 flex items-center justify-center w-10 h-10 text-white transition-all -translate-y-1/2 rounded-full left-4 top-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                {currentImageIndex < images.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToImage(currentImageIndex + 1);
                    }}
                    className="absolute z-20 flex items-center justify-center w-10 h-10 text-white transition-all -translate-y-1/2 rounded-full right-4 top-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          // ── Video Player ───────────────────────────────────────────────────
          <div className="relative w-full h-full bg-black">
            {/* Poster shown while loading or when video not near/active */}
            {(!isNearActive || isLoading) && video.poster && (
              <img
                src={video.poster}
                alt={video.title}
                className="absolute inset-0 object-cover w-full h-full"
              />
            )}

            {hasVideo && video.videoUrl && (
              <ReactPlayer
                {...({
                  ref: playerRef,
                  url: video.videoUrl,
                  playing: isPlaying,
                  loop: true,
                  muted: true,
                  playsinline: true,
                  width: "100%",
                  height: "100%",
                  style: { position: "absolute", inset: 0 },
                  config: {
                    file: {
                      attributes: {
                        style: { objectFit: "cover" },
                        preload: "metadata",
                        poster: video.poster || undefined,
                      },
                    },
                  },
                  onReady: () => {
                    // Don't set loading to false here - wait for actual playback
                  },
                  onStart: () => {
                    // Video actually started playing
                    setIsLoading(false);
                    setIsPlaying(true);
                    isTransitioningRef.current = false;
                  },
                  onPlay: () => {
                    // Video is playing
                    setIsLoading(false);
                    setIsPlaying(true);
                    isTransitioningRef.current = false;
                  },
                  onPause: () => {
                    setIsPlaying(false);
                  },
                  onError: (e: any) => {
                    console.error("ReactPlayer error:", e);
                    setIsLoading(false);
                    isTransitioningRef.current = false;
                  },
                  onProgress: () => {
                    // Video is progressing, so it's playing
                    if (isLoading && isPlaying) {
                      setIsLoading(false);
                    }
                  },
                } as any)}
              />
            )}

            {/* Loading spinner - show as long as loading */}
            {isLoading && hasVideo && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                <div className="w-12 h-12 border-4 rounded-full border-white/30 border-t-white animate-spin" />
              </div>
            )}

            {/* Play/Pause overlay */}
            {hasVideo && showControls && !isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm">
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <PlayCircle className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subject badge */}
        <div className="absolute z-20 pointer-events-none top-6 left-4">
          <span className="px-3 py-1 text-sm font-bold text-white rounded-full shadow bg-primary">
            {video.subject}
          </span>
        </div>

        {/* Right-side action buttons */}
        <div className="absolute z-20 flex flex-col items-center gap-6 right-4 bottom-28">
          <button onClick={onLike} className="flex flex-col items-center gap-1 group">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                liked ? "bg-red-500" : "bg-white/20 backdrop-blur-sm group-hover:bg-white/30"
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-white text-white" : "text-white"}`} />
            </div>
            <span className="text-xs font-bold text-white">{video.likes}</span>
          </button>

          <button onClick={onComment} className="flex flex-col items-center gap-1 group">
            <div className="flex items-center justify-center w-12 h-12 text-white transition-colors rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">{video.comments}</span>
          </button>

          <button onClick={onShare} className="flex flex-col items-center gap-1 group">
            <div className="flex items-center justify-center w-12 h-12 text-white transition-colors rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Share</span>
          </button>

          <button onClick={onSave} className="flex flex-col items-center gap-1 group">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                saved ? "bg-primary" : "bg-white/20 backdrop-blur-sm group-hover:bg-white/30"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${saved ? "fill-white text-white" : "text-white"}`} />
            </div>
            <span className="text-xs font-bold text-white">Save</span>
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-24 pointer-events-none bg-gradient-to-t from-black/85 to-transparent">
          <div
            className="flex items-center gap-3 mb-3 transition-opacity cursor-pointer pointer-events-auto hover:opacity-80"
            onClick={(e) => {
              e.stopPropagation();
              const slug = video.authorId || video.author.toLowerCase().replace(/\s+/g, "-");
              router.push(`/profile/${slug}`);
            }}
          >
            {video.authorPhoto ? (
              <img
                src={video.authorPhoto}
                alt={video.author}
                className="object-cover w-10 h-10 border-2 rounded-full border-white/50"
              />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white border-2 rounded-full border-white/50 bg-primary">
                {video.author.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-white">{video.author}</p>
              <p className="text-xs text-white/70">
                {video.views} views • {video.date}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white line-clamp-2">
            {video.title}
          </h2>
        </div>
      </div>
    </div>
  );
}