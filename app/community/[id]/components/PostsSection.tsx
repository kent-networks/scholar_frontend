"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquareText, Heart, Plus, Trash2, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { communityApi } from "@/lib/api/communities";
import ModalDialog from "@/components/ModalDialog";
import toast from "react-hot-toast";

interface Post {
  id: number;
  userId: number;
  userName: string;
  userPhoto?: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked: boolean;
}

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

interface PostsSectionProps {
  communityId: number;
  isMember: boolean;
  isOwner: boolean;
}

export default function PostsSection({ communityId, isMember, isOwner }: PostsSectionProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [communityId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await communityApi.getCommunityPosts(communityId);
      setPosts(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const data = await communityApi.getCommunityComments(postId);
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load comments");
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      setPosting(true);
      await communityApi.createCommunityPost(communityId, newPostContent);
      toast.success("Post created successfully");
      setNewPostContent("");
      setShowCreatePost(false);
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      // Optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
            : p
        )
      );

      if (post.isLiked) {
        await communityApi.unlikeCommunityPost(postId);
      } else {
        await communityApi.likeCommunityPost(postId);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to like post");
      fetchPosts();
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!newComment.trim()) return;

    try {
      setCommenting(true);
      await communityApi.createCommunityComment(postId, newComment);
      toast.success("Comment added");
      setNewComment("");
      fetchComments(postId);
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      await communityApi.deleteCommunityComment(commentId);
      toast.success("Comment deleted");
      fetchComments(postId);
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      const postId = Object.keys(comments).find((pid) =>
        comments[parseInt(pid)].some((c) => c.id === commentId)
      );
      if (!postId) return;

      const comment = comments[parseInt(postId)].find((c) => c.id === commentId);
      if (!comment) return;

      // Optimistic update
      setComments((prev) => ({
        ...prev,
        [parseInt(postId)]: prev[parseInt(postId)].map((c) =>
          c.id === commentId
            ? { ...c, isLiked: !c.isLiked, likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1 }
            : c
        ),
      }));

      if (comment.isLiked) {
        await communityApi.unlikeCommunityComment(commentId);
      } else {
        await communityApi.likeCommunityComment(commentId);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to like comment");
      const postId = Object.keys(comments).find((pid) =>
        comments[parseInt(pid)].some((c) => c.id === commentId)
      );
      if (postId) fetchComments(parseInt(postId));
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
    <div className="space-y-4">
      {isMember && (
        <button
          onClick={() => setShowCreatePost(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </button>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">No posts yet</div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              {post.userPhoto ? (
                <img
                  src={post.userPhoto}
                  alt={post.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {post.userName.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{post.userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatTime(post.createdAt)}</p>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mb-4">{post.content}</p>
            <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
              <button
                onClick={() => handleLikePost(post.id)}
                className={`flex items-center gap-1 hover:text-primary transition-colors ${
                  post.isLiked ? "text-red-500" : ""
                }`}
              >
                <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                <span className="text-sm font-bold">{post.likesCount}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedPost(post.id);
                  if (!comments[post.id]) {
                    fetchComments(post.id);
                  }
                }}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <MessageSquareText className="h-4 w-4" />
                <span className="text-sm font-bold">{post.commentsCount}</span>
              </button>
            </div>

            {selectedPost === post.id && comments[post.id] && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                {comments[post.id].map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    {comment.userPhoto ? (
                      <img
                        src={comment.userPhoto}
                        alt={comment.userName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {comment.userName.charAt(0)}
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
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                            className="ml-auto text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">{comment.content}</p>
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1 text-xs hover:text-primary transition-colors ${
                          comment.isLiked ? "text-red-500" : "text-slate-500"
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${comment.isLiked ? "fill-current" : ""}`} />
                        <span>{comment.likesCount}</span>
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(post.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={!newComment.trim() || commenting}
                    className="px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <ModalDialog
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        title="Create Post"
        width="md"
      >
        <div className="space-y-4">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={6}
            placeholder="What's on your mind?"
            className="w-full p-4 text-base font-normal leading-normal transition-all bg-white border resize-none rounded-xl border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white dark:bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setShowCreatePost(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePost}
              disabled={!newPostContent.trim() || posting}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}

