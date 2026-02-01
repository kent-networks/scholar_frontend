"use client";

import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { mockIsPaidSchool } from "@/lib/mockState";
import { Edit2, Lock, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { competitionsApi, Competition } from "@/lib/api/competitions";
import { useAuth } from "@/contexts/AuthContext";
import ModalDialog from "@/components/ModalDialog";
import ButtonDropdown from "@/components/ButtonDropdown";
import CustomDatePicker from "@/components/CustomDatepicker";

export default function ScholinkPage() {
  const { user } = useAuth();
  const isGlobalAdmin = (user?.role || "") === "admin";

  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [institution, setInstitution] = useState("");
  const [deadline, setDeadline] = useState("");
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all disabled:opacity-60";

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await competitionsApi.list({ limit: 24, offset: 0 });
        if (!cancelled) setCompetitions(res.data);
      } catch (e: any) {
        if (!cancelled) toast.error(e?.response?.data?.message || "Failed to load competitions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (mockIsPaidSchool) load();
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    try {
      const res = await competitionsApi.list({ limit: 24, offset: 0 });
      setCompetitions(res.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load competitions");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 pb-20 overflow-y-auto md:pb-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Scholink</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Access academic competitions and opportunities
            </p>
          </div>

          {!mockIsPaidSchool ? (
            /* Locked View */
            <div className="max-w-2xl mx-auto">
              <div className="p-12 text-center border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800">
                  <Lock className="w-8 h-8 text-slate-500" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                  Upgrade to access Scholink
                </h2>
                <p className="mb-8 text-slate-600 dark:text-slate-400">
                  This feature is available for paid school accounts. Upgrade your account to access
                  academic competitions and exclusive opportunities.
                </p>
                <button className="px-6 py-3 font-bold text-white transition-colors rounded-lg shadow-sm bg-primary hover:bg-primary-dark shadow-primary/30">
                  Upgrade Account
                </button>
              </div>
            </div>
          ) : (
            /* Competitions List */
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Browse available competitions.
                </div>
                {isGlobalAdmin && (
                  <button
                    onClick={() => {
                      setMode("create");
                      setEditingId(null);
                      setSelectedCompetition(null);
                      setTitle("");
                      setDescription("");
                      setInstitution("");
                      setDeadline("");
                      setDeadlineDate(null);
                      setIsPaid(false);
                      setCreateOpen(true);
                    }}
                    className="px-4 py-2 text-white transition-colors bg-primary hover:bg-primary-dark rounded-2xl"
                  >
                    Create competition
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="py-12 text-center col-span-full text-slate-500 dark:text-slate-400">
                    Loading competitions...
                  </div>
                ) : competitions.length === 0 ? (
                  <div className="py-12 text-center col-span-full text-slate-500 dark:text-slate-400">
                    No competitions yet.
                  </div>
                ) : (
                  competitions.map((competition) => (
                  <div
                    key={competition.id}
                    className="p-5 transition-all border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                      {competition.isPaid && (
                        <span className="inline-block px-2 py-1 mb-2 text-xs font-bold rounded-full bg-amber-500/10 text-amber-700">
                          Paid
                        </span>
                      )}
                      <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                        {competition.title}
                      </h3>
                      {competition.description && (
                        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {competition.description}
                        </p>
                      )}
                      <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                        {competition.institution || "—"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {competition.deadline
                          ? new Date(competition.deadline).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "No deadline"}
                      </p>
                      </div>

                      {isGlobalAdmin && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <ButtonDropdown
                            buttonContent={<MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
                            buttonClassName="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            options={[
                              {
                                label: "Edit",
                                value: "edit",
                                icon: Edit2,
                                onClick: () => {
                                  setMode("edit");
                                  setEditingId(competition.id);
                                  setSelectedCompetition(competition);
                                  setTitle(competition.title || "");
                                  setDescription(competition.description || "");
                                  setInstitution(competition.institution || "");
                                  setDeadline(competition.deadline || "");
                                  setDeadlineDate(
                                    competition.deadline ? new Date(competition.deadline) : null
                                  );
                                  setIsPaid(!!competition.isPaid);
                                  setCreateOpen(true);
                                },
                              },
                              {
                                label: "Delete",
                                value: "delete",
                                icon: Trash2,
                                danger: true,
                                onClick: () => {
                                  setSelectedCompetition(competition);
                                  setDeleteOpen(true);
                                },
                              },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                    <button className="w-full px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary hover:bg-primary-dark shadow-primary/30">
                      View Details
                    </button>
                  </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 pb-safe">
        <MobileBottomNav />
      </div>

      <ModalDialog
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setMode("create");
          setEditingId(null);
          setSelectedCompetition(null);
          setTitle("");
          setDescription("");
          setInstitution("");
          setDeadline("");
          setDeadlineDate(null);
          setIsPaid(false);
        }}
        title={mode === "edit" ? "Edit competition" : "Create competition"}
        width="md"
      >
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className={inputClass}
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className={inputClass}
          />
          <input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="Institution (optional)"
            className={inputClass}
          />
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-slate-900 dark:text-white">
              Deadline (optional)
            </label>
            <CustomDatePicker
              value={deadlineDate}
              onChange={(d: Date | null) => {
                setDeadlineDate(d);
                setDeadline(d ? d.toISOString().slice(0, 10) : "");
              }}
              placeholder="Select deadline"
              disableBefore={undefined}
              disableAfter={undefined}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className="w-4 h-4"
            />
            Paid competition
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setCreateOpen(false);
                setMode("create");
                setEditingId(null);
                setSelectedCompetition(null);
                setTitle("");
                setDescription("");
                setInstitution("");
                setDeadline("");
                setDeadlineDate(null);
                setIsPaid(false);
              }}
              className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={creating || !title.trim()}
              onClick={async () => {
                try {
                  setCreating(true);
                  const deadlineStr = deadlineDate
                    ? deadlineDate.toISOString().slice(0, 10)
                    : deadline.trim() || undefined;
                  if (mode === "edit" && editingId) {
                    await competitionsApi.update(editingId, {
                      title: title.trim(),
                      description: description.trim() || undefined,
                      institution: institution.trim() || undefined,
                      deadline: deadlineStr,
                      isPaid,
                    });
                    toast.success("Competition updated");
                  } else {
                    await competitionsApi.create({
                      title: title.trim(),
                      description: description.trim() || undefined,
                      institution: institution.trim() || undefined,
                      deadline: deadlineStr,
                      isPaid,
                    });
                    toast.success("Competition created");
                  }
                  setCreateOpen(false);
                  setMode("create");
                  setEditingId(null);
                  setSelectedCompetition(null);
                  setTitle("");
                  setDescription("");
                  setInstitution("");
                  setDeadline("");
                  setDeadlineDate(null);
                  setIsPaid(false);
                  await refresh();
                } catch (e: any) {
                  toast.error(e?.response?.data?.message || "Failed to save competition");
                } finally {
                  setCreating(false);
                }
              }}
              className="px-4 py-2 font-bold text-white rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50"
            >
              {creating ? "Saving..." : mode === "edit" ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </ModalDialog>

      <ModalDialog
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedCompetition(null);
        }}
        title="Delete competition"
        width="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {selectedCompetition?.title || "this competition"}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setDeleteOpen(false);
                setSelectedCompetition(null);
              }}
              className="px-4 py-2 font-bold border rounded-lg border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting || !selectedCompetition}
              onClick={async () => {
                if (!selectedCompetition) return;
                try {
                  setDeleting(true);
                  await competitionsApi.delete(selectedCompetition.id);
                  toast.success("Competition deleted");
                  setDeleteOpen(false);
                  setSelectedCompetition(null);
                  await refresh();
                } catch (e: any) {
                  toast.error(e?.response?.data?.message || "Failed to delete competition");
                } finally {
                  setDeleting(false);
                }
              }}
              className="px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
