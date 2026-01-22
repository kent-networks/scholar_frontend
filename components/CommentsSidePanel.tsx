"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Heart, MessageCircle } from "lucide-react";

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  likes: number;
  liked?: boolean;
  replies?: Comment[];
}

interface CommentsSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: number;
  postId?: number;
  commentsCount?: number;
}

const mockComments: Comment[] = [
  {
    id: 1,
    author: "Dr. Sarah Chen",
    content: "This is fascinating! Can you share more details about the methodology?",
    date: "2 hours ago",
    likes: 12,
    liked: false,
    replies: [
      {
        id: 11,
        author: "Original Author",
        content: "Sure! I'll post a detailed methodology section soon.",
        date: "1 hour ago",
        likes: 5,
      },
    ],
  },
  {
    id: 2,
    author: "Prof. Michael Johnson",
    content: "Great work! This aligns with our recent findings.",
    date: "3 hours ago",
    likes: 8,
    liked: true,
  },
  {
    id: 3,
    author: "Student Researcher",
    content: "Could you explain the implications of this research?",
    date: "5 hours ago",
    likes: 3,
  },
];

export default function CommentsSidePanel({
  isOpen,
  onClose,
  videoId,
  postId,
  commentsCount = 0,
}: CommentsSidePanelProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

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

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      author: "You", // In real app, get from auth
      content: newComment,
      date: "just now",
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleLikeComment = (commentId: number) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
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
            likes: likedComments.has(commentId)
              ? comment.likes - 1
              : comment.likes + 1,
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: likedComments.has(commentId)
                    ? reply.likes - 1
                    : reply.likes + 1,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );
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
              {comments.length === 0 ? (
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
                  />
                ))
              )}
            </div>

            {/* Comment Input */}
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
}: {
  comment: Comment;
  liked: boolean;
  onLike: () => void;
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
            <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary">
              Reply
            </button>
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

