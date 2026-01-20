import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  progress = null, // number 0–1 or null
}) {
  const [open, setOpen] = useState(defaultOpen);

  function CircularProgress({
    value,
    size = 40,
    stroke = 3,
    color = "#560fd1",
    bg = "#e5e7eb",
  }) {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;

    const motionVal = useMotionValue(value); // initialize with current value
    const prevValue = useRef(value);

    // Animate only when value changes
    useEffect(() => {
      if (value !== prevValue.current) {
        animate(motionVal, value, { duration: 0.8, ease: "easeInOut" });
        prevValue.current = value;
      }
    }, [value]);

    const strokeOffset = useTransform(
      motionVal,
      (v) => circumference * (1 - v)
    );

    const displayedPercent = Math.round(value * 100);

    return (
      <div
        className="relative flex items-center justify-center ml-2"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="absolute top-0 left-0">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={bg}
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            style={{ strokeDashoffset: strokeOffset }}
            strokeLinecap="round"
          />
        </svg>
        <span className={`text-[10px] font-medium ${displayedPercent==0?'text-gray-400':'text-[#560fd1]'} absolute`}>
          {displayedPercent}%
        </span>
      </div>
    );
  }

  return (
    <div className="mb-4 bg-white rounded-lg py-2">
      <button
        type="button"
        className="flex items-center w-full text-sm text-left font-semibold text-[#172b4d] py-2 px-4 justify-between"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex items-center">
          <motion.span
            animate={{ rotate: open ? -90 : 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            <ChevronRight strokeWidth={1.5} />
          </motion.span>
          <span className="ml-2">{title}</span>
        </span>
        {typeof progress === "number" && progress >= 0 && progress <= 1 && (
          <CircularProgress value={progress} />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
