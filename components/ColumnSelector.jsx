import React, { useRef, useEffect } from "react";

const ColumnSelector = ({ columns, visibleColumns, onChange, isOpen }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        const scrollHeight = contentRef.current.scrollHeight;
        contentRef.current.style.height = `${scrollHeight}px`;
      } else {
        contentRef.current.style.height = "0px";
      }
    }
  }, [isOpen, columns.length]);

  return (
    <div
      ref={contentRef}
      className={`
        overflow-hidden opacity-0 h-0
        bg-white p-2
        transition-[height,opacity] duration-500 ease-in-out
        border-none rounded-none shadow-none
        ${isOpen ? "opacity-100" : ""}
      `}
    >
      <div className="flex flex-wrap w-full items-center space-x-10 min-h-[80px] text-[#172b4d]">
        <h6>Select Columns:</h6>
        {columns.map((col) => (
          <label
            key={col.key}
            className=" flex items-center gap-2 cursor-pointer text-sm  whitespace-nowrap"
          >
            <input
              type="checkbox"
              checked={visibleColumns.includes(col.key)}
              onChange={() => onChange(col.key)}
              className="accent-violet-600"
            />
            {col.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColumnSelector;
