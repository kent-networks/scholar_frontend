"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Trash2, Pencil, MoreVertical } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/lib/api/users";
import { uploadApi } from "@/lib/api/upload";
import toast from "react-hot-toast";
import Tooltip from "@/components/Tooltip";
import ButtonDropdown from "@/components/ButtonDropdown";
import ModalDialog from "@/components/ModalDialog";

interface ProfileCardProps {
  profilePhoto: string | null;
  setProfilePhoto: (photo: string | null) => void;
  bio: string;
  setBio: (bio: string) => void;
  profileStats: { followers: number; following: number; likes: number };
  refreshUser: () => Promise<void>;
}

export default function ProfileCard({
  profilePhoto,
  setProfilePhoto,
  bio,
  setBio,
  profileStats,
  refreshUser,
}: ProfileCardProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editEmail, setEditEmail] = useState(user?.email ?? "");
  const [deletePhotoConfirm, setDeletePhotoConfirm] = useState(false);

  useEffect(() => {
    if (!editingProfile && user) {
      setEditName(user.name ?? "");
      setEditEmail(user.email ?? "");
    }
  }, [user?.name, user?.email, editingProfile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadingPhoto(true);
      const result = await uploadApi.uploadProfilePhoto(file);
      setProfilePhoto(result.data.url || result.data.path);
      await refreshUser?.();
      toast.success("Profile photo updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await userApi.deleteProfilePhoto();
      setProfilePhoto(null);
      setDeletePhotoConfirm(false);
      await refreshUser?.();
      toast.success("Profile photo deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete photo");
    }
  };

  const handleBioSave = async () => {
    try {
      await userApi.updateBio(bio);
      setEditingBio(false);
      toast.success("Bio updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update bio");
    }
  };

  const handleProfileSave = async () => {
    try {
      await userApi.updateProfile({
        name: editName?.trim() || undefined,
        email: editEmail?.trim() || undefined,
      });
      if (bio !== (user?.bio ?? "")) await userApi.updateBio(bio);
      setEditingProfile(false);
      await refreshUser?.();
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const startEditingProfile = () => {
    setEditName(user?.name ?? "");
    setEditEmail(user?.email ?? "");
    setEditingProfile(true);
  };

  const cancelEditingProfile = () => {
    setEditingProfile(false);
    setEditName(user?.name ?? "");
    setEditEmail(user?.email ?? "");
  };

  if (!user) return null;

  return (
    <>
      <div className="p-8 mb-8 bg-white border shadow-md rounded-2xl border-primary/20">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          {/* Profile Photo with Edit/Delete */}
          <div className="relative group">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={user.name}
                className="object-cover w-32 h-32 border-4 border-white rounded-full shadow-xl dark:border-slate-800"
              />
            ) : (
              <div className="flex items-center justify-center w-32 h-32 text-4xl font-bold text-white border-4 border-white rounded-full shadow-xl bg-primary dark:border-slate-800">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 transition-opacity rounded-full opacity-0 bg-black/50 group-hover:opacity-100">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="p-2 text-white transition-colors rounded-full bg-primary hover:bg-primary-dark disabled:opacity-50"
                title="Upload photo"
              >
                <Camera className="w-4 h-4" strokeWidth={1.5}/>
              </button>
              {profilePhoto && (
                <>
                  <Tooltip content="Delete photo">
                    <button
                      onClick={() => setDeletePhotoConfirm(true)}
                      className="hidden p-2 text-white transition-colors bg-red-500 rounded-full md:block hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5}/>
                    </button>
                  </Tooltip>
                  <ButtonDropdown
                    buttonContent={<MoreVertical className="w-5 h-5 text-white" strokeWidth={1.5}/>}
                    buttonClassName="md:hidden p-2 text-white transition-colors bg-black/50 rounded-full hover:bg-black/70"
                    options={[
                      {
                        label: "Delete photo",
                        value: "delete",
                        icon: Trash2,
                        danger: true,
                        onClick: () => setDeletePhotoConfirm(true),
                      },
                    ]}
                  />
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            {editingProfile ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleProfileSave}
                    className="px-4 py-2 text-sm font-bold text-white rounded-lg bg-primary hover:bg-primary-dark"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditingProfile}
                    className="px-4 py-2 text-sm font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-2 md:justify-start">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </h2>
                  <Tooltip content="Edit name, email & bio">
                    <button
                      onClick={startEditingProfile}
                      className="p-2 text-white transition-colors rounded-full bg-primary hover:bg-primary/90"
                      title="Edit profile"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
                <p className="mb-1 text-slate-600 dark:text-slate-400">{user.role}</p>
                <p className="mb-4 text-sm text-slate-500 dark:text-slate-500">{user.email}</p>

                {/* Bio Section */}
                {/* <div className="mb-4">
                  {editingBio ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleBioSave}
                          className="px-4 py-1 text-sm font-bold text-white rounded-lg bg-primary hover:bg-primary-dark"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingBio(false);
                            setBio(user.bio || "");
                          }}
                          className="px-4 py-1 text-sm font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                        {bio || "No bio yet. Click edit to add one."}
                      </p>
                      <Tooltip content="Edit bio only">
                        <button
                          onClick={() => setEditingBio(true)}
                          className="p-2 text-white transition-colors rounded-full bg-primary hover:bg-primary/90"
                          title="Edit bio"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  )}
                </div> */}
              </>
            )}

            {!editingProfile && (
              <>
                {/* Stats */}
                <div className="flex justify-center gap-6 mb-4 md:justify-start">
                  <div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{profileStats.followers.toLocaleString()}</span>
                    <span className="ml-1 text-slate-600 dark:text-slate-400">Followers</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{profileStats.following}</span>
                    <span className="ml-1 text-slate-600 dark:text-slate-400">Following</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{profileStats.likes.toLocaleString()}</span>
                    <span className="ml-1 text-slate-600 dark:text-slate-400">Likes</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 md:justify-start">
                  <Link
                    href={`/profile/${user.username}`}
                    className="px-6 py-2 text-white transition-colors border rounded-lg bg-primary hover:bg-primary/90"
                  >
                    View Profile
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Photo Confirmation Modal */}
      <ModalDialog
        isOpen={deletePhotoConfirm}
        onClose={() => setDeletePhotoConfirm(false)}
        title="Delete Photo"
        width="md"
      >
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to delete your profile photo? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDeletePhotoConfirm(false);
              }}
              className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePhoto();
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