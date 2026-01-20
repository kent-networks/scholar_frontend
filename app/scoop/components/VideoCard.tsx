"use client";

import { useState } from "react";

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
  };
  isActive: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  liked: boolean;
  saved: boolean;
}

export default function VideoCard({
  video,
  isActive,
  onLike,
  onComment,
  onShare,
  onSave,
  liked,
  saved,
}: VideoCardProps) {
  return (
    <div
      className={`relative w-full h-screen flex-shrink-0 snap-start ${
        isActive ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Video Container */}
      <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
        {/* Video Placeholder */}
        <div className="text-center">
          <span className="material-symbols-outlined text-8xl text-white/50">
            play_circle
          </span>
          <p className="text-white/70 mt-4 text-lg">Video Player</p>
        </div>

        {/* Subject Badge */}
        <div className="absolute top-6 left-4">
          <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-full">
            {video.subject}
          </span>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center">
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
              <span className="material-symbols-outlined">
                {liked ? "favorite" : "favorite_border"}
              </span>
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
              <span className="material-symbols-outlined">chat_bubble</span>
            </div>
            <span className="text-white text-xs font-bold">{video.comments}</span>
          </button>

          <button
            onClick={onShare}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all">
              <span className="material-symbols-outlined">share</span>
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
              <span className="material-symbols-outlined">
                {saved ? "bookmark" : "bookmark_border"}
              </span>
            </div>
            <span className="text-white text-xs font-bold">Save</span>
          </button>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-20">
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

