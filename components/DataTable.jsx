import React from "react";
import Dropdown from "./Dropdown";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchX,
} from "lucide-react";
import { toTitleCase } from "../utils/stringUtils";

const DataTable = ({
  loading = false,
  data = [],
  selectedRows = [],
  onSelectAll = () => {},
  onSelectRow = () => {},
  onRowClick = () => {},
  onRowDoubleClick = () => {},
  columns = [], // [{ key, label, render?: (row) => ReactNode, width?: string }]
  visibleColumns = [],
  sortConfig = {},
  onSort = () => {},
  getSortIcon = () => null,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  itemsPerPage = 10,
  onItemsPerPageChange = () => {},
  itemsPerPageOptions = [10, 20, 50],
  totalResults = 0,
  emptyState = null,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Horizontal scrolling container */}
      <div className="w-full overflow-x-auto">
        {/* Table with fixed layout and minimum width */}
        <table className="w-full min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* Checkbox column header */}
              <th className="px-4 py-3 text-left w-12">
                <div className="flex items-center">
                  {/* {loading ? (
                    <div className="w-4 h-4 border-2 border-[#560fd1] border-t-transparent rounded-full animate-spin"></div>
                  ) : (

                  )} */}
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === data.length && data.length > 0
                    }
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 transition-all duration-300"
                  />
                </div>
              </th>

              {/* Regular columns */}
              {columns
                .filter((col) => visibleColumns.includes(col.key))
                .map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-xs font-semibold text-[#172b4d] uppercase tracking-wider cursor-pointer select-none whitespace-nowrap ${
                      col.width || "min-w-[100px]"
                    }`}
                    onClick={() => onSort(col.key)}
                    style={{ width: col.width || "auto" }}
                  >
                    <div className="flex items-center">
                      {col.label}
                      {getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + 1}
                  className="px-4 py-8 text-center"
                >
                  <div className="flex items-center justify-center h-32">
                    <div className="flex flex-col items-center gap-2 bg-white bg-opacity-75 p-4 rounded-lg">
                      <div className="w-12 h-12 border-[1.5px]  border-[#560fd1] border-y-0 rounded-full animate-spin"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + 1}
                  className="px-4 py-8 text-center"
                >
                  {emptyState || (
                    <div className="text-center py-8">
                      <div className="flex w-full justify-center text-4xl mb-3 text-[#560fd1]">
                        <div
                          className="
                            flex items-center justify-center h-14 w-14 rounded-full
                            bg-gradient-to-br from-blue-100 to-purple-200
                          "
                        >
                          <span role="img" aria-label="No data">
                            <SearchX />
                          </span>
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-[#172b4d] mb-1">
                        No data found
                      </h3>
                      <p className="text-xs text-gray-500">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className={`transition-colors duration-300 cursor-pointer ${
                    selectedRows.includes(row.id)
                      ? "bg-[#560fd10d] hover:bg-[#560fd125]"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => onRowClick(row.id)}
                  onDoubleClick={() => onRowDoubleClick(row.id)}
                >
                  {/* Checkbox column cell */}
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => onSelectRow(row.id, e.target.checked)}
                        className="w-4 h-4 text-[#560fd1] bg-gray-100 border-gray-300 rounded focus:ring-[#560fd1] focus:ring-2 transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </td>

                  {/* Regular columns */}
                  {columns
                    .filter((col) => visibleColumns.includes(col.key))
                    .map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 whitespace-nowrap ${
                          col.width || "min-w-[100px]"
                        }`}
                        style={{ width: col.width || "auto" }}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="grid grid-cols-2 sm:grid-cols-3 justify-between items-center mt-4 gap-2 md:gap-0 px-4 pb-4">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <span className="text-xs text-[#172b4d]">Rows per page:</span>
          <Dropdown
            options={itemsPerPageOptions.map((v) => ({ label: v, value: v }))}
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
            width="80px"
            className="w-[80px]"
          />
        </div>
        <div className="text-xs text-[#172b4d] mb-2 md:mb-0 flex justify-center">
          Showing {data.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}{" "}
          to {Math.min(currentPage * itemsPerPage, totalResults)} of&nbsp;
          <span className="font-bold"> {totalResults}</span>&nbsp; results
        </div>
        <div className="flex justify-center md:justify-end items-center gap-2 col-span-2 sm:col-span-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1 border border-[#560fd1] rounded-lg bg-white 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
            text-[#560fd1]"
          >
            <ChevronsLeft size={16} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 border border-[#560fd1] rounded-lg bg-white 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
            text-[#560fd1]"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          {[...Array(Math.min(totalPages, 5))].map((_, i) => {
            let pageNum = i + 1;
            if (totalPages > 5 && currentPage > 3) {
              if (currentPage + 2 > totalPages) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
            }
            if (pageNum < 1 || pageNum > totalPages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-[26px] h-[26px] rounded-lg text-sm border transition-all duration-300 ${
                  currentPage === pageNum
                    ? "bg-[#560fd1] text-white border-[#560fd1]"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && currentPage + 2 < totalPages && (
            <span className="px-3 py-1 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 border border-[#560fd1] rounded-lg bg-white 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
            text-[#560fd1]"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 border border-[#560fd1] rounded-lg bg-white 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
            text-[#560fd1]"
          >
            <ChevronsRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
