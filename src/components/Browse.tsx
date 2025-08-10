import React, { useState, useMemo } from "react";
import { useEffect } from "react";

type Column<T> = {
  header: string;
  accessor: keyof T;
};

type BrowseProps<T> = {
  columns: Column<T>[];
  data: T[];
  footerContent?: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode | ((selectedRows: T[]) => React.ReactNode);
  selectable?: boolean;
};


function Browse<T extends Record<string, any>>({
  columns,
  data,
  footerContent,
  title,
  subtitle,
  headerActions,
  selectable,
}: BrowseProps<T>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const maxVisiblePages = 5;
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  useEffect(() => {
    // Filter out selected rows that are no longer in the data
    setSelectedRows((prevSelected) =>
      prevSelected.filter((row) =>
        data.some((item) => item === row)
      )
    );
  }, [data]);
  
  const toggleRowSelection = (row: T) => {
    setSelectedRows((prev) =>
      prev.includes(row)
        ? prev.filter((r) => r !== row)
        : [...prev, row]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData);
    }
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Global search
    if (search.trim()) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Sorting (with 3-state toggle)
    if (sortBy && sortOrder) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        return sortOrder === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return filtered;
  }, [search, data, sortBy, sortOrder]);


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];
    const left = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const right = Math.min(totalPages, left + maxVisiblePages - 1);

    if (left > 1) pages.push(<span key="start-ellipsis">...</span>);

    for (let i = left; i <= right; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md text-sm ${i === currentPage
            ? "bg-accent text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          {i}
        </button>
      );
    }

    if (right < totalPages) pages.push(<span key="end-ellipsis">...</span>);

    return pages;
  };

  return (
    <div className="w-full h-auto p-4 overflow-auto bg-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        {/* Title and subtitle */}
        <div>
          {title && <h2 className="pl-1 text-2xl font-bold text-gray-600">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>

        {/* Right-side: Search and Header Actions */}
        <div className="flex items-center gap-3 flex-wrap justify-end">

          {/* Header Actions (button, etc.) */}
          {typeof headerActions === "function"
            ? headerActions(selectedRows)
            : headerActions}

          {/* Search bar */}
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-accent text-sm placeholder-gray-400 font-semibold text-dark"
            />
          </div>
        </div>
      </div>


      {/* Table */}
      <div className="w-full overflow-x-auto h-auto">
        <table className="w-full table-auto text-sm border border-gray-200 rounded-lg">

          <thead className="bg-accent text-white">
            <tr>
              {selectable && (
                <th className=" border border-gray-300 hover:cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    className="size-3.5 hover:cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortBy === col.accessor;
                const icon = isSorted
                  ? sortOrder === "asc"
                    ? " ▲"
                    : sortOrder === "desc"
                      ? " ▼"
                      : ""
                  : "";

                return (
                  <th
                    key={col.accessor.toString()}
                    onClick={() => {
                      if (sortBy !== col.accessor) {
                        setSortBy(col.accessor);
                        setSortOrder("asc");
                      } else if (sortOrder === "asc") {
                        setSortOrder("desc");
                      } else if (sortOrder === "desc") {
                        setSortBy(null);
                        setSortOrder(null);
                      } else {
                        setSortOrder("asc");
                      }
                    }}
                    className="px-6 py-3 cursor-pointer select-none font-semibold border border-gray-300 uppercase text-xs tracking-wider"
                  >
                    {col.header}
                    <span className="ml-1">{icon}</span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
          {paginatedData.length > 0 ? (paginatedData.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={rowIdx % 2 === 0 ? "bg-white border border-gray-200" : "bg-gray-100 border border-gray-200"}
              >
                {selectable && (
                  <td className="p-1 border border-gray-200 hover:cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={() => toggleRowSelection(row)}
                      className="size-3.5 hover:cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-4 py-2 text-gray-800 border border-gray-200">
                    {String(row[col.accessor])}
                  </td>
                ))}
              </tr>
            ))): (
              <tr>
                <td colSpan={columns.length} className="text-center p-6 text-red-500">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <p>
          Showing {paginatedData.length} of {filteredData.length} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Footer */}
      {footerContent && (
        <div className="mt-4 text-sm font-medium text-gray-700">
          {footerContent}
        </div>
      )}
    </div>
  );
}

export default Browse;
