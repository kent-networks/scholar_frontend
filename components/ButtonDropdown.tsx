"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface ButtonDropdownOption {
  label: string;
  value: string;
  onClick?: (value: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
  danger?: boolean;
}

interface ButtonDropdownProps {
  buttonContent: React.ReactNode;
  options?: ButtonDropdownOption[];
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function ButtonDropdown({
  buttonContent,
  options = [],
  disabled = false,
  className = "",
  buttonClassName = "",
  onOpenChange = () => {},
}: ButtonDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !buttonRef.current || !menuRef.current) return;

    const updatePosition = () => {
      if (buttonRef.current && menuRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const menuHeight = menuRef.current.offsetHeight || 200;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        let newY = rect.bottom + window.scrollY + 8;
        let newX = rect.left + window.scrollX;

        // Check if menu would overflow below, if so, open upwards
        if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
          newY = rect.top + window.scrollY - menuHeight - 8;
        }

        // Check if menu would overflow to the right
        const menuWidth = menuRef.current.offsetWidth || 160;
        if (newX + menuWidth > window.innerWidth) {
          newX = window.innerWidth - menuWidth - 8;
        }

        // Check if menu would overflow to the left
        if (newX < 8) {
          newX = 8;
        }

        setPosition({
          x: newX,
          y: newY,
        });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex items-center transition-all duration-300
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${buttonClassName}
        `}
      >
        {buttonContent}
      </button>

      {typeof window !== 'undefined' && document.body && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: position.y,
                left: position.x,
                zIndex: 9999,
                minWidth: "10rem",
              }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="p-2">
                {options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenChange(false);
                      option.onClick?.(option.value);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left 
                      hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 rounded-md
                      ${option.danger ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"}
                    `}
                  >
                    {option.icon &&
                      React.createElement(option.icon, { className: "h-4 w-4" })}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

