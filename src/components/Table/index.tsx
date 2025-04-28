import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

interface TableProps<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  rowsPerPage: number;
  columns: {
    key: string;
    label: string;
    format?: (value: T[keyof T]) => string;
  }[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export function Table<T>({
  data,
  totalItems,
  currentPage,
  rowsPerPage,
  columns,
  onPageChange,
  onRowsPerPageChange,
}: TableProps<T>) {
  const totalPages = useMemo(
    () => Math.ceil(totalItems / rowsPerPage),
    [totalItems, rowsPerPage]
  );

  const nextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const firstItemIndex = (currentPage - 1) * rowsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * rowsPerPage, totalItems);

  const paginatedData = useMemo(
    () =>
      data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [data, currentPage, rowsPerPage]
  );

  return (
    <div className="space-y-4">
      <TableComponent>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.format
                    ? column.format(row[column.key as keyof T])
                    : String(row[column.key as keyof T])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableComponent>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div>
            Exibindo {firstItemIndex}-{lastItemIndex} de {totalItems} itens
          </div>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="ml-2 p-1 border rounded-md"
          >
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>

        <div>
          Página {currentPage} de {totalPages}
        </div>
      </div>
    </div>
  );
}
