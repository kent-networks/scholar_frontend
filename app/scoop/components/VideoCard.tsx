"use client";

import { Heart, MessageCircle, Share2, Bookmark, PlayCircle } from "lucide-react";

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
  return (
    <div className="relative w-full h-screen flex-shrink-0 snap-start">
      {/* Video Container */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          backgroundImage: `url(${video.poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        {/* Video Placeholder */}
        <div className="relative z-10 text-center">
          <PlayCircle className="h-20 w-20 text-white/70 mx-auto" />
          <p className="text-white/80 mt-3 text-base font-semibold">Video Player</p>
        </div>

        {/* Subject Badge */}
        <div className="absolute top-6 left-4 z-10">
          <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-full shadow-sm">
            {video.subject}
          </span>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-28 flex flex-col gap-6 items-center z-10">
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-6 pb-24 z-10">
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

