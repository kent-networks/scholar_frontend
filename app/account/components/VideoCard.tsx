"use client";

import { Video, Heart, Trash2, MoreVertical } from "lucide-react";
import { Video as VideoType } from "@/lib/api/videos";
import Tooltip from "@/components/Tooltip";
import ButtonDropdown from "@/components/ButtonDropdown";

interface VideoCardProps {
  video: VideoType;
  viewMode: "grid" | "list";
  activeTab: "uploads" | "liked" | "saved";
  onDelete?: (videoId: number) => void;
}

export default function VideoCard({ video, viewMode, activeTab, onDelete }: VideoCardProps) {
  // Same as Trending Research: one preview source, detect video by extension
  const previewSource = video.poster || video.thumbnailUrl || video.videoUrl || "";
  const isVideoPreview =
    !!previewSource && /\.(mp4|webm|mov)(\?|$)/i.test(previewSource);

  if (viewMode === "grid") {
    return (
      <div className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
        {isVideoPreview ? (
          <video
            src={previewSource}
            preload="metadata"
            muted
            playsInline
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <img
            src={previewSource || ""}
            alt={video.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
        )}
        {activeTab === "uploads" && onDelete && (
          <div className="absolute top-2 right-2 z-10">
            <ButtonDropdown
              buttonContent={<MoreVertical className="w-5 h-5 text-white" />}
              buttonClassName="p-2 text-white transition-colors bg-black/70 rounded-full hover:bg-black/90"
              options={[
                {
                  label: "Delete video",
                  value: "delete",
                  icon: Trash2,
                  danger: true,
                  onClick: () => onDelete(video.id),
                },
              ]}
            />
          </div>
        )}
        <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100">
          <div className="absolute text-white bottom-2 left-2 right-2">
            <p className="text-xs font-bold line-clamp-1">{video.title}</p>
            <div className="flex items-center gap-3 mt-1 text-xs">
              <span className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                {video.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {video.likes}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 transition-colors rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 group">
      <div className="relative flex-shrink-0 w-32 h-48 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
        {isVideoPreview ? (
          <video
            src={previewSource}
            preload="metadata"
            muted
            playsInline
            className="object-cover w-full h-full"
          />
        ) : (
          <img
            src={previewSource || ""}
            alt={video.title}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <div className="flex-1">
        <h3 className="mb-2 text-lg font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary">
          {video.title}
        </h3>
        {video.description && (
          <p className="mb-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {video.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Video className="w-4 h-4" />
              {video.views} views
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {video.likes} likes
            </span>
          </div>
          {activeTab === "uploads" && onDelete && (
            <div>
              <ButtonDropdown
                buttonContent={<MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
                buttonClassName="p-2 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                options={[
                  {
                    label: "Delete video",
                    value: "delete",
                    icon: Trash2,
                    danger: true,
                    onClick: () => onDelete(video.id),
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

