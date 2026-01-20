import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const SlideInPanel = ({ isOpen, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    let timeout;

    if (isOpen) {
      setIsVisible(true);
      // Reset to hidden first to force animation trigger
      setShowPanel(false);
      timeout = setTimeout(() => setShowPanel(true), 20);
    } else {
      setShowPanel(false);
      timeout = setTimeout(() => setIsVisible(false), 300);
    }

    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          showPanel ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed top-4 bottom-4 right-4 z-50 bg-white rounded-xl shadow-xl max-w-full
          transform transition-transform duration-300 ease-in-out
          ${showPanel ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-base font-semibold text-[#292929]">Panel Title</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(100vh-100px)] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </>
  );
};

export default SlideInPanel;
