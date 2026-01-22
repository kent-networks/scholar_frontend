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
  maxFileSizeMB = 500,
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
    if (file.type.startsWith("video/")) return <Video className="h-8 w-8" />;
    if (file.type.startsWith("image/")) return <ImageIcon className="h-8 w-8" />;
    return null;
  };

  if (files.length === 0) {
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
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg">
                <Upload className="h-12 w-12" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Upload Video or Photos
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-400 mb-2">
              Drag and drop files here or click to browse
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
              Maximum {maxFiles} files • {maxFileSizeMB}MB per file
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="relative group aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800"
          >
            {file.file.type.startsWith("video/") ? (
              <video
                src={file.preview}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={file.preview}
                alt={file.file.name}
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={() => onFileRemove(file.id)}
              disabled={disabled}
              className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-2 mb-1">
                {getFileIcon(file.file)}
                <p className="text-xs text-white truncate flex-1">{file.file.name}</p>
              </div>
              <p className="text-xs text-white/70">{formatFileSize(file.file.size)}</p>
            </div>
          </div>
        ))}

        {files.length < maxFiles && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 disabled:opacity-50"
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

