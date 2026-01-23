"use client";

import { useState, useEffect } from "react";
import { FileText, UploadCloud, Download, X, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { communityApi } from "@/lib/api/communities";
import ModalDialog from "@/components/ModalDialog";
import toast from "react-hot-toast";

interface CommunityFile {
  id: number;
  fileName: string;
  filePath: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt: string;
  uploadedBy?: number;
  uploadedByName?: string;
}

interface FilesSectionProps {
  communityId: number;
  isMember: boolean;
}

export default function FilesSection({ communityId, isMember }: FilesSectionProps) {
  const { isAuthenticated } = useAuth();
  const [files, setFiles] = useState<CommunityFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<CommunityFile | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [communityId]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await communityApi.getCommunityFiles(communityId);
      setFiles(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      await communityApi.uploadCommunityFile(communityId, file);
      toast.success("File uploaded successfully");
      fetchFiles();
      if (e.target) {
        e.target.value = "";
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await communityApi.deleteCommunityFile(fileId);
      toast.success("File deleted successfully");
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
    const date = new Date(dateString);
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

  const handleViewFile = (file: CommunityFile) => {
    setSelectedFile(file);
    setViewerOpen(true);
  };

  return (
    <div className="space-y-4">
      {isMember && isAuthenticated && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Upload files</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Share PDFs, PowerPoint presentations, or Word documents
              </p>
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg cursor-pointer transition-colors disabled:opacity-50">
              <UploadCloud className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload"}
              <input
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

      {loading ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">No files uploaded yet</div>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                  {getFileIcon(file.fileName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{file.fileName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatFileSize(file.fileSize)} • {formatTime(file.uploadedAt)}
                    {file.uploadedByName && ` • by ${file.uploadedByName}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewFile(file)}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <a
                  href={file.filePath}
                  download
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                {isMember && (
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      <ModalDialog
        isOpen={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setSelectedFile(null);
        }}
        title={selectedFile?.fileName || "File Viewer"}
        width="xl"
      >
        {selectedFile && (
          <div className="w-full h-[80vh]">
            {selectedFile.fileName.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={selectedFile.filePath}
                className="w-full h-full border-0 rounded-lg"
                title={selectedFile.fileName}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Preview not available for this file type
                  </p>
                  <a
                    href={selectedFile.filePath}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download to view
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </ModalDialog>
    </div>
  );
}

