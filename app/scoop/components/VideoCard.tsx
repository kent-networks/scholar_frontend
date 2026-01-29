"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, PlayCircle, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { videoApi } from "@/lib/api/videos";
import { useAuth } from "@/contexts/AuthContext";

interface VideoCardProps {
  video: {
    id: number;
    title: string;
    description?: string;
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
  onViewIncremented?: (videoId: number) => void;
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
  onViewIncremented,
  liked,
  saved,
  isActive = false,
  isNearActive = false,
}: VideoCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const lastTapAtRef = useRef<number>(0);
  const suppressClickRef = useRef(false);
  const viewLoggedRef = useRef(false);
  
  const description = (video as any).description || "";
  const shouldShowMore = description.length > 100;
  const truncatedDescription = shouldShowMore ? description.substring(0, 100) + "..." : description;

  const isImageCollection = video.isImageCollection && video.imageUrls && video.imageUrls.length > 0;
  const images = video.imageUrls || [];
  const hasVideo = !!video.videoUrl && !isImageCollection;
  const shouldPlay = hasVideo && isActive && isNearActive && !userPaused;
  // Reset view logged when video changes
  useEffect(() => {
    viewLoggedRef.current = false;
    setUserPaused(false);
    setIsLoading(true);
  }, [video.id]);

  // When scroll away: pause and mute so the video left behind stops and is muted (TikTok-style)
  useEffect(() => {
    if (!hasVideo) return;
    const el = videoRef.current;
    if (!el) return;
    if (!shouldPlay) {
      el.pause();
      el.muted = true;
      setIsMuted(true);
    }
  }, [shouldPlay, hasVideo]);

  // Log view when video/image becomes active (only once, only if authenticated)
  useEffect(() => {
    if (isActive && isAuthenticated && !viewLoggedRef.current) {
      viewLoggedRef.current = true;
      videoApi.incrementViews(video.id).then(() => {
        onViewIncremented?.(video.id);
      }).catch(err => {
        console.error('Error incrementing views:', err);
      });
    }
  }, [isActive, isAuthenticated, video.id, onViewIncremented]);

  // When leaving the active/near-active window, reset pause state so next time it can autoplay.
  useEffect(() => {
    if (!hasVideo) return;
    if (!isActive || !isNearActive) {
      setUserPaused(false);
      setIsLoading(true);
    } else {
      setIsLoading(true);
    }
  }, [isActive, isNearActive, hasVideo]);

  const togglePlay = () => {
    if (!hasVideo) return;
    if (!isActive) return;
    const el = videoRef.current;
    const nextPaused = !userPaused;
    setUserPaused(nextPaused);
    // On first play (user tap), unmute in same gesture so sound works (default: unmuted after tap)
    if (!nextPaused && el) {
      el.muted = false;
      setIsMuted(false);
    }
  };

