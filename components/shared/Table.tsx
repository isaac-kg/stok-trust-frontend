import React from 'react';
import { cn } from '@/lib/utils';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  headerClassName?: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: string | ((row: T) => string);
}

export default function Table<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No records found.',
  onRowClick,
  rowClassName,
}: TableProps<T>): React.ReactElement {
  const getValue = (row: T, key: keyof T | string): unknown => {
    return row[key as keyof T];
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600',
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const customRowClass =
                  typeof rowClassName === 'function'
                    ? rowClassName(row)
                    : rowClassName;

                return (
                  <tr
                    key={index}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'transition-colors hover:bg-slate-50',
                      onRowClick && 'cursor-pointer',
                      customRowClass
                    )}
                  >
                    {columns.map((column) => {
                      const value = getValue(row, column.key);

                      return (
                        <td
                          key={String(column.key)}
                          className={cn(
                            'px-4 py-4 text-sm text-slate-700',
                            column.className
                          )}
                        >
                          {column.render
                            ? column.render(value, row, index)
                            : String(value ?? '-')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}