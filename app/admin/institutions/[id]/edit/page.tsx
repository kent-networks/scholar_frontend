"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import {
  institutionsApi,
  Institution,
  AssignedUser,
} from "@/lib/api/institutions";
import { userAdminApi, AdminUser } from "@/lib/api/users-admin";
import { ArrowLeft, CheckCircle2, X, UserPlus } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3.5 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all disabled:opacity-60";

export default function EditInstitutionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const id = parseInt(params.id as string, 10);

  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [motto, setMotto] = useState("");
  const [saving, setSaving] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<AdminUser[]>([]);
  const [userResultsTotal, setUserResultsTotal] = useState(0);
  const [userResultsPage, setUserResultsPage] = useState(1);
  const userResultsLimit = 8;
  const [userResultsLoading, setUserResultsLoading] = useState(false);
  const [selectedUserToAssign, setSelectedUserToAssign] = useState<AdminUser | null>(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if ((user?.role || "") !== "admin") {
      router.push("/");
      return;
    }
  }, [authLoading, isAuthenticated, user?.role, router]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await institutionsApi.getById(id);
        if (cancelled) return;
        setInstitution(data);
        setName(data.name);
        setMotto(data.motto ?? "");
      } catch (e: any) {
        if (!cancelled) {
          toast.error(e?.response?.data?.message || "Failed to load institution");
          router.push("/admin?tab=institutions");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        setUserResultsLoading(true);
        const res = await userAdminApi.getUsers({
          search: userSearch.trim() || undefined,
          limit: userResultsLimit,
          offset: (userResultsPage - 1) * userResultsLimit,
        });
        if (cancelled) return;
        setUserResults(res.data);
        setUserResultsTotal(res.pagination.total);
      } catch (e: any) {
        if (!cancelled) toast.error(e?.response?.data?.message || "Failed to search users");
      } finally {
        if (!cancelled) setUserResultsLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [userSearch, userResultsPage]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await institutionsApi.update(id, { name: name.trim(), motto: motto.trim() || undefined });
      toast.success("Institution updated");
      setInstitution((prev) => (prev ? { ...prev, name: name.trim(), motto: motto.trim() || undefined } : null));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update institution");
    } finally {
      setSaving(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUserToAssign) return;
    try {
      setAssigning(true);
      await institutionsApi.assignUser(id, { userId: selectedUserToAssign.id });
      toast.success("User assigned");
      setSelectedUserToAssign(null);
      const updated = await institutionsApi.getById(id);
      setInstitution(updated);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to assign user");
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async (u: AssignedUser) => {
    try {
      await institutionsApi.unassignUser(id, u.id);
      toast.success("User unassigned");
      const updated = await institutionsApi.getById(id);
      setInstitution(updated);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to unassign user");
    }
  };

  if (loading || !institution) {
    return (
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex items-center justify-center flex-1">
          <div className="text-slate-500 dark:text-slate-400">Loading...</div>
        </main>
      </div>
    );
  }

  const assignedUsers = institution.assignedUsers ?? [];
  const assignedIds = new Set(assignedUsers.map((u) => u.id));

  return (
    <div className="flex h-[100svh] md:h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 pb-20 overflow-y-auto md:pb-0">
        <div className="max-w-3xl p-4 mx-auto md:p-8">
          <button
            type="button"
            onClick={() => router.push("/admin?tab=institutions")}
            className="flex items-center gap-2 mb-6 transition-colors text-slate-600 dark:text-slate-400 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5}/>
            Back to Institutions
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Edit institution</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Update details and manage assigned users.
            </p>
          </div>

          <div className="space-y-8">
            <div className="p-5 border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Details</h2>
              <div className="grid grid-cols-1 gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Institution name"
                  className={inputClass}
                />
                <input
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="Motto (optional)"
                  className={inputClass}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSave}
                    className="px-5 py-2.5 font-bold text-white rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Assigned users</h2>
              {assignedUsers.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No users assigned.</p>
              ) : (
                <ul className="space-y-2">
                  {assignedUsers.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center min-w-0 gap-3">
                        {u.profilePhotoPath ? (
                          <img
                            src={u.profilePhotoPath}
                            alt={u.name}
                            className="flex-shrink-0 object-cover rounded-full w-9 h-9"
                          />
                        ) : (
                          <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold rounded-full w-9 h-9 bg-primary/10 text-primary">
                            {(u.name || u.username || "?").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium truncate text-slate-900 dark:text-white">{u.name}</div>
                          <div className="text-xs truncate text-slate-500 dark:text-slate-400">@{u.username}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnassign(u)}
                        className="p-2 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600"
                        aria-label="Unassign"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <UserPlus className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Add user</span>
                </div>
                <input
                  value={userSearch}
                  onChange={(e) => {
                    setUserResultsPage(1);
                    setUserSearch(e.target.value);
                  }}
                  placeholder="Search users by name / username / email..."
                  className={inputClass + " mb-3"}
                />
                <div className="overflow-auto bg-white border rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 max-h-48">
                  {userResultsLoading ? (
                    <div className="p-3 text-sm text-slate-500 dark:text-slate-400">Searching...</div>
                  ) : userResults.filter((u) => !assignedIds.has(u.id)).length === 0 ? (
                    <div className="p-3 text-sm text-slate-500 dark:text-slate-400">
                      No users found. Try a different search or all may already be assigned.
                    </div>
                  ) : (
                    userResults
                      .filter((u) => !assignedIds.has(u.id))
                      .slice(0, 8)
                      .map((u) => {
                        const selected = selectedUserToAssign?.id === u.id;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => setSelectedUserToAssign(u)}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                              selected ? "bg-primary/10" : ""
                            }`}
                          >
                            {u.profilePhotoPath ? (
                              <img
                                src={u.profilePhotoPath}
                                alt={u.name}
                                className="flex-shrink-0 object-cover w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-bold rounded-full bg-primary/10 text-primary">
                                {(u.name || u.username || "?").charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate text-slate-900 dark:text-white">{u.name}</div>
                              <div className="text-xs truncate text-slate-500 dark:text-slate-400">@{u.username}</div>
                            </div>
                            {selected ? <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-primary" /> : null}
                          </button>
                        );
                      })
                  )}
                </div>
                <button
                  type="button"
                  disabled={!selectedUserToAssign || assigning}
                  onClick={handleAssign}
                  className="px-4 py-2 mt-3 font-bold text-white rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50"
                >
                  {assigning ? "Assigning..." : "Assign selected user"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 pb-safe">
        <MobileBottomNav />
      </div>
    </div>
  );
}
