"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { ArrowLeft, Loader2 } from "lucide-react";
import FileUploadArea from "@/components/FileUploadArea";
import Toggle from "@/components/Toggle";
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

export default function ResearchLabUploadPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [caption, setCaption] = useState("");
  const [subject, setSubject] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPublic, setIsPublic] = useState(false);

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
        alert(`File ${file.name} exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB`);
        return;
      }

      if (selectedFiles.length >= MAX_FILES) {
        alert(`Maximum ${MAX_FILES} files allowed`);
        return;
      }

      // Allow both videos and images
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        alert("Only images and videos are supported");
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
      // For now, upload only the first video file (can be extended for multiple)
      const videoFile = selectedFiles.find((f) => f.file.type.startsWith("video/"));
      const imageFiles = selectedFiles.filter((f) => f.file.type.startsWith("image/"));

      if (videoFile) {
        // Upload video
        const uploadPromise = uploadApi.uploadVideo(videoFile.file, {
          title: caption || "Untitled Video",
          description: caption,
          subject: subject || undefined,
          videoType: "research-lab",
        });

        // Track progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 5;
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
          videoType: "research-lab",
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
      } else {
        toast.error("Please select a video or image file");
        setIsUploading(false);
        return;
      }

      // Clean up preview URLs
      selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
      
      setTimeout(() => {
        router.push("/research-lab");
      }, 500);
    } catch (error: any) {
      setUploadProgress(0);
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 pb-20 overflow-y-auto md:pb-0">
        <div className="max-w-4xl p-4 mx-auto md:p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-4 transition-colors text-slate-600 dark:text-slate-400 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
              Upload to Research Lab
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Share videos or photos with the research community
            </p>
          </div>

          {/* Modern Upload Interface */}
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
              <div className="p-6 space-y-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-600 dark:text-slate-400">
                    Uploading {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}...
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{uploadProgress}%</span>
                </div>
                <div className="w-full h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-3 transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary-dark"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Caption Input */}
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-900 dark:text-white">
                Title / Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a title or caption..."
                rows={4}
                disabled={isUploading}
                className="w-full px-4 py-3 bg-white border rounded-lg resize-none border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {caption.length} characters
              </p>
            </div>

            {/* Subject Input */}
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-900 dark:text-white">
                Subject (Optional)
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Physics, AI, Biology..."
                disabled={isUploading}
                className="w-full px-4 py-3 bg-white border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50"
              />
            </div>

            {/* Additional Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <div>
                  <label
                    htmlFor="public"
                    className="block mb-1 text-sm font-bold cursor-pointer text-slate-900 dark:text-white"
                  >
                    Make this public
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Allow others to view and interact with your content
                  </p>
                </div>
                <Toggle
                  checked={isPublic}
                  onChange={setIsPublic}
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                disabled={isUploading}
                className="flex-1 px-6 py-3 font-bold transition-colors border rounded-lg border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-bold text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
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

