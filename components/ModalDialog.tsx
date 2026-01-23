"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  mode?: "center" | "bottom";
  width?: "sm" | "md" | "lg" | "xl" | "full";
  scrollContent?: boolean;
  clickOutside?: boolean;
}

export default function ModalDialog({
  isOpen,
  onClose,
  title,
  children,
  mode,
  width = "lg",
  scrollContent = true,
  clickOutside = false,
}: ModalDialogProps) {
  const [detectedMode, setDetectedMode] =
    useState<"center" | "bottom">("center");

  const [shouldRender, setShouldRender] = useState(isOpen);

  /* --------------------------------------------
   Detect mobile → bottom sheet
  --------------------------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(max-width: 640px)");

    const handleResize = () => {
      if (!mode) {
        setDetectedMode(mql.matches ? "bottom" : "center");
      }
    };

    handleResize();
    mql.addEventListener("change", handleResize);
    return () => mql.removeEventListener("change", handleResize);
  }, [mode]);

  const actualMode = mode || detectedMode;
  const allowClickOutside = actualMode === "bottom" ? true : clickOutside;

  /* --------------------------------------------
   Mount / unmount control (KEY FIX)
  --------------------------------------------- */
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  /* --------------------------------------------
   Lock body scroll
  --------------------------------------------- */
  useEffect(() => {
    if (!shouldRender) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [shouldRender]);

  /* --------------------------------------------
   Width handling
  --------------------------------------------- */
  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "w-full",
  };

  const modalWidth = widthClasses[width];

  /* --------------------------------------------
   Close request (NO unmount here)
  --------------------------------------------- */
  const requestClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShouldRender(false);
  };

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (!shouldRender) onClose();
      }}
    >
      {shouldRender && (
        <motion.div
          className="fixed z-50 -inset-6 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={allowClickOutside ? requestClose : undefined}
        >
          {actualMode === "center" ? (
            <div className="flex items-center justify-center min-h-screen p-4 overflow-y-auto">
              <motion.div
                className={`relative w-full ${modalWidth} bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Header title={title} onClose={requestClose} />

                <div
                  className={`px-6 py-4 ${
                    scrollContent ? "overflow-auto max-h-[80vh]" : ""
                  }`}
                >
                  {children}
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 rounded-t-lg shadow-2xl max-h-[90vh] flex flex-col sm:max-w-md sm:mx-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <BottomHeader title={title} onClose={requestClose} />
              <div className={`flex-1 overflow-y-auto px-4 pt-2 ${scrollContent ? "pb-6" : "pb-safe"}`}>
                {children}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------------------
  Headers
--------------------------------------------- */

function Header({
  title,
  onClose,
}: {
  title?: string;
  onClose: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-6 pt-4 pb-2 bg-white border-b rounded-t-lg dark:bg-slate-800 border-slate-100 dark:border-slate-700">
      {title && (
        <div className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </div>
      )}
      <button onClick={onClose} aria-label="Close">
        <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
      </button>
    </div>
  );
}

function BottomHeader({
  title,
  onClose,
}: {
  title?: string;
  onClose: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 pt-3 pb-2 bg-white dark:bg-slate-800">
      <div className="w-12 h-[2px] bg-slate-300 rounded-full mx-auto mb-2" />
      <div className="flex items-center justify-between px-4">
        <div className="flex-1 text-sm font-semibold text-center">
          {title}
        </div>
        <button onClick={onClose} aria-label="Close">
          <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
        </button>
      </div>
    </div>
  );
}
