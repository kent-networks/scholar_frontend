"use client";

import { useState } from "react";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { mockLoggedIn } from "@/lib/mockState";
import { KeyRound, Pencil, Activity, FileText, Users } from "lucide-react";

const mockUser = {
  name: "Dr. Sarah Chen",
  role: "Researcher",
  email: "sarah.chen@scholar.edu",
};

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);

  // For now we assume logged in via mockState; keep guard for future wiring.
  if (!mockLoggedIn) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar user={mockUser} />
      </div>

      <main className="flex-1 overflow-y-auto md:pb-0 pb-20">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Account</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your profile and settings</p>
          </div>

          {/* Profile Card */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {mockUser.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {mockUser.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-1">{mockUser.role}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">{mockUser.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-lg transition-colors"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Settings Section */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Settings</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <Pencil className="h-5 w-5 text-slate-600" />
                  <span className="font-bold text-slate-900 dark:text-white">Edit Profile</span>
                </div>
                <span className="text-slate-400">›</span>
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-slate-600" />
                  <span className="font-bold text-slate-900 dark:text-white">Change Password</span>
                </div>
                <span className="text-slate-400">›</span>
              </button>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Activity Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Documents</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Communities</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">5</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Contributions</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">234</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 z-50 shadow-lg pb-safe">
        <MobileBottomNav />
      </div>
    </div>
  );
}
