"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

type TooltipPosition = "top" | "bottom" | "left" | "right";

export default function Tooltip({
  children,
  content,
  position = "right",
  delay = 120,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  disabled?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    portalRef.current = document.createElement("div");
    document.body.appendChild(portalRef.current);
    return () => {
      if (portalRef.current) document.body.removeChild(portalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const tooltipRect = tooltipRef.current!.getBoundingClientRect();

      let top = triggerRect.bottom + 8;
      let left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;

      switch (position) {
        case "top":
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "left":
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case "right":
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + 8;
          break;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      top = Math.max(8, Math.min(top, vh - tooltipRect.height - 8));
      left = Math.max(8, Math.min(left, vw - tooltipRect.width - 8));

      tooltipRef.current!.style.top = `${top}px`;
      tooltipRef.current!.style.left = `${left}px`;
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isVisible, position]);

  const show = () => {
    if (disabled) return;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const tooltipNode = isVisible ? (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] px-2.5 py-1.5 text-xs font-semibold text-white bg-slate-900/90 rounded-md border border-white/10 shadow-lg pointer-events-none"
      style={{ whiteSpace: "nowrap" }}
    >
      {content}
    </div>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className={`relative inline-block ${className}`}
      >
        {children}
      </div>
      {portalRef.current && ReactDOM.createPortal(tooltipNode, portalRef.current)}
    </>
  );
}


