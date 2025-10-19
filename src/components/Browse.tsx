import React, { useState, useMemo } from "react";
import Badge from "./Badge";

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
  headerActions?: React.ReactNode;
  rowActions?: (row: T) => React.ReactNode;
};

function Browse<T extends Record<string, unknown>>({
  columns,
  data,
  footerContent,
  title,
  subtitle,
  headerActions,
  rowActions,
}: BrowseProps<T>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const maxVisiblePages = 5;
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  // 🔍 Filter + sort data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (search.trim()) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

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
              : "bg-white/20 text-gray-800 hover:bg-white/40"
            }`}
        >
          {i}
        </button>
      );
    }

    if (right < totalPages) pages.push(<span key="end-ellipsis">...</span>);
    return pages;
  };

  const renderCell = (row: T, col: Column<T>) => {
    const value = row[col.accessor];
    const header = col.header.toLowerCase();

    if (header.includes("role")) {
      return Array.isArray(value) ? (
        <div className="flex flex-wrap gap-1">
          {value.map((role: string, index: number) => (
            <Badge key={index} text={role} variant="info" />
          ))}
        </div>
      ) : (
        <Badge text={String(value)} variant="info" />
      );
    }

    if (header.includes("status")) {
      const status = String(value).toLowerCase();
      let variant: "success" | "danger" | "warning" | "info" | "neutral" =
        "neutral";
      if (status === "pending") variant = "warning";
      if (status === "rejected") variant = "danger";
      if (status === "paid" || status === "done" || status === "approved" || status === "repayed")
        variant = "success";
      return <Badge text={String(value)} variant={variant} />;
    }

    return String(value);
  };

  return (
    <div className="w-full h-auto p-4 overflow-auto bg-white/40 backdrop-blur-sm rounded-lg border border-white/60 shadow-inner shadow-white/20">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div>
          {title && <h2 className="pl-1 text-2xl font-bold text-dark">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-700">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          {/* 🔹 Global buttons like Add / Refresh */}
          {headerActions}

          {/* 🔍 Search bar */}
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-accent rounded bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent text-sm placeholder-gray-400 font-semibold text-dark"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto h-auto rounded-lg">
        <table className="w-full table-auto text-sm border border-accent rounded-lg">
          <thead className="backdrop-blur-sm bg-accent/60 text-light border-accent border-1 shadow-inner shadow-accent/40 rounded-t-lg">
            <tr>
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
                    className="px-6 py-3 cursor-pointer select-none font-semibold uppercase text-md tracking-wider"
                  >
                    {col.header}
                    <span className="ml-1">{icon}</span>
                  </th>
                );
              })}
              {rowActions && <th className="px-6 py-3 text-md font-semibold uppercase">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`border border-accent/10 transition-colors duration-200 ${rowIdx % 2 === 0 ? "bg-white/80" : "bg-white/60"
                    } hover:bg-white cursor-pointer`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-2 text-gray-800">
                      {renderCell(row, col)}
                    </td>
                  ))}

                  {rowActions && (
                    <td className="px-4 py-2 flex items-center justify-center gap-2">
                      {rowActions(row)}
                    </td>

                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="text-center p-6 text-red-500"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
        <p>
          Showing {paginatedData.length} of {filteredData.length} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 bg-white/20 rounded hover:bg-white/40 disabled:opacity-50"
          >
            Prev
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 bg-white/20 rounded hover:bg-white/40 disabled:opacity-50"
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
