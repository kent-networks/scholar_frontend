"use client";

interface AdminTabsProps {
  activeTab: "users" | "institutions";
  onTabChange: (tab: "users" | "institutions") => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = [
    { id: "users" as const, label: "Users" },
    { id: "institutions" as const, label: "Institutions" },
  ];

  return (
    <div className="mb-6">
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

