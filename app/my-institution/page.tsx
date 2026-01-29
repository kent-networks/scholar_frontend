"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { institutionsApi, Institution } from "@/lib/api/institutions";

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3.5 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all disabled:opacity-60";

export default function MyInstitutionPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [motto, setMotto] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.institutionId == null) {
      router.push("/");
      return;
    }
  }, [authLoading, isAuthenticated, user?.institutionId, router]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await institutionsApi.getMyInstitution();
        if (cancelled) return;
        if (!data) {
          router.push("/");
          return;
        }
        setInstitution(data);
        setName(data.name);
        setMotto(data.motto ?? "");
      } catch (e: any) {
        if (!cancelled) {
          if (e?.response?.status === 404) {
            router.push("/");
            return;
          }
          toast.error(e?.response?.data?.message || "Failed to load institution");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (isAuthenticated && user?.institutionId != null) load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.institutionId, router]);

  const handleSave = async () => {
    if (!institution) return;
    try {
      setSaving(true);
      await institutionsApi.update(institution.id, {
        name: name.trim(),
        motto: motto.trim() || undefined,
      });
      toast.success("Institution updated");
      setInstitution((prev) =>
        prev ? { ...prev, name: name.trim(), motto: motto.trim() || undefined } : null
      );
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update institution");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !institution) {
    return (
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-slate-500 dark:text-slate-400">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-[100svh] md:h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 pb-20 overflow-y-auto md:pb-0">
        <div className="max-w-2xl p-4 mx-auto md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              My Institution
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              View and edit your institution details.
            </p>
          </div>

          <div className="p-5 border shadow-sm bg-surface-light dark:bg-surface-dark rounded-xl border-slate-200 dark:border-slate-800">
            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                  Institution name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Institution name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                  Motto (optional)
                </label>
                <input
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="Motto"
                  className={inputClass}
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={saving || !name.trim()}
                  onClick={handleSave}
                  className="px-5 py-2.5 font-bold text-white rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
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
