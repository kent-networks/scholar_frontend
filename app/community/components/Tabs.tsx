"use client";

import { useAuth } from "@/contexts/AuthContext";

interface TabsProps {
  activeTab: "discover" | "my-communities" | "created";
  onTabChange: (tab: "discover" | "my-communities" | "created") => void;
}

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  const { isAuthenticated } = useAuth();
  
  const allTabs = [
    { id: "discover" as const, label: "Discover Communities" },
    { id: "my-communities" as const, label: "My Communities" },
    { id: "created" as const, label: "Created by Me" },
  ];
  
  const tabs = isAuthenticated 
    ? allTabs 
    : [allTabs[0]]; // Only show "Discover Communities" if not authenticated

  return (
    <div className="mb-8">
      <div className="flex gap-8 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col font-bold items-center justify-center border-b-[3px] pb-3 pt-4 px-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary dark:text-white"
                : "border-transparent text-slate-600 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <p className="text-sm tracking-[0.015em]">{tab.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

