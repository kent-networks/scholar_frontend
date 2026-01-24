"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Heart, MessageCircle, Trash2 } from "lucide-react";
import { communityApi } from "@/lib/api/communities";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import ModalDialog from "@/components/ModalDialog";

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userPhoto?: string;
  content: string;
  likesCount: number;
  createdAt: string;
  isLiked: boolean;
}

interface CommunityCommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  commentsCount: number;
  isOwner: boolean;
  onCommentsUpdate?: () => void;
}

export default function CommunityCommentsPanel({
  isOpen,
  onClose,
  postId,
  commentsCount,
  isOwner,
  onCommentsUpdate,
}: CommunityCommentsPanelProps) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ commentId: number | null; open: boolean }>({ commentId: null, open: false });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);

  const fetchComments = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const fetchedComments = await communityApi.getCommunityComments(postId);
      setComments(fetchedComments);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !postId || !isAuthenticated) {
      if (!isAuthenticated) {
        toast.error("Please login to comment");
      }
      return;
    }

    try {
      setCommenting(true);
      await communityApi.createCommunityComment(postId, newComment);
      setNewComment("");
      fetchComments();
      onCommentsUpdate?.();
      toast.success("Comment posted!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post comment");
    } finally {
      setCommenting(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to like comments");
      return;
    }

    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;

      // Optimistic update
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, isLiked: !c.isLiked, likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1 }
            : c
        )
      );

      if (comment.isLiked) {
        await communityApi.unlikeCommunityComment(commentId);
      } else {
        await communityApi.likeCommunityComment(commentId);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to like comment");
      fetchComments();
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteConfirm.commentId) return;
    try {
      await communityApi.deleteCommunityComment(deleteConfirm.commentId);
      setComments((prev) => prev.filter((c) => c.id !== deleteConfirm.commentId));
      setDeleteConfirm({ commentId: null, open: false });
      onCommentsUpdate?.();
      toast.success("Comment deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed -inset-4  bg-black/50 z-[100]"
              onClick={onClose}
            />

            {/* Side Panel */}
            <motion.div
              ref={panelRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 -top-4 bottom-0 w-full md:w-[400px] bg-white dark:bg-slate-800 z-[100] shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Comments ({commentsCount || comments.length})
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 rounded-full border-primary/30 border-t-primary animate-spin mx-auto" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      {comment.userPhoto ? (
                        <img
                          src={comment.userPhoto}
                          alt={comment.userName}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {comment.userName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {comment.userName}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatTime(comment.createdAt)}
                          </span>
                          {(comment.userId === user?.id || isOwner) && (
                            <button
                              onClick={() => setDeleteConfirm({ commentId: comment.id, open: true })}
                              className="ml-auto text-red-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                          {comment.content}
                        </p>
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            comment.isLiked
                              ? "text-red-500"
                              : "text-slate-500 dark:text-slate-400 hover:text-red-500"
                          }`}
                        >
                          <Heart className={`h-3 w-3 ${comment.isLiked ? "fill-current" : ""}`} />
                          <span>{comment.likesCount}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              {isAuthenticated ? (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitComment();
                        }
                      }}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || commenting}
                      className="p-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Please login to comment
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ModalDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ commentId: null, open: false })}
        title="Delete Comment"
        width="md"
        clickOutside={false}
      >
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to delete this comment? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteConfirm({ commentId: null, open: false })}
              className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteComment}
              className="px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </ModalDialog>
    </>
  );
}

