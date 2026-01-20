"use client";

import Dropdown from "@/components/Dropdown";

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
  const dropdownOptions = options.map((opt) => ({ value: opt, label: opt }));

  return (
    <Dropdown
      options={dropdownOptions}
      value={value}
      onChange={(v) => {
        if (typeof v === "string") onChange(v);
        else onChange(v.target.value);
      }}
      placeholder={`${label}: ${value}`}
      className="min-w-[220px]"
    />
  );
}

