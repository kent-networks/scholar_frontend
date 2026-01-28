"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Download, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { communityApi } from "@/lib/api/communities";
import ModalDialog from "@/components/ModalDialog";
import Tooltip from "@/components/Tooltip";
import toast from "react-hot-toast";

interface CommunityFile {
  id: number;
  fileName: string;
  filePath: string;
  url?: string;
  fileType?: string;
  fileSize?: number;
  createdAt?: string;
  uploadedAt?: string;
  uploadedBy?: number;
  uploadedByName?: string;
  uploaderName?: string;
}

interface FilesSectionProps {
  communityId: number;
  isMember: boolean;
}

export default function FilesSection({ communityId, isMember }: FilesSectionProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const isGlobalAdmin = user?.role === "admin";
  const [allFiles, setAllFiles] = useState<CommunityFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ fileId: number | null; open: boolean }>({ fileId: null, open: false });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const filesPerPage = 10;

  useEffect(() => {
    fetchFiles();
  }, [communityId]);

  useEffect(() => {
    // Reset to page 1 when search changes
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      // Fetch all files for search functionality
      const data = await communityApi.getFiles(communityId, {
        limit: 1000, // Fetch a large number to enable search
        offset: 0,
      });
      setAllFiles(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const processFile = async (file: File) => {
    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
      "application/vnd.ms-powerpoint", // PPT
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/msword", // DOC
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload PDF, PowerPoint, or Word documents only");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      
      await communityApi.uploadFile(communityId, file, (progress) => {
        setUploadProgress(progress);
      });
      
      toast.success("File uploaded successfully");
      setUploadProgress(0);
      fetchFiles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload file");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDeleteFile = async () => {
    if (!deleteConfirm.fileId) return;

    try {
      await communityApi.deleteFile(deleteConfirm.fileId);
      toast.success("File deleted successfully");
      setDeleteConfirm({ fileId: null, open: false });
      fetchFiles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete file");
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);

    if (days < 1) return "Today";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "📄";
    if (["ppt", "pptx"].includes(ext || "")) return "📊";
    if (["doc", "docx"].includes(ext || "")) return "📝";
    return "📎";
  };

  const handleFileClick = (file: CommunityFile) => {
    if (file.fileName.toLowerCase().endsWith(".pdf")) {
      // Open PDF in full page
      window.open(file.url || file.filePath, "_blank");
    } else {
      // For non-PDF files, download
      const link = document.createElement("a");
      link.href = file.url || file.filePath;
      link.download = file.fileName;
      link.click();
    }
  };

  // Filter files based on search query
  const filteredFiles = allFiles.filter((file) =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate filtered files
  const totalFiltered = filteredFiles.length;
  const totalPagesFiltered = Math.ceil(totalFiltered / filesPerPage);
  const startIndex = (currentPage - 1) * filesPerPage;
  const endIndex = startIndex + filesPerPage;
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      {isMember && isAuthenticated && (
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`bg-surface-light dark:bg-surface-dark rounded-xl border-2 border-dashed p-4 md:p-5 shadow-sm transition-all ${
            isDragging
              ? "border-primary bg-primary/5 dark:bg-primary/10"
              : "border-slate-200 dark:border-slate-800"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Upload files</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Share PDFs, PowerPoint presentations, or Word documents
                {isDragging && <span className="text-primary font-bold"> - Drop file here</span>}
              </p>
              {uploading && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Uploading...</span>
                    <span className="text-xs font-bold text-primary">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg cursor-pointer transition-colors disabled:opacity-50 whitespace-nowrap">
              <UploadCloud className="h-4 w-4" />
              <span className="hidden sm:inline">{uploading ? "Uploading..." : "Upload"}</span>
              <span className="sm:hidden">{uploading ? "..." : "Upload"}</span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.ppt,.pptx,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading files...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          {searchQuery ? "No files found matching your search" : "No files uploaded yet"}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                      {getFileIcon(file.fileName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{file.fileName}</p>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {formatFileSize(file.fileSize)} • {formatTime(file.createdAt || file.uploadedAt || '')}
                        {(file.uploaderName || file.uploadedByName) && ` • by ${file.uploaderName || file.uploadedByName}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                    <a
                      href={file.url || file.filePath}
                      download={file.fileName}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 sm:px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                    {(isMember || isGlobalAdmin) && (
                      <Tooltip content="Delete file">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm({ fileId: file.id, open: true });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPagesFiltered > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-sm font-bold text-slate-900 dark:text-white">
                Page {currentPage} of {totalPagesFiltered}
                {searchQuery && ` (${totalFiltered} found)`}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPagesFiltered, prev + 1))}
                disabled={currentPage === totalPagesFiltered}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ModalDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ fileId: null, open: false })}
        title="Delete File"
        width="md"
        clickOutside={false}
      >
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to delete this file? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteConfirm({ fileId: null, open: false })}
              className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                handleDeleteFile();
                setDeleteConfirm({ fileId: null, open: false });
              }}
              className="px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
