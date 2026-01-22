"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Heart, MessageCircle, Trash2 } from "lucide-react";
import { commentApi, Comment } from "@/lib/api/comments";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface CommentsSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: number;
  postId?: number;
  commentsCount?: number;
  videoOwnerId?: number;
}

export default function CommentsSidePanel({
  isOpen,
  onClose,
  videoId,
  postId,
  commentsCount = 0,
  videoOwnerId,
}: CommentsSidePanelProps) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch comments when panel opens
  useEffect(() => {
    if (isOpen && videoId) {
      fetchComments();
    }
  }, [isOpen, videoId]);

  const fetchComments = async () => {
    if (!videoId) return;
    setLoading(true);
    try {
      const fetchedComments = await commentApi.getComments(videoId);
      setComments(fetchedComments);
      // Update liked comments set
      const likedSet = new Set<number>();
      fetchedComments.forEach((comment) => {
        if (comment.liked) likedSet.add(comment.id);
        comment.replies?.forEach((reply) => {
          if (reply.liked) likedSet.add(reply.id);
        });
      });
      setLikedComments(likedSet);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !videoId || !isAuthenticated) {
      if (!isAuthenticated) {
        toast.error("Please login to comment");
      }
      return;
    }

    try {
      const comment = await commentApi.createComment(videoId, newComment);
      setComments([comment, ...comments]);
      setNewComment("");
      toast.success("Comment posted!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post comment");
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to like comments");
      return;
    }

    const wasLiked = likedComments.has(commentId);
    
    // Optimistic update
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (wasLiked) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
            liked: !wasLiked,
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: wasLiked ? reply.likes - 1 : reply.likes + 1,
                  liked: !wasLiked,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );

    try {
      await commentApi.likeComment(commentId);
    } catch (error: any) {
      // Revert on error
      setLikedComments((prev) => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(commentId);
        } else {
          newSet.delete(commentId);
        }
        return newSet;
      });
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: wasLiked ? comment.likes + 1 : comment.likes - 1,
              liked: wasLiked,
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    likes: wasLiked ? reply.likes + 1 : reply.likes - 1,
                    liked: wasLiked,
                  };
                }
                return reply;
              }),
            };
          }
          return comment;
        })
      );
      toast.error(error.response?.data?.message || "Failed to like comment");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!videoId || !isAuthenticated) return;

    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await commentApi.deleteComment(videoId, commentId);
      setComments((prev) => {
        const removeFromComments = (comments: Comment[]): Comment[] => {
          return comments
            .filter((c) => c.id !== commentId)
            .map((c) => ({
              ...c,
              replies: c.replies ? removeFromComments(c.replies) : undefined,
            }));
        };
        return removeFromComments(prev);
      });
      toast.success("Comment deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Side Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-white dark:bg-slate-800 z-50 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Comments ({comments.length})
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
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    liked={likedComments.has(comment.id)}
                    onLike={() => handleLikeComment(comment.id)}
                    onDelete={() => handleDeleteComment(comment.id)}
                    canDelete={isAuthenticated && (user?.id === comment.userId || user?.id === videoOwnerId)}
                  />
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
                    disabled={!newComment.trim()}
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
  );
}

function CommentItem({
  comment,
  liked,
  onLike,
  onDelete,
  canDelete,
}: {
  comment: Comment;
  liked: boolean;
  onLike: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {comment.author.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {comment.author}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {comment.date}
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
            {comment.content}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={onLike}
              className={`flex items-center gap-1 text-xs transition-colors ${
                liked
                  ? "text-red-500"
                  : "text-slate-500 dark:text-slate-400 hover:text-red-500"
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              <span>{comment.likes}</span>
            </button>
            {canDelete && onDelete && (
              <button
                onClick={onDelete}
                className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs flex-shrink-0">
                {reply.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {reply.author}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {reply.date}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mb-1">
                  {reply.content}
                </p>
                <div className="flex items-center gap-3">
                  <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{reply.likes}</span>
                  </button>
                  <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

