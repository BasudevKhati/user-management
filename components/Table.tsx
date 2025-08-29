"use client";

import { Table, Pagination } from "semantic-ui-react";
import { useState } from "react";
import Link from "next/link";

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
}

export default function DataTable<T extends { id?: number | string }>({
  data,
  columns,
  itemsPerPage = 5,
}: DataTableProps<T>) {
  const [activePage, setActivePage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (
    _e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: import("semantic-ui-react").PaginationProps
  ) => {
    if (typeof data.activePage === "number") {
      setActivePage(data.activePage);
    }
  };

  const startIdx = (activePage - 1) * itemsPerPage;
  const currentData = data.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div>
      <Table celled striped selectable>
        <Table.Header>
          <Table.Row style={{ backgroundColor: "#e2e8f0" }}>
            {columns.map((col) => (
              <Table.HeaderCell key={String(col.key)}>
                {col.header}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {currentData.map((row) => (
            <Table.Row key={row.id}>
              {columns.map((col) => (
                <Table.Cell key={String(col.key)}>
                  {col.render ? (
                    col.render(row)
                  ) : col.key === "name" ? (
                    <Link
                      href={`/users/${row.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {String(row[col.key])}
                    </Link>
                  ) : (
                    (row[col.key] as React.ReactNode)
                  )}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination
            activePage={activePage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
