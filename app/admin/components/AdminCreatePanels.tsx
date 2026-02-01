"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ModalDialog from "@/components/ModalDialog";
import Dropdown from "@/components/Dropdown";
import { institutionsApi, Institution } from "@/lib/api/institutions";
import { userAdminApi, AdminUser } from "@/lib/api/users-admin";

type ToolTab = "institutions" | "create-admin" | "assign-user";

export default function AdminCreatePanels({
  onUserDataChanged,
}: {
  onUserDataChanged?: () => void;
}) {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  const [instName, setInstName] = useState("");
  const [instMotto, setInstMotto] = useState("");
  const [instCreating, setInstCreating] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<AdminUser[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [assignInstitutionId, setAssignInstitutionId] = useState<number | null>(null);
  const [assignIsInstAdmin, setAssignIsInstAdmin] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [activeTab, setActiveTab] = useState<ToolTab>("institutions");

  const inputClass =
    "w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3.5 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all disabled:opacity-60";

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoadingInstitutions(true);
        const res = await institutionsApi.list({ limit: 100, offset: 0 });
        if (!cancelled) setInstitutions(res.data);
      } catch (e: any) {
        if (!cancelled) toast.error(e?.response?.data?.message || "Failed to load institutions");
      } finally {
        if (!cancelled) setLoadingInstitutions(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const institutionOptions = useMemo(
    () =>
      institutions.map((i) => ({
        label: i.name,
        value: String(i.id),
      })),
    [institutions]
  );

  useEffect(() => {
    if (!assignOpen) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        setUserLoading(true);
        const res = await userAdminApi.getUsers({
          search: userSearch.trim() || undefined,
          limit: 10,
          offset: 0,
        });
        if (!cancelled) setUserResults(res.data);
      } catch (e: any) {
        if (!cancelled) toast.error(e?.response?.data?.message || "Failed to search users");
      } finally {
        if (!cancelled) setUserLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [assignOpen, userSearch]);

  return (
    <div className="p-3 bg-white border dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("create-admin")}
          className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
            activeTab === "create-admin"
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Create Admin
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("institutions")}
          className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
            activeTab === "institutions"
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Institutions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("assign-user")}
          className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
            activeTab === "assign-user"
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Assign user
        </button>
      </div>

      {activeTab === "create-admin" && (
        <div className="flex items-center justify-between gap-3 mt-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            You’ll create admins via the admin signup screen.
          </div>
          <button
            type="button"
            onClick={() => router.push("/signup?role=admin")}
            className="px-4 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            Go to admin signup
          </button>
        </div>
      )}

      {activeTab === "institutions" && (
        <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3">
          <input
            value={instName}
            onChange={(e) => setInstName(e.target.value)}
            placeholder="Institution name"
            className={inputClass}
          />
          <input
            value={instMotto}
            onChange={(e) => setInstMotto(e.target.value)}
            placeholder="Motto (optional)"
            className={inputClass}
          />
          <div className="flex justify-end md:justify-start">
            <button
              disabled={instCreating || !instName.trim()}
              onClick={async () => {
                try {
                  setInstCreating(true);
                  const created = await institutionsApi.create({
                    name: instName.trim(),
                    motto: instMotto.trim() || undefined,
                  });
                  toast.success("Institution created");
                  setInstName("");
                  setInstMotto("");
                  const res = await institutionsApi.list({ limit: 100, offset: 0 });
                  setInstitutions(res.data);
                  setAssignInstitutionId(created.id);
                } catch (e: any) {
                  toast.error(e?.response?.data?.message || "Failed to create institution");
                } finally {
                  setInstCreating(false);
                }
              }}
              className="w-full md:w-auto px-4 py-3.5 rounded-xl bg-primary text-white hover:bg-primary-dark disabled:opacity-50 transition-all"
            >
              {instCreating ? "Creating..." : "Create Institution"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "assign-user" && (
        <div className="flex items-center justify-between gap-3 mt-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Assign a user to an institution (optionally as institution admin).
          </div>
          <button
            disabled={loadingInstitutions}
            onClick={() => setAssignOpen(true)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Open assign form
          </button>
        </div>
      )}

      {/* Assign modal */}
      <ModalDialog
        isOpen={assignOpen}
        onClose={() => {
          setAssignOpen(false);
          setUserSearch("");
          setSelectedUser(null);
          setAssignIsInstAdmin(false);
        }}
        title="Assign user to institution"
        width="md"
      >
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Search for a user by name/username/email, then assign to an institution.
          </div>

          <input
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search users..."
            className={inputClass}
          />

          <div className="overflow-auto bg-white border rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 max-h-56">
            {userLoading ? (
              <div className="p-3 text-sm text-slate-500 dark:text-slate-400">Searching...</div>
            ) : userResults.length === 0 ? (
              <div className="p-3 text-sm text-slate-500 dark:text-slate-400">No users found.</div>
            ) : (
              userResults.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedUser(u)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    selectedUser?.id === u.id ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold truncate text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-xs truncate text-slate-500 dark:text-slate-400">
                        @{u.username} · {u.email}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400">#{u.id}</div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-900 dark:text-white">Institution</div>
            <Dropdown
              options={institutionOptions}
              value={assignInstitutionId ? String(assignInstitutionId) : ""}
              onChange={(v) => setAssignInstitutionId(v ? Number(v) : null)}
              className="w-full"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={assignIsInstAdmin}
              onChange={(e) => setAssignIsInstAdmin(e.target.checked)}
              className="w-4 h-4"
            />
            Make user an institution admin
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setAssignOpen(false);
                setUserSearch("");
                setSelectedUser(null);
                setAssignIsInstAdmin(false);
              }}
              className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={assigning || !selectedUser || !assignInstitutionId}
              onClick={async () => {
                try {
                  setAssigning(true);
                  await institutionsApi.assignUser(assignInstitutionId!, {
                    userId: selectedUser!.id,
                    isInstitutionAdmin: assignIsInstAdmin,
                  });
                  toast.success("User assigned");
                  setAssignOpen(false);
                  setUserSearch("");
                  setSelectedUser(null);
                  setAssignIsInstAdmin(false);
                  onUserDataChanged?.();
                } catch (e: any) {
                  toast.error(e?.response?.data?.message || "Failed to assign user");
                } finally {
                  setAssigning(false);
                }
              }}
              className="px-4 py-2 font-bold text-white rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50"
            >
              Assign
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}

