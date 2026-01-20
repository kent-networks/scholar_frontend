"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, PlayCircle, Pause } from "lucide-react";

interface VideoCardProps {
  video: {
    id: number;
    title: string;
    subject: string;
    author: string;
    views: number;
    likes: number;
    comments: number;
    date: string;
    poster: string;
    videoUrl?: string;
  };
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  liked: boolean;
  saved: boolean;
}

export default function VideoCard({
  video,
  onLike,
  onComment,
  onShare,
  onSave,
  liked,
  saved,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Use sample video URLs if videoUrl is not provided
  const sampleVideoUrls = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  ];

  const videoUrl = video.videoUrl || sampleVideoUrls[video.id % sampleVideoUrls.length];

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Set random start time when video loads
    const handleLoadedMetadata = () => {
      if (videoElement.duration) {
        const randomTime = Math.random() * (videoElement.duration - 10); // Random time, leaving 10s buffer
        videoElement.currentTime = randomTime;
      }
      setIsLoading(false);
    };

    // Auto-play when video is ready
    const handleCanPlay = () => {
      videoElement.play().catch(() => {
        // Autoplay blocked, show play button
        setIsPlaying(false);
      });
      setIsPlaying(true);
    };

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.addEventListener("play", () => setIsPlaying(true));
    videoElement.addEventListener("pause", () => setIsPlaying(false));
    videoElement.addEventListener("waiting", () => setIsLoading(true));
    videoElement.addEventListener("playing", () => setIsLoading(false));

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("canplay", handleCanPlay);
      videoElement.removeEventListener("play", () => setIsPlaying(true));
      videoElement.removeEventListener("pause", () => setIsPlaying(false));
      videoElement.removeEventListener("waiting", () => setIsLoading(true));
      videoElement.removeEventListener("playing", () => setIsLoading(false));
    };
  }, [video.id]);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  };

  return (
    <div className="relative w-full h-screen flex-shrink-0 snap-start">
      {/* Video Container */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={togglePlay}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          poster={video.poster}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Play/Pause Overlay */}
        {showControls && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              {isPlaying ? (
                <Pause className="h-10 w-10 text-white" />
              ) : (
                <PlayCircle className="h-10 w-10 text-white" />
              )}
            </div>
          </div>
        )}

        {/* Subject Badge */}
        <div className="absolute top-6 left-4 z-20 pointer-events-none">
          <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-full shadow-sm">
            {video.subject}
          </span>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-28 flex flex-col gap-6 items-center z-20">
          <button
            onClick={onLike}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                liked
                  ? "bg-red-500 text-white"
                  : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              }`}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-white" : ""}`} />
            </div>
            <span className="text-white text-xs font-bold">
              {video.likes + (liked ? 1 : 0)}
            </span>
          </button>

          <button
            onClick={onComment}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all">
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="text-white text-xs font-bold">{video.comments}</span>
          </button>

          <button
            onClick={onShare}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all">
              <Share2 className="h-5 w-5" />
            </div>
            <span className="text-white text-xs font-bold">Share</span>
          </button>

          <button
            onClick={onSave}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                saved
                  ? "bg-primary text-white"
                  : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              }`}
            >
              <Bookmark className={`h-5 w-5 ${saved ? "fill-white" : ""}`} />
            </div>
            <span className="text-white text-xs font-bold">Save</span>
          </button>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-6 pb-24 z-20 pointer-events-none">
          <h2 className="text-white text-xl font-bold mb-2 line-clamp-2">
            {video.title}
          </h2>
          <div className="flex items-center gap-3 text-white/80 text-sm mb-3">
            <span>{video.author}</span>
            <span>•</span>
            <span>{video.views} views</span>
            <span>•</span>
            <span>{video.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

