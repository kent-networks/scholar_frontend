"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import ButtonDropdown from "@/components/ButtonDropdown";
import DataTable from "@/components/DataTable";
import Dropdown from "@/components/Dropdown";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Users,
  UsersRound,
  XCircle,
  MoreVertical,
  Shield,
  FolderOpen,
  Video,
  Edit2,
  Trash2,
} from "lucide-react";
import ModalDialog from "@/components/ModalDialog";
import { adminApi, AdminSummary } from "../../lib/api/admin";
import { userAdminApi, AdminUser, AdminUsersQuery } from "../../lib/api/users-admin";
import AdminTabs from "./components/AdminTabs";
import AdminSummaryCards from "./components/AdminSummaryCards";
import { institutionsApi, Institution } from "@/lib/api/institutions";

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [usersLoading, setUsersLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminUsersQuery["role"]>("");
  const [statusFilter, setStatusFilter] = useState<AdminUsersQuery["isActive"]>("");

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshUsersKey, setRefreshUsersKey] = useState(0);
  const initialTab = (searchParams.get("tab") || "") as any;
  const [activeTab, setActiveTab] = useState<"users" | "institutions">(
    initialTab === "institutions" ? "institutions" : "users"
  );

  const inputClass =
    "w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3.5 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all disabled:opacity-60";

  const offset = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(totalUsers / itemsPerPage));

  // Institutions tab state
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [institutionsSearch, setInstitutionsSearch] = useState("");
  const [institutionsItemsPerPage, setInstitutionsItemsPerPage] = useState(10);
  const [institutionsPage, setInstitutionsPage] = useState(1);
  const [institutionsTotal, setInstitutionsTotal] = useState(0);
  const institutionsOffset = (institutionsPage - 1) * institutionsItemsPerPage;
  const institutionsTotalPages = Math.max(1, Math.ceil(institutionsTotal / institutionsItemsPerPage));

  const [deleteInstitutionOpen, setDeleteInstitutionOpen] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState<Institution | null>(null);
  const [deletingInstitution, setDeletingInstitution] = useState(false);
  const [refreshInstitutionsKey, setRefreshInstitutionsKey] = useState(0);

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
    async function loadSummary() {
      try {
        setSummaryLoading(true);
        const s = await adminApi.getSummary();
        if (cancelled) return;
        setSummary(s);
      } catch (e: any) {
        if (!cancelled) {
          toast.error(e?.response?.data?.message || "Failed to load admin summary");
        }
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    }
    if (isAuthenticated && user?.role === "admin") loadSummary();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    let cancelled = false;
    async function loadUsers() {
      try {
        setUsersLoading(true);
        const res = await userAdminApi.getUsers({
          search: search.trim() || undefined,
          role: roleFilter || undefined,
          isActive: statusFilter || undefined,
          limit: itemsPerPage,
          offset,
        });
        if (cancelled) return;
        setUsers(res.data);
        setTotalUsers(res.pagination.total);
      } catch (e: any) {
        if (!cancelled) {
          toast.error(e?.response?.data?.message || "Failed to load users");
        }
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    }

    if (isAuthenticated && user?.role === "admin") loadUsers();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.role, search, roleFilter, statusFilter, itemsPerPage, offset, refreshUsersKey]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;
    let cancelled = false;
    async function loadInstitutions() {
      try {
        setInstitutionsLoading(true);
        const res = await institutionsApi.list({
          search: institutionsSearch.trim() || undefined,
          limit: institutionsItemsPerPage,
          offset: institutionsOffset,
        });
        if (cancelled) return;
        setInstitutions(res.data);
        setInstitutionsTotal(res.pagination.total);
      } catch (e: any) {
        if (!cancelled) toast.error(e?.response?.data?.message || "Failed to load institutions");
      } finally {
        if (!cancelled) setInstitutionsLoading(false);
      }
    }
    loadInstitutions();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.role, institutionsSearch, institutionsItemsPerPage, institutionsOffset, refreshInstitutionsKey]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        width: "min-w-[200px]",
        render: (row: AdminUser) => (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-bold">
              {(row.name || row.username || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 truncate">{row.name}</div>
              <div className="text-xs text-slate-500 truncate">@{row.username}</div>
            </div>
          </div>
        ),
      },
      {
        key: "email",
        label: "Email",
        width: "min-w-[240px]",
        render: (row: AdminUser) => <span className="text-slate-700">{row.email}</span>,
      },
      {
        key: "role",
        label: "Role",
        width: "min-w-[120px]",
        render: (row: AdminUser) => (
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              row.role === "admin"
                ? "bg-purple-100 text-purple-700"
                : row.role === "educator"
                  ? "bg-blue-100 text-blue-700"
                  : row.role === "creator"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-700"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {row.role}
          </span>
        ),
      },
      {
        key: "isActive",
        label: "Status",
        width: "min-w-[120px]",
        render: (row: AdminUser) => (
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              row.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {row.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {row.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "",
        width: "w-[72px]",
        render: (row: AdminUser) => (
          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
            <ButtonDropdown
              buttonContent={<MoreVertical className="w-5 h-5 text-slate-600" />}
              buttonClassName="p-2 rounded-lg hover:bg-slate-100"
              options={[
                {
                  label: row.isActive ? "Deactivate" : "Activate",
                  value: "toggle-active",
                  icon: row.isActive ? XCircle : CheckCircle2,
                  danger: row.isActive,
                  onClick: async () => {
                    try {
                      const result = await userAdminApi.toggleActiveStatus(row.id);
                      setUsers((prev) =>
                        prev.map((u) => (u.id === row.id ? { ...u, isActive: result.isActive } : u))
                      );
                      toast.success(result.isActive ? "User activated" : "User deactivated");
                    } catch (e: any) {
                      toast.error(e?.response?.data?.message || "Failed to update user status");
                    }
                  },
                },
                {
                  label: "View profile",
                  value: "view-profile",
                  icon: UsersRound,
                  onClick: () => router.push(`/profile/${row.username}`),
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [router]
  );

  const visibleColumns = useMemo(
    () => ["name", "email", "role", "isActive", "actions"],
    []
  );

  const institutionColumns = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        width: "min-w-[220px]",
        render: (row: Institution) => (
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 dark:text-white truncate">{row.name}</div>
            {row.motto ? (
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{row.motto}</div>
            ) : null}
          </div>
        ),
      },
      {
        key: "assignedUsers",
        label: "Assigned users",
        width: "min-w-[200px]",
        render: (row: Institution) => {
          const list = row.assignedUsers ?? [];
          if (list.length === 0) {
            return <span className="text-slate-500 dark:text-slate-400">—</span>;
          }
          return (
            <div className="flex flex-wrap gap-2">
              {list.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/${u.username}`);
                  }}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left min-w-0"
                >
                  {u.profilePhotoPath ? (
                    <img
                      src={u.profilePhotoPath}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {(u.name || u.username || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-slate-900 dark:text-white truncate text-sm">
                    {u.name}
                  </span>
                </button>
              ))}
            </div>
          );
        },
      },
      {
        key: "createdAt",
        label: "Created",
        width: "min-w-[120px]",
        render: (row: Institution) => (
          <span className="text-slate-700 dark:text-slate-300">
            {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "",
        width: "w-[72px]",
        render: (row: Institution) => (
          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
            <ButtonDropdown
              buttonContent={<MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
              buttonClassName="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              options={[
                {
                  label: "Edit",
                  value: "edit",
                  icon: Edit2,
                  onClick: () => router.push(`/admin/institutions/${row.id}/edit`),
                },
                {
                  label: "Delete",
                  value: "delete",
                  icon: Trash2,
                  danger: true,
                  onClick: () => {
                    setInstitutionToDelete(row);
                    setDeleteInstitutionOpen(true);
                  },
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [router]
  );

  const institutionVisibleColumns = useMemo(
    () => ["name", "assignedUsers", "createdAt", "actions"],
    []
  );

  return (
    <div className="flex h-[100svh] md:h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 pb-20 overflow-y-auto md:pb-0">
        <div className="max-w-7xl p-4 mx-auto md:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Panel</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Manage users and moderate the platform.
              </p>
            </div>
          </div>

          <AdminSummaryCards summary={summary} loading={summaryLoading} />

          <AdminTabs
            activeTab={activeTab}
            onTabChange={(t) => {
              setActiveTab(t);
              if (t === "users") setCurrentPage(1);
              if (t === "institutions") setInstitutionsPage(1);
            }}
          />

          {activeTab === "users" ? (
            <>
              <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Manage users, roles, and activation status.
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/signup?role=admin")}
                  className="w-full md:w-auto px-4 py-3.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  Add admin
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col w-full gap-3 md:flex-row md:items-center">
                  <input
                    value={search}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setSearch(e.target.value);
                    }}
                    placeholder="Search users (name, username, email)..."
                    className={inputClass + " md:w-[420px]"}
                  />

                  <Dropdown
                    options={[
                      { value: "", label: "All roles" },
                      { value: "student", label: "Student" },
                      { value: "educator", label: "Educator" },
                      { value: "creator", label: "Creator" },
                      { value: "admin", label: "Admin" },
                    ]}
                    value={roleFilter}
                    onChange={(e) => {
                      const value = typeof e === "string" ? e : e.target.value;
                      setCurrentPage(1);
                      setRoleFilter(value as any);
                    }}
                    className="transition-colors"
                  />

                  <Dropdown
                    options={[
                      { value: "", label: "All statuses" },
                      { value: "true", label: "Active" },
                      { value: "false", label: "Inactive" },
                    ]}
                    value={statusFilter}
                    onChange={(e) => {
                      const value = typeof e === "string" ? e : e.target.value;
                      setCurrentPage(1);
                      setStatusFilter(value as any);
                    }}
                    className="transition-colors"
                  />
                </div>
              </div>

              {/* Users table */}
              <DataTable
                loading={usersLoading}
                data={users}
                onRowClick={() => {}}
                onRowDoubleClick={() => {}}
                columns={columns}
                visibleColumns={visibleColumns}
                sortConfig={{}}
                onSort={() => {}}
                getSortIcon={() => null}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p: number) => setCurrentPage(p)}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(val: any) => {
                  const next = typeof val === "number" ? val : Number(val?.target?.value);
                  setCurrentPage(1);
                  setItemsPerPage(next);
                }}
                itemsPerPageOptions={[10, 20, 50]}
                totalResults={totalUsers}
              />
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
                <input
                  value={institutionsSearch}
                  onChange={(e) => {
                    setInstitutionsPage(1);
                    setInstitutionsSearch(e.target.value);
                  }}
                  placeholder="Search institutions (name, motto)..."
                  className={inputClass + " md:w-[420px]"}
                />
                <button
                  type="button"
                  onClick={() => router.push("/admin/institutions/new")}
                  className="w-full md:w-auto px-4 py-3.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  Create institution
                </button>
              </div>

              <DataTable
                loading={institutionsLoading}
                data={institutions}
                onRowClick={() => {}}
                onRowDoubleClick={() => {}}
                columns={institutionColumns}
                visibleColumns={institutionVisibleColumns}
                sortConfig={{}}
                onSort={() => {}}
                getSortIcon={() => null}
                currentPage={institutionsPage}
                totalPages={institutionsTotalPages}
                onPageChange={(p: number) => setInstitutionsPage(p)}
                itemsPerPage={institutionsItemsPerPage}
                onItemsPerPageChange={(val: any) => {
                  const next = typeof val === "number" ? val : Number(val?.target?.value);
                  setInstitutionsPage(1);
                  setInstitutionsItemsPerPage(next);
                }}
                itemsPerPageOptions={[10, 20, 50]}
                totalResults={institutionsTotal}
              />
            </>
          )}

          {/* Delete institution modal */}
          <ModalDialog
            isOpen={deleteInstitutionOpen}
            onClose={() => {
              setDeleteInstitutionOpen(false);
              setInstitutionToDelete(null);
            }}
            title="Delete institution"
            width="md"
          >
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {institutionToDelete?.name ?? "this institution"}
                </span>
                ? Assigned users will be unlinked.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteInstitutionOpen(false);
                    setInstitutionToDelete(null);
                  }}
                  className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deletingInstitution || !institutionToDelete}
                  onClick={async () => {
                    if (!institutionToDelete) return;
                    try {
                      setDeletingInstitution(true);
                      await institutionsApi.delete(institutionToDelete.id);
                      toast.success("Institution deleted");
                      setDeleteInstitutionOpen(false);
                      setInstitutionToDelete(null);
                      setRefreshInstitutionsKey((k) => k + 1);
                    } catch (e: any) {
                      toast.error(e?.response?.data?.message || "Failed to delete institution");
                    } finally {
                      setDeletingInstitution(false);
                    }
                  }}
                  className="px-4 py-2 font-bold text-white rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingInstitution ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </ModalDialog>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 pb-safe">
        <MobileBottomNav />
      </div>
    </div>
  );
}

