"use client";

import { Search } from "lucide-react";
import Dropdown from "@/components/Dropdown";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  researchField: string;
  onResearchFieldChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  size: string;
  onSizeChange: (value: string) => void;
}

const researchFieldOptions = [
  { value: "", label: "All Fields" },
  { value: "Neuroscience", label: "Neuroscience" },
  { value: "Quantum Physics", label: "Quantum Physics" },
  { value: "Environmental", label: "Environmental" },
  { value: "Genomics", label: "Genomics" },
  { value: "Social Sciences", label: "Social Sciences" },
  { value: "Data Science", label: "Data Science" },
];

const typeOptions = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

const sizeOptions = [
  { value: "small", label: "Small (< 100)" },
  { value: "medium", label: "Medium (100-1k)" },
  { value: "large", label: "Large (> 1k)" },
];

export default function SearchAndFilters({
  searchQuery,
  onSearchChange,
  researchField,
  onResearchFieldChange,
  type,
  onTypeChange,
  size,
  onSizeChange,
}: SearchAndFiltersProps) {
  return (
    <div className="p-4 mb-6 bg-white border shadow-sm rounded-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <label className="flex flex-col w-full">
            <div className="flex items-stretch h-12 rounded-xl bg-slate-100 dark:bg-slate-800">
              <div className="flex items-center justify-center pl-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                className="w-full px-4 text-base transition-all bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="Search for research topics, groups, or keywords..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <Dropdown
            options={researchFieldOptions}
            value={researchField}
            onChange={(e) => {
              const value = typeof e === "string" ? e : e.target.value;
              onResearchFieldChange(value);
            }}
            placeholder="Research Field"
            className="h-12"
          />

        </div>
      </div>
    </div>
  );
}

