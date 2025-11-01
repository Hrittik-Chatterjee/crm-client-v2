import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

// Sample data type
type Content = {
  id: string;
  businessName: string;
  date: string;
  status: "Done" | "Pending" | "In Progress";
};

// Sample data
const sampleContents: Content[] = [
  {
    id: "1",
    businessName: "Joshan Of Wye",
    date: "30/10/2025",
    status: "Done",
  },
  {
    id: "2",
    businessName: "The Shahin Restaurant",
    date: "30/10/2025",
    status: "Done",
  },
  {
    id: "3",
    businessName: "KESS (Kent Elite Sporting Society)",
    date: "30/10/2025",
    status: "Done",
  },
  {
    id: "4",
    businessName: "KESS (Kent Elite Sporting Society)",
    date: "30/10/2025",
    status: "Done",
  },
];

// Define columns
const columns: ColumnDef<Content>[] = [
  {
    accessorKey: "businessName",
    header: "Business Name",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "Done"
              ? "default"
              : status === "In Progress"
              ? "secondary"
              : "outline"
          }
          className="text-green-600"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "changeStatus",
    header: "Change Status",
    cell: () => {
      return (
        <div className="flex gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive">
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="default">
            Edit
          </Button>
          <Button size="sm" variant="default">
            View
          </Button>
          <Button size="sm" variant="default">
            Delete
          </Button>
        </div>
      );
    },
  },
];

export default function Dashboard() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content {format(date, "dd/MM/yyyy")}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {format(date, "MMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
            />
          </PopoverContent>
        </Popover>
      </div>
      <DataTable
        columns={columns}
        data={sampleContents}
        searchKey="businessName"
        searchPlaceholder="Search business name..."
      />
    </div>
  );
}
