"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import ModalDialog from "@/components/ModalDialog";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Trash2, Edit2, Users, MoreVertical, LogOut } from "lucide-react";
import { communityApi, Community } from "@/lib/api/communities";
import toast from "react-hot-toast";
import PostsSection from "./components/PostsSection";
import FilesSection from "./components/FilesSection";
import MembersSection from "./components/MembersSection";
import ButtonDropdown from "@/components/ButtonDropdown";

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "files" | "members">("posts");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

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

  const isOwner = community?.ownerId === user?.id || community?.userRole === "owner";
  const isMember = community?.isMember || isOwner;
  const isGlobalAdmin = user?.role === "admin";

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

  const handleLeave = async () => {
    try {
      await communityApi.leaveCommunity(communityId);
      toast.success("You have left the community");
      router.push("/community");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to leave community");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex items-center justify-center flex-1">
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

      <main className="flex-1 pb-20 overflow-y-auto md:pb-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-4 transition-colors text-slate-600 dark:text-slate-400 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Communities</span>
            </button>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {community.name}
                  </h1>
                  <div className="flex items-center gap-2">
                  <div className="flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        {/* <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Members</p> */}
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {community.memberCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {community.description || "No description available"}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
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
              {(isOwner || isMember || isGlobalAdmin) && (
                <ButtonDropdown
                  buttonContent={
                    <>
                      <MoreVertical className="w-4 h-4" />
                      <span className="hidden sm:inline">Actions</span>
                    </>
                  }
                  buttonClassName="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg bg-white hover:bg-slate-200 text-slate-900"
                  options={
                    (isOwner || isGlobalAdmin)
                      ? [
                          {
                            label: "Edit Community",
                            value: "edit",
                            icon: Edit2,
                            onClick: () => setEditModalOpen(true),
                          },
                          {
                            label: "Delete Community",
                            value: "delete",
                            icon: Trash2,
                            danger: true,
                            onClick: () => setDeleteModalOpen(true),
                          },
                        ]
                      : [
                          {
                            label: "Exit Community",
                            value: "leave",
                            icon: LogOut,
                            danger: true,
                            onClick: () => setLeaveModalOpen(true),
                          },
                        ]
                  }
                />
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "posts" && (
              <PostsSection communityId={communityId} isMember={isMember || false} isOwner={isOwner} />
            )}

            {activeTab === "files" && (
              <FilesSection communityId={communityId} isMember={isMember || false} />
            )}

            {activeTab === "members" && (
              <MembersSection communityId={communityId} isOwner={isOwner} />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 pb-safe">
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
            <label className="block mb-2 text-sm font-semibold text-slate-900 dark:text-white">
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
            <label className="block mb-2 text-sm font-semibold text-slate-900 dark:text-white">
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
              className="px-4 py-2 transition-colors rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
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
        clickOutside={false}
      >
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to delete this community? This action cannot be undone. All members will be removed.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 transition-colors rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </ModalDialog>

      {/* Leave Community Confirmation Modal */}
      <ModalDialog
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        title="Leave Community"
        width="md"
        clickOutside={false}
      >
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to leave this community? You will need to be invited again to rejoin.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setLeaveModalOpen(false)}
              className="px-4 py-2 transition-colors rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLeave}
              className="px-4 py-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
            >
              Leave
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
