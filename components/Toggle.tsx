"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function Toggle({
  checked: controlledChecked,
  onChange,
  disabled = false,
  className = "",
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  useEffect(() => {
    if (!checked) {
      setIsLoading(false);
      setIsDone(false);
    }
  }, [checked]);

  const handleClick = () => {
    if (disabled) return;
    const newValue = !checked;

    if (!isControlled) setInternalChecked(newValue);
    onChange?.(newValue);

    if (newValue && !checked) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsDone(true);
      }, 1500);
    }
  };

  return (
    <div
      className={`
        relative w-16 h-9 rounded-full cursor-pointer transition-colors duration-300
        ${checked ? "bg-indigo-500/25" : "bg-gray-300 dark:bg-gray-600"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      onClick={handleClick}
    >
      <div
        className={`
          absolute top-1 w-7 h-7 rounded-full flex items-center justify-center overflow-hidden
          transition-all duration-300 ease-in-out
          ${checked
            ? "left-[33px] bg-indigo-600"
            : "left-1 bg-white dark:bg-gray-100"
          }
        `}
      >
        {isLoading && checked && !isDone && (
          <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}

        {isDone && checked && (
          <Check className="w-4 h-4 text-white" strokeWidth={1.5} />
        )}
      </div>
    </div>
  );
}