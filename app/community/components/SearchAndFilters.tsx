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
  // Sciences
  { value: "Biology", label: "Biology" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Physics", label: "Physics" },
  { value: "Agriculture", label: "Agriculture" },
  { value: "Environmental Studies", label: "Environmental Studies" },

  // Technology & ICT
  { value: "ICT", label: "ICT / Computer Studies" },
  { value: "Robotics", label: "Robotics & Innovation" },

  // Mathematics
  { value: "Mathematics", label: "Mathematics" },

  // Humanities
  { value: "Geography", label: "Geography" },
  { value: "History", label: "History" },
  { value: "Economics", label: "Economics" },
  { value: "Entrepreneurship", label: "Entrepreneurship" },
  { value: "Religious Education", label: "Religious Education" },

  // Languages
  { value: "English", label: "English Language & Literature" },
  { value: "Local Languages", label: "Local Languages (Luganda, Runyankole, etc.)" },

  // Health & Society
  { value: "Health Education", label: "Health Education" },
  { value: "Social Studies", label: "Social Studies & Civics" },

  // General
  { value: "Innovation", label: "Innovation & Research Projects" },
  { value: "Other", label: "Other" },
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
                <Search className="w-5 h-5 mr-1" />
              </div>
              <input
className="w-full px-4 text-base transition-all duration-200 bg-transparent outline-none rounded-r-xl text-slate-900 placeholder:text-slate-400 border-1 border-slate-100 focus:outline-none focus:ring-1 focus:border-primary focus:shadow-sm"

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

