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
  const playerRef = useRef<ReactPlayer>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const videoUrl = video.videoUrl;
  const isImageCollection = video.isImageCollection && video.imageUrls && video.imageUrls.length > 0;
  const images = video.imageUrls || [];

  const togglePlay = () => {
    if (!isImageCollection) {
      setIsPlaying(!isPlaying);
    }
  };

  const scrollToImage = (index: number) => {
    if (imageScrollRef.current && images.length > 0) {
      const imageWidth = imageScrollRef.current.clientWidth;
      imageScrollRef.current.scrollTo({
        left: index * imageWidth,
        behavior: 'smooth',
      });
      setCurrentImageIndex(index);
    }
  };

  const handleImageScroll = () => {
    if (imageScrollRef.current && images.length > 0) {
      const imageWidth = imageScrollRef.current.clientWidth;
      const scrollLeft = imageScrollRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / imageWidth);
      setCurrentImageIndex(newIndex);
    }
  };

  useEffect(() => {
    if (isImageCollection && imageScrollRef.current) {
      imageScrollRef.current.addEventListener('scroll', handleImageScroll);
      return () => {
        imageScrollRef.current?.removeEventListener('scroll', handleImageScroll);
      };
    }
  }, [isImageCollection, images.length]);

  return (
    <div className="relative flex-shrink-0 w-full h-screen snap-start">
      {/* Video/Image Container */}
      <div
        className="relative flex items-center justify-center w-full h-full overflow-hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={togglePlay}
      >
        {isImageCollection ? (
          /* Image Collection - Horizontal Scroll */
          <div className="relative w-full h-full">
            <div
              ref={imageScrollRef}
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full h-full snap-start"
                >
                  <img
                    src={imageUrl}
                    alt={`${video.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Image Navigation Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToImage(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToImage(currentImageIndex - 1);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          /* Video Player */
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            playing={isPlaying}
            loop
            muted
            playsinline
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
            onReady={() => setIsLoading(false)}
            onBuffer={() => setIsLoading(true)}
            onBufferEnd={() => setIsLoading(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            config={{
              file: {
                attributes: {
                  style: { objectFit: "cover" },
                },
              },
            }}
          />
        )}

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

