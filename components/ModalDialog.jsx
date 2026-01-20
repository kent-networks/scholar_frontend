import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * ModalDialog with smart mode detection:
 * - If no `mode` prop is passed, switches to `bottom` on small screens automatically.
 */
const ModalDialog = ({
  isOpen,
  onClose,
  title,
  children,
  mode, // optional: 'center' | 'bottom'
  width = "lg",
  scrollContent = true,
  clickOutside = false,
}) => {
  const dialogRef = useRef(null);
  const [detectedMode, setDetectedMode] = useState("center");

  // Detect screen size and decide mode dynamically
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");

    const handleResize = () => {
      if (!mode) {
        setDetectedMode(mql.matches ? "bottom" : "center");
      }
    };

    handleResize(); // initial
    mql.addEventListener("change", handleResize);

    return () => mql.removeEventListener("change", handleResize);
  }, [mode]);

  const actualMode = mode || detectedMode;
  const allowClickOutside = actualMode === "bottom" ? true : clickOutside;

  useEffect(() => {
    const handleClick = (e) => {
      if (
        allowClickOutside &&
        dialogRef.current &&
        !dialogRef.current.contains(e.target)
      ) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClick);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClick);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, onClose, allowClickOutside]);

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "w-full",
  };

  const modalWidth = widthClasses[width] || width;
  const autoScrollContent = actualMode === "bottom" || scrollContent;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {actualMode === "center" ? (
              <div className="flex items-center justify-center min-h-screen p-4">
                <motion.div
                  ref={dialogRef}
                  className={`bg-white rounded-lg shadow-2xl p-0 relative w-full ${modalWidth} flex flex-col`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                >
                  <div className="sticky rounded-t-lg top-0 left-0 right-0 bg-white z-10 px-6 pt-6 pb-2 flex items-center justify-between border-b border-gray-100">
                    {title && (
                      <div className="text-sm font-semibold text-[#172b4d]">
                        {title}
                      </div>
                    )}
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 text-lg font-semibold transition-all duration-300 z-10 ml-4"
                    >
                      <X size={24} strokeWidth={1.5} />
                    </button>
                  </div>
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
                ref={dialogRef}
                className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-lg shadow-2xl mx-auto w-full sm:max-w-md sm:mx-auto max-h-[90vh] overflow-y-auto"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                style={{ touchAction: "none" }}
              >
                <div className="w-12 h-[2px] bg-gray-300 rounded-full mx-auto mt-3 mb-2" />
                {title && (
                  <div className="text-center font-semibold text-sm mb-2 text-[#292929]">
                    {title}
                  </div>
                )}
                <div className="px-4 pb-6 pt-2">{children}</div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalDialog;