  // Sync native video with shouldPlay
  useEffect(() => {
    const el = videoRef.current;
    if (!hasVideo || !el) return;
    if (shouldPlay) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [shouldPlay, hasVideo]);

  // Sync muted state with video element
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
  }, [isMuted]);

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
              <div className="absolute z-30 top-20 right-14">
                <span className="px-3 py-1 text-xs font-semibold text-white border rounded-full bg-black/35 backdrop-blur-sm border-white/15">
                  {currentImageIndex + 1} / {images.length}
                </span>
              </div>
            )}

            {images.length > 1 && (
              <>
                {/* Desktop navigation buttons */}
                {currentImageIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToImage(currentImageIndex - 1);
                    }}
                    className="absolute z-20 items-center justify-center hidden w-10 h-10 text-white transition-all -translate-y-1/2 rounded-full md:flex left-20 top-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70"
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
                    className="absolute z-20 items-center justify-center hidden w-10 h-10 text-white transition-all -translate-y-1/2 rounded-full md:flex right-20 top-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
                
                {/* Mobile dots indicator */}
                <div className="absolute z-30 flex items-center justify-center gap-2 -translate-x-1/2 left-1/2 md:hidden bottom-48">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToImage(index);
                      }}
                      className={`transition-all rounded-full ${
                        index === currentImageIndex
                          ? "w-2.5 h-2.5 bg-white"
                          : "w-2 h-2 bg-white/50"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          // ── Native video (Supabase public URL) ─────────────────────────────
          <div className="relative flex items-center justify-center w-full h-full bg-black">
            {(!isNearActive || isLoading) && video.poster && (
              <img
                src={video.poster}
                alt={video.title}
                className="absolute inset-0 object-contain w-full h-full"
              />
            )}
            
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.poster || undefined}
              loop
              playsInline
              muted={isMuted}
              preload="auto"
              className="absolute inset-0 object-contain w-full h-full"
              onCanPlay={() => {
                if (isActive && isNearActive) setIsLoading(false);
              }}
              onPlaying={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              onLoadedData={() => {
                if (isActive && isNearActive) setIsLoading(false);
              }}
            />
            {/* Loading spinner */}
            {isLoading && hasVideo && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                <div className="w-12 h-12 border-4 rounded-full border-white/30 border-t-white animate-spin" />
              </div>
            )}
            {/* Play / Pause overlay (tap to toggle) */}
            {hasVideo && showControls && !isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm">
                  {!userPaused && shouldPlay ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <PlayCircle className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>
            )}
            {/* Mute / Unmute button — unmute in same user gesture so sound is allowed */}
            {hasVideo && !isLoading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const el = videoRef.current;
                  const nextMuted = !isMuted;
                  if (el) {
                    el.muted = nextMuted;
                    if (!nextMuted) el.play().catch(() => {});
                  }
                  setIsMuted(nextMuted);
                }}
                className="absolute z-20 flex items-center justify-center w-10 h-10 text-white transition-colors rounded-full bottom-[200px] left-4 bg-black/50 backdrop-blur-sm hover:bg-black/60"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
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
          {/* Mobile: Profile photo above like button */}
          <div className="md:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const slug = video.authorId || video.author.toLowerCase().replace(/\s+/g, "-");
                router.push(`/profile/${slug}`);
              }}
              className="mb-4 transition-opacity hover:opacity-80"
            >
              {video.authorPhoto ? (
                <img
                  src={video.authorPhoto}
                  alt={video.author}
                  className="object-cover w-12 h-12 border-2 rounded-full border-white/50"
                />
              ) : (
                <div className="flex items-center justify-center w-12 h-12 text-sm font-bold text-white border-2 rounded-full border-white/50 bg-primary">
                  {video.author.charAt(0).toUpperCase()}
                </div>
              )}
            </button>
          </div>
          
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
        <div className="absolute bottom-0 left-0 z-30 p-6 pb-24 pointer-events-none md:pb-16 right-20 bg-gradient-to-t from-black/85 to-transparent ">
          {/* Desktop: Full profile info with photo */}
          <div
            className="relative z-40 items-center hidden gap-3 mb-3 transition-opacity cursor-pointer pointer-events-auto md:flex hover:opacity-80"
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
          
          {/* Mobile: Name only */}
          <div
            className="relative z-40 mb-3 transition-opacity cursor-pointer pointer-events-auto md:hidden hover:opacity-80"
            onClick={(e) => {
              e.stopPropagation();
              const slug = video.authorId || video.author.toLowerCase().replace(/\s+/g, "-");
              router.push(`/profile/${slug}`);
            }}
          >
            <p className="text-sm font-bold text-white">{video.author}</p>
            <p className="text-xs text-white/70">
              {video.views} views • {video.date}
            </p>
          </div>

          <div className="relative z-40 pointer-events-auto">
            {video.title && (
              <h2 className="mb-2 text-xl font-bold text-white line-clamp-2">
                {video.title}
              </h2>
            )}
            
            {description && (
              <div className="text-sm text-white/90">
                {!isDescriptionExpanded ? (
                  <div>
                    <span>{truncatedDescription}</span>
                    {shouldShowMore && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDescriptionExpanded(true);
                        }}
                        className="ml-1 font-semibold text-white hover:underline"
                      >
                        ...more
                      </button>
                    )}
                  </div>
                ) : (
                  <AnimatePresence>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="overflow-y-auto max-h-52">
                        <span>{description}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDescriptionExpanded(false);
                          }}
                          className="ml-1 font-semibold text-white hover:underline"
                        >
                          ...less
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}