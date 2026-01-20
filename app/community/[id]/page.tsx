"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";

// Mock state
const mockIsOwner = false; // Change to true to see owner section

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

const mockMembers = [
  { id: 1, name: "Dr. Sarah Chen", role: "Admin" },
  { id: 2, name: "Prof. Michael Johnson", role: "Member" },
  { id: 3, name: "Dr. Emily Rodriguez", role: "Member" },
  { id: 4, name: "Dr. Lisa Anderson", role: "Member" },
];

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"posts" | "files" | "members">("posts");

  const communityId = params.id as string;

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
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Back to Communities</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Quantum Computing Research
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              A community for researchers working on quantum computing
            </p>
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
                        <button className="flex items-center gap-1 hover:text-primary">
                          <span className="material-symbols-outlined text-base">thumb_up</span>
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary">
                          <span className="material-symbols-outlined text-base">chat_bubble</span>
                          {post.comments}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "files" && (
                <div className="space-y-4">
                  {mockFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">description</span>
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
                  {mockMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Owner Section - only visible if owner */}
            {mockIsOwner && (
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">Member List</h3>
                  <div className="space-y-2">
                    {mockMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 dark:text-slate-300">{member.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{member.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">Storage Usage</h3>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">30MB / 50MB</span>
                      <span className="font-bold text-slate-900 dark:text-white">60%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

