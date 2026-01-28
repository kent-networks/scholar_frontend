"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { institutionsApi } from "@/lib/api/institutions";
import { userAdminApi, AdminUser } from "@/lib/api/users-admin";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CreateInstitutionPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [motto, setMotto] = useState("");
  const [creating, setCreating] = useState(false);

  // Assign user search (paginated)
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const usersLimit = 8;
  const usersOffset = (usersPage - 1) * usersLimit;
  const usersTotalPages = Math.max(1, Math.ceil(usersTotal / usersLimit));

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const inputClass =
    "w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3.5 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all disabled:opacity-60";

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if ((user?.role || "") !== "admin") {
      router.push("/research-lab");
    }
  }, [authLoading, isAuthenticated, user?.role, router]);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        setUsersLoading(true);
        const res = await userAdminApi.getUsers({
          search: search.trim() || undefined,
          limit: usersLimit,
          offset: usersOffset,
        });
        if (cancelled) return;
        setUsers(res.data);
        setUsersTotal(res.pagination.total);
      } catch (e: any) {
        if (!cancelled) toast.error(e?.response?.data?.message || "Failed to load users");
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search, usersLimit, usersOffset]);


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
            <ArrowLeft className="w-4 h-4" />
            Back to Institutions
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create institution</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Create an institution and optionally assign a user to it.
            </p>
          </div>

          <div className="p-5 border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800">
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
            </div>

            <div className="pt-5 mt-5 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Assign user (optional)</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Search and select a user to assign to this institution.
                  </div>
                </div>
                {selectedUser ? (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl bg-primary/10 text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                    Selected
                  </div>
                ) : null}
              </div>

              <div className="mt-3">
                <input
                  value={search}
                  onChange={(e) => {
                    setUsersPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder="Search users by name / username / email..."
                  className={inputClass}
                />
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                {usersLoading ? (
                  <div className="p-4 text-sm text-slate-500 dark:text-slate-400">Loading...</div>
                ) : users.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500 dark:text-slate-400">No users found.</div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {users.map((u) => {
                      const isSelected = selectedUser?.id === u.id;
                      const letter = ((u.name || u.username || "?").trim().charAt(0) || "?").toUpperCase();
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          className={`w-full text-left px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                            isSelected ? "bg-primary/10" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {u.profilePhotoPath ? (
                              <img
                                src={u.profilePhotoPath}
                                alt={u.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold">
                                {letter}
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-slate-900 dark:text-white truncate">{u.name}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">@{u.username}</div>
                            </div>

                            {isSelected ? <CheckCircle2 className="w-5 h-5 text-primary" /> : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Page {usersPage} of {usersTotalPages} · {usersTotal} users
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={usersPage <= 1}
                    onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-2 text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={usersPage >= usersTotalPages}
                    onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                    className="px-3 py-2 text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Next
                  </button>
                </div>
              </div>

              {selectedUser ? (
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  Selected: <span className="font-bold text-slate-900 dark:text-white">{selectedUser.name}</span>{" "}
                  <span className="font-bold">@{selectedUser.username}</span>
                  <span className="text-slate-500 dark:text-slate-500"> (ID #{selectedUser.id})</span>
                </div>
              ) : null}
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => router.push("/admin?tab=institutions")}
                className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={creating || !name.trim()}
                onClick={async () => {
                  try {
                    setCreating(true);
                    const created = await institutionsApi.create({
                      name: name.trim(),
                      motto: motto.trim() || undefined,
                    });
                    if (selectedUser) {
                      await institutionsApi.assignUser(created.id, { userId: selectedUser.id });
                    }
                    toast.success("Institution created");
                    router.push("/admin?tab=institutions");
                  } catch (e: any) {
                    toast.error(e?.response?.data?.message || "Failed to create institution");
                  } finally {
                    setCreating(false);
                  }
                }}
                className="px-5 py-2 font-bold text-white rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create institution"}
              </button>
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

