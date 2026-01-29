"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Heart, MessageCircle, Trash2 } from "lucide-react";
import { commentApi, Comment } from "@/lib/api/comments";
import { useAuth } from "@/contexts/AuthContext";
import ModalDialog from "@/components/ModalDialog";
import toast from "react-hot-toast";

interface CommentsSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: number;
  postId?: number;
  commentsCount?: number;
  videoOwnerId?: number;
  onVideoCommentsDelta?: (videoId: number, delta: number) => void;
}

export default function CommentsSidePanel({
  isOpen,
  onClose,
  videoId,
  postId,
  commentsCount = 0,
  videoOwnerId,
  onVideoCommentsDelta,
}: CommentsSidePanelProps) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ commentId: number | null; open: boolean }>({ commentId: null, open: false });
  const panelRef = useRef<HTMLDivElement>(null);

  const emitVideoCommentsDelta = (videoId: number, delta: number) => {
    onVideoCommentsDelta?.(videoId, delta);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("videoCommentsDelta", { detail: { videoId, delta } })
      );
    }
  };

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
      emitVideoCommentsDelta(videoId, 1);
      toast.success("Comment posted!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post comment");
    }
  };

  const handleSubmitReply = async (parentCommentId: number) => {
    if (!replyText.trim() || !videoId || !isAuthenticated) return;

    try {
      const reply = await commentApi.createComment(videoId, replyText, parentCommentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentCommentId
            ? { ...c, replies: [...(c.replies || []), reply] }
            : c
        )
      );
      setReplyText("");
      setReplyingToId(null);
      emitVideoCommentsDelta(videoId, 1);
      toast.success("Reply posted!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post reply");
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

  const handleDeleteComment = async () => {
    if (!videoId || !isAuthenticated || !deleteConfirm.commentId) return;

    try {
      await commentApi.deleteComment(videoId, deleteConfirm.commentId);
      // Count how many comments will be removed from the video's comments_count (comment + its replies)
      const countToRemove = (() => {
        const findCount = (items: Comment[]): number => {
          for (const c of items) {
            if (c.id === deleteConfirm.commentId) return 1 + (c.replies?.length || 0);
            const nested = c.replies ? findCount(c.replies) : 0;
            if (nested) return nested;
          }
          return 0;
        };
        return findCount(comments) || 1;
      })();

      setComments((prev) => {
        const removeFromComments = (comments: Comment[]): Comment[] => {
          return comments
            .filter((c) => c.id !== deleteConfirm.commentId)
            .map((c) => ({
              ...c,
              replies: c.replies ? removeFromComments(c.replies) : undefined,
            }));
        };
        return removeFromComments(prev);
      });
      emitVideoCommentsDelta(videoId, -countToRemove);
      setDeleteConfirm({ commentId: null, open: false });
      toast.success("Comment deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
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
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      liked={likedComments.has(comment.id)}
                      onLike={() => handleLikeComment(comment.id)}
                      onReply={() => {
                        setReplyingToId(comment.id);
                        setReplyText("");
                      }}
                      isReplying={replyingToId === comment.id}
                      replyText={replyText}
                      onReplyTextChange={setReplyText}
                      onSubmitReply={() => handleSubmitReply(comment.id)}
                      onCancelReply={() => {
                        setReplyingToId(null);
                        setReplyText("");
                      }}
                      likedComments={likedComments}
                      onLikeAny={(id) => handleLikeComment(id)}
                      onDelete={() => setDeleteConfirm({ commentId: comment.id, open: true })}
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

      {/* Delete Confirmation Modal */}
      <ModalDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ commentId: null, open: false })}
        title="Delete Comment"
        width="md"
      >
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to delete this comment? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirm({ commentId: null, open: false });
              }}
              className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteComment();
              }}
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

function CommentItem({
  comment,
  liked,
  onLike,
  onReply,
  isReplying,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  onCancelReply,
  likedComments,
  onLikeAny,
  onDelete,
  canDelete,
}: {
  comment: Comment;
  liked: boolean;
  onLike: () => void;
  onReply: () => void;
  isReplying: boolean;
  replyText: string;
  onReplyTextChange: (v: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  likedComments: Set<number>;
  onLikeAny: (commentId: number) => void;
  onDelete?: () => void;
  canDelete?: boolean;
}) {
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const replies = comment.replies || [];
  const visibleReplies = repliesExpanded ? replies : replies.slice(0, 2);

  const authorName = comment.author ?? "Unknown";
  const initial = authorName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
          {comment.authorPhoto ? (
            <img src={comment.authorPhoto} alt={authorName} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {authorName}
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
            <button
              onClick={onReply}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary"
            >
              Reply
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

          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => onReplyTextChange(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSubmitReply();
                      }
                    }}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                  />
                  <button
                    onClick={onSubmitReply}
                    disabled={!replyText.trim()}
                    className="px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onCancelReply}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-11 space-y-2">
          {replies.length > 2 && (
            <button
              onClick={() => setRepliesExpanded((v) => !v)}
              className="text-xs text-slate-600 dark:text-slate-300 hover:text-primary"
            >
              {repliesExpanded ? "Hide replies" : `View ${replies.length} replies`}
            </button>
          )}

          <AnimatePresence initial={false}>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                {visibleReplies.map((reply, replyIndex) => {
                  const replyName = reply.author ?? "Unknown";
                  const replyInitial = replyName.trim().charAt(0).toUpperCase() || "?";
                  return (
                  <div key={reply.id ?? `reply-${replyIndex}`} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs flex-shrink-0 overflow-hidden">
                      {reply.authorPhoto ? (
                        <img src={reply.authorPhoto} alt={replyName} className="w-full h-full object-cover" />
                      ) : (
                        replyInitial
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {replyName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {reply.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mb-1">
                        {reply.content}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onLikeAny(reply.id)}
                          className={`text-xs transition-colors flex items-center gap-1 ${
                            likedComments.has(reply.id)
                              ? "text-red-500"
                              : "text-slate-500 dark:text-slate-400 hover:text-red-500"
                          }`}
                        >
                          <Heart className={`h-3 w-3 ${likedComments.has(reply.id) ? "fill-current" : ""}`} />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

