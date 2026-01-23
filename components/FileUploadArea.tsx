"use client";

import { useRef } from "react";
import { Upload, X, Video, Image as ImageIcon } from "lucide-react";

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

interface FileUploadAreaProps {
  files: UploadedFile[];
  onFilesSelect: (files: FileList | null) => void;
  onFileRemove: (id: string) => void;
  dragActive: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  maxFiles?: number;
  maxFileSizeMB?: number;
  accept?: string;
  disabled?: boolean;
}

export default function FileUploadArea({
  files,
  onFilesSelect,
  onFileRemove,
  dragActive,
  onDragOver,
  onDragLeave,
  onDrop,
  maxFiles = 10,
  maxFileSizeMB = 50,
  accept = "video/*,image/*",
  disabled = false,
}: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("video/")) return <Video className="w-8 h-8" />;
    if (file.type.startsWith("image/")) return <ImageIcon className="w-8 h-8" />;
    return null;
  };

  if (!files || files.length === 0) {
    return (
      <>
        <div
          className={`relative border-2 border-dashed rounded-2xl p-16 transition-all ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50"
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-6 text-white shadow-lg rounded-2xl bg-gradient-to-br from-primary to-primary-dark">
                <Upload className="w-12 h-12" />
              </div>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
              Upload Video or Photos
            </h3>
            <p className="mb-2 text-base text-slate-600 dark:text-slate-400">
              Drag and drop files here or click to browse
            </p>
            <p className="mb-6 text-sm text-slate-500 dark:text-slate-500">
              Maximum allowed file/upload size: {maxFileSizeMB}MB
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="px-8 py-4 font-bold text-white transition-all transform shadow-lg bg-primary hover:bg-primary-dark rounded-xl hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple
              onChange={(e) => {
                onFilesSelect(e.target.files);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="hidden"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="relative overflow-hidden group aspect-square rounded-xl bg-slate-200 dark:bg-slate-800"
          >
            {file.file.type.startsWith("video/") ? (
              <video
                src={file.preview}
                className="object-cover w-full h-full"
                muted
                playsInline
              />
            ) : (
              <img
                src={file.preview}
                alt={file.file.name}
                className="object-cover w-full h-full"
              />
            )}
            <button
              onClick={() => onFileRemove(file.id)}
              disabled={disabled}
              className="absolute p-2 text-white transition-colors rounded-full top-2 right-2 bg-black/60 hover:bg-black/80 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-2 mb-1">
                {getFileIcon(file.file)}
                <p className="flex-1 text-xs text-white truncate">{file.file.name}</p>
              </div>
              <p className="text-xs text-white/70">{formatFileSize(file.file.size)}</p>
            </div>
          </div>
        ))}

        {files.length < maxFiles && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="flex flex-col items-center justify-center gap-2 transition-all border-2 border-dashed aspect-square rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-primary hover:bg-primary/5 disabled:opacity-50"
          >
            <Upload className="w-8 h-8 text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Add More</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => {
          onFilesSelect(e.target.files);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        className="hidden"
      />
    </div>
  );
}

