"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Share2, Bookmark, PlayCircle, Pause } from "lucide-react";

interface VideoCardProps {
  video: {
    id: number;
    title: string;
    subject: string;
    author: string;
    authorId?: string;
    authorPhoto?: string;
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
  const router = useRouter();
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
    <div className="relative flex-shrink-0 w-full h-screen snap-start">
      {/* Video Container */}
      <div
        className="relative flex items-center justify-center w-full h-full overflow-hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={togglePlay}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          poster={video.poster}
          className="object-cover w-full h-full"
          loop
          muted
          playsInline
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
            <div className="w-12 h-12 border-4 rounded-full border-white/30 border-t-white animate-spin" />
          </div>
        )}

        {/* Play/Pause Overlay */}
        {showControls && !isLoading && (
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

        {/* Subject Badge */}
        <div className="absolute z-20 pointer-events-none top-6 left-4">
          <span className="px-3 py-1 text-sm font-bold text-white rounded-full shadow-sm bg-primary">
            {video.subject}
          </span>
        </div>

        {/* Right Side Actions */}
        <div className="absolute z-20 flex flex-col items-center gap-6 right-4 bottom-28">
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
            <span className="text-xs font-bold text-white">
              {video.likes + (liked ? 1 : 0)}
            </span>
          </button>

          <button
            onClick={onComment}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="flex items-center justify-center w-12 h-12 text-white transition-all rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">{video.comments}</span>
          </button>

          <button
            onClick={onShare}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="flex items-center justify-center w-12 h-12 text-white transition-all rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Share</span>
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
            <span className="text-xs font-bold text-white">Save</span>
          </button>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-24 bg-gradient-to-t from-black/85 to-transparent">
          {/* Owner Info - Clickable */}
          <div 
            className="flex items-center gap-3 mb-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/${video.authorId || video.author.toLowerCase().replace(/\s+/g, '-')}`);
            }}
          >
            {video.authorPhoto ? (
              <img 
                src={video.authorPhoto} 
                alt={video.author}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold border-2 border-white/50">
                {video.author.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-white">{video.author}</p>
              <p className="text-xs text-white/70">{video.views} views • {video.date}</p>
            </div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-white line-clamp-2 pointer-events-none">
            {video.title}
          </h2>
        </div>
      </div>
    </div>
  );
}

