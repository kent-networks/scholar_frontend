"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { ArrowLeft, Loader2 } from "lucide-react";
import FileUploadArea from "@/components/FileUploadArea";
import Dropdown from "@/components/Dropdown";
import { uploadApi } from "@/lib/api/upload";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes
const MAX_FILE_SIZE_MB = 500;
const MAX_FILES = 10;

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

export default function ScoopUploadPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [subject, setSubject] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB`);
        return;
      }

      if (selectedFiles.length >= MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files allowed`);
        return;
      }

      // Allow both videos and images
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("Only images and videos are supported");
        return;
      }

      const preview = URL.createObjectURL(file);
      const newFile: UploadedFile = {
        file,
        preview,
        id: Math.random().toString(36).substring(7),
      };

      setSelectedFiles((prev) => [...prev, newFile]);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const videoFiles = selectedFiles.filter((f) => f.file.type.startsWith("video/"));
      const imageFiles = selectedFiles.filter((f) => f.file.type.startsWith("image/"));

      if (videoFiles.length > 0 && imageFiles.length > 0) {
        toast.error("Please upload either videos or images, not both");
        setIsUploading(false);
        return;
      }

      if (videoFiles.length > 1) {
        toast.error("Please upload only one video at a time");
        setIsUploading(false);
        return;
      }

      if (videoFiles.length === 1) {
        // Upload single video
        const uploadPromise = uploadApi.uploadVideo(videoFiles[0].file, {
          title: title || "Untitled Video",
          description: caption,
          subject: subject || undefined,
          videoType: "scoop",
        });
        
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        await uploadPromise;
        clearInterval(progressInterval);
        setUploadProgress(100);
        toast.success("Video uploaded successfully!");
      } else if (imageFiles.length > 0) {
        // Upload images
        const uploadPromise = uploadApi.uploadImages(imageFiles.map((f) => f.file), {
          description: caption,
          subject: subject || undefined,
          videoType: "scoop",
        });
        
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        await uploadPromise;
        clearInterval(progressInterval);
        setUploadProgress(100);
        toast.success(`${imageFiles.length} image(s) uploaded successfully!`);
      }

      setTimeout(() => {
        router.push("/scoop");
      }, 500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload");
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 pb-20 overflow-y-auto md:pb-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Upload to Scoop
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Share videos or images with the community
            </p>
          </div>

          {/* Upload Interface */}
          <div className="space-y-6">
            {/* File Upload Area */}
            <FileUploadArea
              files={selectedFiles}
              onFilesSelect={handleFileSelect}
              onFileRemove={removeFile}
              dragActive={dragActive}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              maxFiles={MAX_FILES}
              maxFileSizeMB={MAX_FILE_SIZE_MB}
              accept="video/*,image/*"
              disabled={isUploading}
            />

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Uploading...</span>
                  <span className="font-bold text-slate-900 dark:text-white">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Title Input */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title..."
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-50"
              />
            </div>

            {/* Caption Input */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                rows={4}
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-colors disabled:opacity-50"
              />
            </div>

            {/* Subject Input */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                Subject (Optional)
              </label>
              <Dropdown
                options={[
                  { value: "", label: "None" },
                  { value: "Mathematics", label: "Mathematics" },
                  { value: "Physics", label: "Physics" },
                  { value: "Chemistry", label: "Chemistry" },
                  { value: "Biology", label: "Biology" },
                  { value: "Computer Science", label: "Computer Science" },
                  { value: "Engineering", label: "Engineering" },
                  { value: "Medicine", label: "Medicine" },
                  { value: "Psychology", label: "Psychology" },
                  { value: "Economics", label: "Economics" },
                  { value: "History", label: "History" },
                  { value: "Literature", label: "Literature" },
                  { value: "Philosophy", label: "Philosophy" },
                  { value: "Art", label: "Art" },
                  { value: "Music", label: "Music" },
                  { value: "Geography", label: "Geography" },
                  { value: "Astronomy", label: "Astronomy" },
                  { value: "Environmental Science", label: "Environmental Science" },
                  { value: "Political Science", label: "Political Science" },
                  { value: "Sociology", label: "Sociology" },
                  { value: "Business", label: "Business" },
                  { value: "Education", label: "Education" },
                  { value: "Law", label: "Law" },
                  { value: "Architecture", label: "Architecture" },
                  { value: "Agriculture", label: "Agriculture" },
                  { value: "Other", label: "Other" },
                ]}
                value={subject}
                onChange={(e) => {
                  const value = typeof e === 'string' ? e : e.target.value;
                  setSubject(value === "" ? "" : value);
                }}
                placeholder="Select a subject (optional)..."
                className="transition-colors"
                disabled={isUploading}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                disabled={isUploading}
                className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 pb-safe">
        <MobileBottomNav />
      </div>
    </div>
  );
}

