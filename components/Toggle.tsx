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

  // Reset loading/done states when checked changes externally
  useEffect(() => {
    if (!checked) {
      setIsLoading(false);
      setIsDone(false);
    }
  }, [checked]);

  const handleClick = () => {
    if (disabled) return;

    const newValue = !checked;

    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);

    if (newValue && !checked) {
      setIsLoading(true);
      setIsDone(false);

      // Simulate loading animation
      setTimeout(() => {
        setIsLoading(false);
        setIsDone(true);
      }, 1500);
    }
  };

  return (
    <div
      className={`toggle relative w-16 h-9 rounded-full cursor-pointer transition-all duration-300 ${
        checked
          ? "bg-primary/25"
          : "bg-slate-300 dark:bg-slate-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={handleClick}
    >
      <div
        className={`knob absolute top-0.5 left-0.5 w-7 h-7 bg-white dark:bg-slate-100 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden ${
          checked ? "left-[33px] bg-primary" : ""
        }`}
      >
        {isLoading && !isDone && checked && (
          <div className="spinner w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
        {isDone && checked && !isLoading && (
          <Check className="w-4 h-4 text-white" />
        )}
      </div>
    </div>
  );
}

