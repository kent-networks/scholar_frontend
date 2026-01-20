"use client";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm appearance-none pr-8"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {label}: {option}
          </option>
        ))}
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-slate-400">
        keyboard_arrow_down
      </span>
    </div>
  );
}

