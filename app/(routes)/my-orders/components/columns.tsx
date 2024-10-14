"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  status: "Pending" | "Shipping" | "Completed"; // Specify the status types
  totalPrice: string;
  products: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }: any) => (row.original.isPaid ? "Yes" : "No"),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
