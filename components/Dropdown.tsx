"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DropdownProps {
  options?: DropdownOption[];
  value?: string;
  name?: string;
  onChange: (event: { target: { name?: string; value: string } } | string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  showCheckmark?: boolean;
  maxHeight?: string;
}

function getScrollableAncestors(node: HTMLElement | null): (HTMLElement | Window)[] {
  const scrollables: (HTMLElement | Window)[] = [];
  if (typeof window === 'undefined' || !document.body) return scrollables;
  let parent = node?.parentElement;
  while (parent && parent !== document.body) {
    const style = getComputedStyle(parent);
    if (/(auto|scroll)/.test(style.overflow + style.overflowY + style.overflowX)) {
      scrollables.push(parent);
    }
    parent = parent.parentElement;
  }
  scrollables.push(window);
  return scrollables;
}

export default function Dropdown({
  options = [],
  value,
  name,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  icon: Icon,
  showCheckmark = true,
  maxHeight = "200px",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const normalizedSearchTerm = String(searchTerm ?? "").toLowerCase();

  const filteredOptions = options.filter((opt) =>
    String(opt.label ?? "").toLowerCase().includes(normalizedSearchTerm)
  );

  const updateMenuPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight || 200;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let newTop = rect.bottom + window.scrollY;
      let upwards = false;

      if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
        upwards = true;
        newTop = rect.top + window.scrollY - menuHeight;
      }

      setOpenUpwards(upwards);
      setMenuPosition({
        top: newTop,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
    const scrollables = getScrollableAncestors(dropdownRef.current);
    const handleScrollOrResize = () => updateMenuPosition();

    scrollables.forEach((el) => {
      if (el instanceof Window) {
        el.addEventListener("scroll", handleScrollOrResize, true);
      } else {
        el.addEventListener("scroll", handleScrollOrResize, true);
      }
    });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      scrollables.forEach((el) => {
        if (el instanceof Window) {
          el.removeEventListener("scroll", handleScrollOrResize, true);
        } else {
          el.removeEventListener("scroll", handleScrollOrResize, true);
        }
      });
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (!selectedOption) setSearchTerm("");
        else setSearchTerm(String(selectedOption.label ?? ""));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption]);

  useEffect(() => {
    if (!isOpen && selectedOption) {
      setSearchTerm(String(selectedOption.label ?? ""));
    }
  }, [isOpen, selectedOption]);

  const handleSelect = (option: DropdownOption) => {
    if (name) {
      onChange({ target: { name, value: option.value } });
    } else {
      onChange(option.value);
    }
    setIsOpen(false);
    setSearchTerm(String(option.label ?? ""));
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      setSearchTerm("");
    }
  };

  const dynamicPlaceholder =
    isOpen && selectedOption ? String(selectedOption.label ?? "") : placeholder;

  return (
    <>
      <div className={`relative ${className}`} ref={dropdownRef}>
        <div className="relative w-full">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon className="h-4 w-4 text-slate-400" />
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            placeholder={dynamicPlaceholder}
            disabled={disabled}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            className={`
              w-full px-3 py-2 ${Icon ? "pl-10" : ""} pr-9 rounded-lg bg-surface-light border border-border-light text-sm
              focus:ring-2 focus:border-transparent focus:ring-primary/40 focus:outline-none
              placeholder-slate-400
              cursor-default
              text-slate-900
              transition-colors
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          />
          <ChevronDown
            className={`absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {typeof window !== 'undefined' && document.body && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              key="dropdown-menu"
              initial={{ opacity: 0, y: openUpwards ? 10 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: openUpwards ? 10 : -10 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              className={`fixed z-50 bg-surface-light rounded-lg shadow-lg overflow-hidden border border-border-light ${
                openUpwards ? "mb-2" : "mt-2"
              }`}
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                width: menuPosition.width,
                maxHeight,
              }}
            >
              <div className="overflow-y-auto" style={{ maxHeight }}>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left
                        hover:bg-slate-100/70 transition-colors duration-300
                        ${
                          value === option.value
                            ? "bg-primary/5 text-primary"
                            : "text-slate-900"
                        }
                        ${index === 0 ? "rounded-t-lg" : ""}
                        ${index === filteredOptions.length - 1 ? "rounded-b-lg" : ""}
                      `}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {option.icon &&
                          React.createElement(option.icon, {
                            className: "h-4 w-4",
                          })}
                        <span className="truncate">{option.label}</span>
                      </div>
                      {showCheckmark && value === option.value && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-slate-500 text-sm text-center">
                    No items found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

