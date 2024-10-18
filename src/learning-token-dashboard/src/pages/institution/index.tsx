import React, { useEffect, useState } from "react";
import { Loader, Toggle } from "rsuite";
import {
  useLazyGetInstitutionQuery,
  useSmartContractCallMutation,
  useUpdateInstitutionStatusMutation,
} from "../../store/features/admin/adminApi";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { CaretSortIcon } from "@radix-ui/react-icons";

const Institution: React.FC = () => {
  const [getInstitution, { data, isLoading }] = useLazyGetInstitutionQuery();
  const [updateInstitutionStatus] = useUpdateInstitutionStatusMutation();
  const [smartContractCall] = useSmartContractCallMutation();
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    getInstitution({});
  }, []);

  const toggleStatus = async (rowData: any) => {
    console.log(rowData);
    smartContractCall({
      isAdmin: false,
      isView: false,
      isWrite: true,
      type: "institution",
      id: rowData.id,
      functionName: "addInstitutionToInstitution",
      params: [rowData.publicAddress, Date.now()],
    }).then(() => {
      updateInstitutionStatus(rowData);
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Id
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "publicAddress",
      header: "Public Address",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Toggle
          checked={row.original.status}
          onClick={() => toggleStatus(row.original)}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: data?.result?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="py-3">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Institution;
