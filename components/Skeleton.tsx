"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses = "bg-slate-200 dark:bg-slate-700";
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-[shimmer_2s_infinite]",
    none: "",
  };

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "",
    rounded: "rounded-lg",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="relative w-full h-screen flex-shrink-0 snap-start bg-slate-900">
      <div className="absolute inset-0 flex items-center justify-center">
        <Skeleton variant="rectangular" className="w-full h-full" />
      </div>
      <div className="absolute top-6 left-4 z-20">
        <Skeleton variant="rounded" width={80} height={28} />
      </div>
      <div className="absolute right-4 bottom-28 z-20 flex flex-col gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="text" width={30} height={12} />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-24 bg-gradient-to-t from-black/85 to-transparent">
        <Skeleton variant="text" width="60%" height={24} className="mb-2" />
        <Skeleton variant="text" width="40%" height={16} />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden transition-all duration-300 border shadow-sm rounded-xl bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800">
      <Skeleton variant="rectangular" height={192} className="w-full" />
      <div className="p-5 space-y-3">
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
        <div className="flex items-center justify-between mt-4">
          <Skeleton variant="text" width={100} height={14} />
          <Skeleton variant="text" width={80} height={14} />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Skeleton variant="circular" width={128} height={128} />
        <div className="flex-1 space-y-4">
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="80%" height={14} />
          <div className="flex gap-6">
            <Skeleton variant="text" width={100} height={20} />
            <Skeleton variant="text" width={100} height={20} />
            <Skeleton variant="text" width={100} height={20} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} variant="rectangular" className="aspect-[9/16]" />
        ))}
      </div>
    </div>
  );
}

