import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

const Tooltip = ({
  children,
  content,
  position = "bottom",
  delay = 200,
  className = "",
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);
  const portalRef = useRef(null);

  // Create portal container
  useEffect(() => {
    portalRef.current = document.createElement("div");
    document.body.appendChild(portalRef.current);
    return () => {
      if (portalRef.current) {
        document.body.removeChild(portalRef.current);
      }
    };
  }, []);

  // Position tooltip
  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      let top, left;

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
        default:
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      }

      // Ensure tooltip stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      top = Math.max(8, Math.min(top, viewportHeight - tooltipRect.height - 8));
      left = Math.max(8, Math.min(left, viewportWidth - tooltipRect.width - 8));

      tooltipRef.current.style.top = `${top}px`;
      tooltipRef.current.style.left = `${left}px`;
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isVisible, position]);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getAnimationClass = () => {
    if (!isVisible) return "";
    switch (position) {
      case "top":
        return isVisible ? "tooltip-slide-in-top" : "tooltip-slide-out-top";
      case "bottom":
        return isVisible ? "tooltip-slide-in-bottom" : "tooltip-slide-out-bottom";
      case "left":
        return isVisible ? "tooltip-slide-in-left" : "tooltip-slide-out-left";
      case "right":
        return isVisible ? "tooltip-slide-in-right" : "tooltip-slide-out-right";
      default:
        return isVisible ? "tooltip-slide-in-bottom" : "tooltip-slide-out-bottom";
    }
  };

  const tooltipContent = isVisible ? (
    <div
      ref={tooltipRef}
      className={`absolute z-50 p-2 text-xs text-white bg-[#172b4d]/80 rounded-md font-[580] pointer-events-none transition-all duration-200 ease-out ${getAnimationClass()}`}
      style={{
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {content}
      {/* Arrow */}
      {/* <div
        className={`absolute w-2 h-2 bg-[#172b4d]/90 transform rotate-45 ${
          position === "top"
            ? "top-full -mt-1 left-1/2 -ml-1"
            : position === "bottom"
            ? "bottom-full -mb-1 left-1/2 -ml-1"
            : position === "left"
            ? "left-full -ml-1 top-1/2 -mt-1"
            : "right-full -mr-1 top-1/2 -mt-1"
        }`}
      /> */}
    </div>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={`relative inline-block overflow-visible ${className}`}
      >
        {children}
      </div>
      {portalRef.current && ReactDOM.createPortal(tooltipContent, portalRef.current)}
      <style>{`
        @keyframes tooltipSlideInTop {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes tooltipSlideOutTop {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(8px); }
        }
        @keyframes tooltipSlideInBottom {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes tooltipSlideOutBottom {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes tooltipSlideInLeft {
          0% { opacity: 0; transform: translateX(8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes tooltipSlideOutLeft {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(8px); }
        }
        @keyframes tooltipSlideInRight {
          0% { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes tooltipSlideOutRight {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-8px); }
        }
        .tooltip-slide-in-top {
          animation: tooltipSlideInTop 0.2s ease-out forwards;
        }
        .tooltip-slide-out-top {
          animation: tooltipSlideOutTop 0.2s ease-out forwards;
        }
        .tooltip-slide-in-bottom {
          animation: tooltipSlideInBottom 0.2s ease-out forwards;
        }
        .tooltip-slide-out-bottom {
          animation: tooltipSlideOutBottom 0.2s ease-out forwards;
        }
        .tooltip-slide-in-left {
          animation: tooltipSlideInLeft 0.2s ease-out forwards;
        }
        .tooltip-slide-out-left {
          animation: tooltipSlideOutLeft 0.2s ease-out forwards;
        }
        .tooltip-slide-in-right {
          animation: tooltipSlideInRight 0.2s ease-out forwards;
        }
        .tooltip-slide-out-right {
          animation: tooltipSlideOutRight 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Tooltip;