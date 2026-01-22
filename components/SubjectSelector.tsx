"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const COMMON_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Engineering",
  "Medicine",
  "Psychology",
  "Economics",
  "History",
  "Literature",
  "Philosophy",
  "Art",
  "Music",
  "Geography",
  "Astronomy",
  "Environmental Science",
  "Political Science",
  "Sociology",
  "Business",
  "Education",
  "Law",
  "Architecture",
  "Agriculture",
  "Other",
];

interface SubjectSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function SubjectSelector({
  value,
  onChange,
  disabled = false,
  placeholder = "Select or type a subject...",
}: SubjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const filteredSubjects = COMMON_SUBJECTS.filter((subject) =>
    subject.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (subject: string) => {
    setInputValue(subject);
    onChange(subject);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <ChevronDown
            className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredSubjects.length > 0 ? (
            <ul className="py-1">
              {filteredSubjects.map((subject) => (
                <li key={subject}>
                  <button
                    type="button"
                    onClick={() => handleSelect(subject)}
                    className="w-full px-4 py-2 text-left text-sm text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {subject}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
              No matching subjects
            </div>
          )}
        </div>
      )}
    </div>
  );
}

