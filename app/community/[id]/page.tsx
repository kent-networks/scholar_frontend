"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import ModalDialog from "@/components/ModalDialog";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, FileText, Inbox, MessageSquareText, UploadCloud, MessageCircle, Heart, Settings, Trash2, Edit2, Users } from "lucide-react";
import { communityApi, Community, CommunityMember } from "@/lib/api/communities";
import toast from "react-hot-toast";

const mockPosts = [
  {
    id: 1,
    author: "Dr. Sarah Chen",
    content: "Excited to share our latest research findings on quantum algorithms!",
    date: "2 hours ago",
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    author: "Prof. Michael Johnson",
    content: "Looking for collaborators for a new environmental research project.",
    date: "5 hours ago",
    likes: 18,
    comments: 12,
  },
];

const mockFiles = [
  { id: 1, name: "Research_Paper_2024.pdf", size: "2.4 MB", date: "3 days ago" },
  { id: 2, name: "Data_Analysis_Results.xlsx", size: "1.8 MB", date: "1 week ago" },
  { id: 3, name: "Presentation_Slides.pptx", size: "5.2 MB", date: "2 weeks ago" },
];

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "files" | "members">("posts");
  const [files, setFiles] = useState(mockFiles);
  const [commentOpen, setCommentOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [membersOffset, setMembersOffset] = useState(0);
  const [hasMoreMembers, setHasMoreMembers] = useState(true);

  const communityId = parseInt(params.id as string);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        const data = await communityApi.getCommunityById(communityId);
        setCommunity(data);
        setEditForm({ name: data.name, description: data.description || "" });
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load community");
        router.push("/community");
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchCommunity();
    }
  }, [communityId, router]);

  useEffect(() => {
    if (activeTab === "members" && communityId) {
      fetchMembers(true);
    }
  }, [activeTab, communityId]);

  const fetchMembers = async (reset = false) => {
    try {
      setMembersLoading(true);
      const currentOffset = reset ? 0 : membersOffset;
      const result = await communityApi.getCommunityMembers(communityId, { limit: 50, offset: currentOffset });
      
      if (reset) {
        setMembers(result.data);
      } else {
        setMembers((prev) => [...prev, ...result.data]);
      }
      setHasMoreMembers(result.pagination.hasMore);
      setMembersOffset(result.pagination.offset + result.data.length);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load members");
    } finally {
      setMembersLoading(false);
    }
  };

  const isOwner = community?.ownerId === user?.id || community?.userRole === "owner";

  const handleUpdate = async () => {
    try {
      await communityApi.updateCommunity(communityId, editForm);
      toast.success("Community updated successfully");
      setEditModalOpen(false);
      const updated = await communityApi.getCommunityById(communityId);
      setCommunity(updated);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update community");
    }
  };

  const handleDelete = async () => {
    try {
      await communityApi.deleteCommunity(communityId);
      toast.success("Community deleted successfully");
      router.push("/community");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete community");
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    // TODO: Implement like logic
  };

  const handleComment = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setCommentOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-slate-500 dark:text-slate-400">Loading community...</div>
        </main>
      </div>
    );
  }

  if (!community) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto md:pb-0 pb-20">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Communities</span>
            </button>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {community.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {community.description || "No description available"}
                </p>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 px-1 transition-colors ${
                  activeTab === "posts"
                    ? "border-primary text-slate-900 dark:text-white"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <p className="text-sm font-bold">Posts</p>
              </button>
              <button
                onClick={() => setActiveTab("files")}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 px-1 transition-colors ${
                  activeTab === "files"
                    ? "border-primary text-slate-900 dark:text-white"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <p className="text-sm font-bold">Files</p>
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 px-1 transition-colors ${
                  activeTab === "members"
                    ? "border-primary text-slate-900 dark:text-white"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <p className="text-sm font-bold">Members</p>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === "posts" && (
                <div className="space-y-4">
                  {mockPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          {post.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{post.author}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{post.date}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 mb-4">{post.content}</p>
                      <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <button onClick={handleLike} className="flex items-center gap-1 hover:text-primary">
                          <span className="text-sm font-bold">{post.likes}</span>
                          <span>Likes</span>
                        </button>
                        <button
                          onClick={handleComment}
                          className="flex items-center gap-2 hover:text-primary"
                        >
                          <MessageSquareText className="h-4 w-4" />
                          <span className="text-sm font-bold">{post.comments}</span>
                          <span>Comments</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "files" && (
                <div className="space-y-4">
                  {isAuthenticated && (
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">Upload files</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Share PDFs, datasets, slides (mock upload).
                          </p>
                        </div>
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg cursor-pointer transition-colors">
                          <UploadCloud className="h-4 w-4" />
                          Upload
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              setFiles((prev) => [
                                {
                                  id: Date.now(),
                                  name: f.name,
                                  size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
                                  date: "just now",
                                },
                                ...prev,
                              ]);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{file.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {file.size} • {file.date}
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-lg transition-colors">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "members" && (
                <div className="space-y-4">
                  {membersLoading && members.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      Loading members...
                    </div>
                  ) : members.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      No members found
                    </div>
                  ) : (
                    <>
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            {member.photo ? (
                              <img
                                src={member.photo}
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                {member.name.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                @{member.username} • {member.role}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedMember(member.name);
                                setInboxOpen(true);
                              }}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light bg-surface-light hover:bg-slate-100 transition-colors font-bold text-slate-900"
                            >
                              <Inbox className="h-4 w-4" />
                              Inbox
                            </button>
                          </div>
                        </div>
                      ))}
                      {hasMoreMembers && (
                        <div className="flex justify-center pt-4">
                          <button
                            onClick={() => fetchMembers(false)}
                            disabled={membersLoading}
                            className="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            {membersLoading ? "Loading..." : "Load More"}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-slate-900 dark:text-white">Members</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {community.memberCount}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total members</p>
              </div>

              {isOwner && (
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">Owner Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setEditModalOpen(true)}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Community</span>
                    </button>
                    <button
                      onClick={() => setDeleteModalOpen(true)}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Community</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 z-50 shadow-lg pb-safe">
        <MobileBottomNav />
      </div>

      {/* Edit Modal */}
      <ModalDialog
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Community"
        width="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Community Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full h-12 px-4 text-base font-normal leading-normal transition-all bg-white border rounded-xl border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white dark:bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Community name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={4}
              className="w-full p-4 text-base font-normal leading-normal transition-all bg-white border resize-none rounded-xl border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white dark:bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Community description"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </ModalDialog>

      {/* Delete Confirmation Modal */}
      <ModalDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Community"
        width="md"
      >
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to delete this community? This action cannot be undone. All members will be removed.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </ModalDialog>

      <ModalDialog isOpen={commentOpen} onClose={() => setCommentOpen(false)} title="Comments" width="lg">
        <div className="space-y-4">
          {/* X-style Comments Thread */}
          <div className="space-y-4">
            {/* Comment 1 with replies */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Student A</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">@student_a</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">2h</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                    This is super interesting — can you share the dataset?
                  </p>
                  <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                    <button className="hover:text-primary transition-colors flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>3</span>
                    </button>
                    <button className="hover:text-red-500 transition-colors flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>12</span>
                    </button>
                    <button className="hover:text-primary transition-colors">Reply</button>
                  </div>
                </div>
              </div>
              
              {/* Replies */}
              <div className="ml-12 space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs flex-shrink-0">
                    O
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">Original Author</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">@original_author</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">1h</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">
                      Sure! I'll post a detailed methodology section soon.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <button className="hover:text-red-500 transition-colors flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>5</span>
                      </button>
                      <button className="hover:text-primary transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment 2 */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold flex-shrink-0">
                D
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Dr. B</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">@dr_b</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">3h</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Nice work. What's the next step?
                </p>
                <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                  <button className="hover:text-primary transition-colors flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>1</span>
                  </button>
                  <button className="hover:text-red-500 transition-colors flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>8</span>
                  </button>
                  <button className="hover:text-primary transition-colors">Reply</button>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                Y
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Post your reply"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-full transition-colors text-sm">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalDialog>

      <ModalDialog
        isOpen={inboxOpen}
        onClose={() => setInboxOpen(false)}
        title={selectedMember ? `Message ${selectedMember}` : "Message"}
        width="md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg border border-border-light bg-surface-light">
            <p className="text-sm text-slate-600">(Mock) Start a conversation.</p>
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-lg border border-border-light bg-surface-light focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors">
              Send
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
