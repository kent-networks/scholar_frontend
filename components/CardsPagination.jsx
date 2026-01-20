import React from "react";
import Dropdown from "./Dropdown";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const CardsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalResults,
  currentDataLength,
  className = "",
}) => {
  if (totalPages <= 0) {
    // console.log("🚫 CardsPagination hidden: totalPages <= 0");
    return null;
  }

  const cardsPerPageOptions = [
    { value: 8, label: "8" },
    { value: 16, label: "16" },
    { value: 24, label: "24" },
    { value: 32, label: "32" },
  ];

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = Math.min(totalPages, 5);
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    if (startPage + maxPages - 1 > totalPages) {
      startPage = Math.max(1, totalPages - maxPages + 1);
    }
    for (let i = startPage; i < startPage + maxPages && i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 justify-between items-center mt-4 gap-2 md:gap-0 px-4 pb-4 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2 md:mb-0">
        <span className="text-xs text-[#172b4d]">Cards per page:</span>
        <Dropdown
          options={cardsPerPageOptions}
          value={itemsPerPage} // Pass number directly
          onChange={(value) => {
            const newLimit = parseInt(value);
            // console.log("Items per page changed to:", newLimit);
            if (!isNaN(newLimit)) {
              onItemsPerPageChange(newLimit);
              onPageChange(1);
            }
          }}
          className="w-[80px]"
        />
      </div>
      <div className="text-xs text-[#172b4d] mb-2 md:mb-0 flex justify-center">
        Showing{" "}
        {currentDataLength === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalResults)} of&nbsp;
        <span className="font-bold">{totalResults}</span>&nbsp; results
      </div>
      <div className="flex justify-center md:justify-end items-center gap-2 col-span-2 sm:col-span-1">
        <button
          type="button"
          onClick={() => {
            // console.log("Go to first page");
            onPageChange(1);
          }}
          disabled={currentPage === 1}
          className="p-1 border border-[#560fd1] rounded-lg bg-white 
          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
          text-[#560fd1] hover:bg-[#560fd1] hover:text-white"
        >
          <ChevronsLeft size={16} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => {
            // console.log("Go to previous page");
            onPageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className="p-1 border border-[#560fd1] rounded-lg bg-white 
          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
          text-[#560fd1] hover:bg-[#560fd1] hover:text-white"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        {getPageNumbers().map((pageNum) => (
          <button
            type="button"
            key={pageNum}
            onClick={() => {
              // console.log("Page button clicked:", pageNum);
              onPageChange(pageNum);
            }}
            className={`w-[26px] h-[26px] rounded-lg text-sm border transition-all duration-300 ${
              currentPage === pageNum
                ? "bg-[#560fd1] text-white border-[#560fd1]"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        ))}
        {totalPages > 5 && currentPage + 2 < totalPages && (
          <span className="px-3 py-1 text-gray-500">...</span>
        )}
        <button
          type="button"
          onClick={() => {
            // console.log("Go to next page");
            onPageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          className="p-1 border border-[#560fd1] rounded-lg bg-white 
          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
          text-[#560fd1] hover:bg-[#560fd1] hover:text-white"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => {
            // console.log("Go to last page");
            onPageChange(totalPages);
          }}
          disabled={currentPage === totalPages}
          className="p-1 border border-[#560fd1] rounded-lg bg-white 
          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
          text-[#560fd1] hover:bg-[#560fd1] hover:text-white"
        >
          <ChevronsRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default CardsPagination;
