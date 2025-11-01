import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Filter, Check, ChevronDown } from "lucide-react";

// Sample data type
type Content = {
  id: string;
  businessName: string;
  date: string;
  status: "Done" | "Pending" | "In Progress";
};

// Sample businesses list
const businesses = [
  "All Businesses",
  "Joshan Of Wye",
  "The Shahin Restaurant",
  "KESS (Kent Elite Sporting Society)",
];

// Status list for filtering
const statuses = ["Done", "Pending"];

// Sample data with mutable status for demonstration
const initialContents: Content[] = [
  {
    id: "1",
    businessName: "Joshan Of Wye",
    date: "30/10/2025",
    status: "Pending",
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

// StatusSwitch component for each row
function StatusSwitch({
  initialStatus,
  onStatusChange,
}: {
  initialStatus: string;
  onStatusChange: (newStatus: "Done" | "Pending") => void;
}) {
  const [checked, setChecked] = useState<boolean>(initialStatus === "Done");

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    onStatusChange(newChecked ? "Done" : "Pending");
  };

  return (
    <div className="flex justify-center">
      <div className="relative inline-grid h-8 grid-cols-[1fr_1fr] items-center text-sm font-medium shadow-sm">
        <Switch
          checked={checked}
          onCheckedChange={handleChange}
          className="peer absolute inset-0 h-[inherit] w-auto rounded-lg border-2 data-[state=unchecked]:bg-linear-to-r data-[state=unchecked]:from-red-50 data-[state=unchecked]:to-red-100 dark:data-[state=unchecked]:from-red-950/40 dark:data-[state=unchecked]:to-red-900/40 data-[state=unchecked]:border-red-200 dark:data-[state=unchecked]:border-red-800 data-[state=checked]:bg-linear-to-r data-[state=checked]:from-green-100 data-[state=checked]:to-green-200 dark:data-[state=checked]:bg-linear-to-r dark:data-[state=checked]:from-green-950 dark:data-[state=checked]:to-emerald-950 data-[state=checked]:border-green-300 dark:data-[state=checked]:border-green-900 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:shadow-md [&_span]:transition-all [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:bg-slate-700 dark:[&_span]:bg-neutral-800 [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full hover:shadow-md transition-shadow"
          thumbClassName="!bg-slate-300 data-[state=checked]:!bg-slate-300 data-[state=unchecked]:!bg-slate-300 dark:!bg-slate-700 dark:data-[state=checked]:!bg-slate-700 dark:data-[state=unchecked]:!bg-slate-700"
        />
        <span className="pointer-events-none relative ms-1 flex items-center justify-center px-3 text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
          <span className="text-[11px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
            Pending
          </span>
        </span>
        <span className="pointer-events-none relative me-1 flex items-center justify-center px-3 text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
          <span className="text-[11px] font-bold uppercase tracking-wide text-green-600 dark:text-white drop-shadow">
            Done
          </span>
        </span>
      </div>
    </div>
  );
}

// Define columns - will be created inside component to access state
const createColumns = (
  handleStatusChange: (id: string, newStatus: "Done" | "Pending") => void
): ColumnDef<Content>[] => [
  {
    accessorKey: "businessName",
    header: () => <div className="text-center">Business Name</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("businessName")}</div>;
    },
  },
  {
    accessorKey: "date",
    header: () => <div className="text-center">Date</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("date")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="text-center">
          <Badge
            variant={status === "Done" ? "default" : "outline"}
            className={
              status === "Done"
                ? "min-w-20 inline-flex justify-center bg-green-100 text-green-700 hover:bg-green-200 border-green-300 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-950/60 dark:border-green-800"
                : status === "In Progress"
                ? "min-w-20 inline-flex justify-center bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-400 dark:hover:bg-yellow-950/60 dark:border-yellow-800"
                : "min-w-20 inline-flex justify-center bg-red-100 text-red-700 hover:bg-red-200 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60 dark:border-red-800"
            }
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "changeStatus",
    header: () => <div className="text-center">Change Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <StatusSwitch
          initialStatus={status}
          onStatusChange={(newStatus) =>
            handleStatusChange(row.original.id, newStatus)
          }
        />
      );
    },
  },
  {
    id: "action",
    header: () => <div className="text-center">Action</div>,
    cell: () => {
      return (
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 dark:hover:border-blue-600"
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-green-50 hover:text-green-600 hover:border-green-600 dark:hover:bg-green-950/40 dark:hover:text-green-400 dark:hover:border-green-600"
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 dark:hover:border-red-600"
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];

export default function Dashboard() {
  const [date, setDate] = useState<Date>(new Date());
  const [contents, setContents] = useState<Content[]>(initialContents);
  const [selectedBusiness, setSelectedBusiness] = useState<string>("All Businesses");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isBusinessSheetOpen, setIsBusinessSheetOpen] = useState(false);

  const handleStatusChange = (id: string, newStatus: "Done" | "Pending") => {
    setContents((prevContents) =>
      prevContents.map((content) =>
        content.id === id ? { ...content, status: newStatus } : content
      )
    );
  };

  const handleBusinessSelect = (business: string) => {
    setSelectedBusiness(business);
    setIsBusinessSheetOpen(false);
  };

  const handleStatusSelect = (status: string | null) => {
    setSelectedStatus(status);
  };

  // Filter contents based on selected business and status
  let filteredContents = contents;

  if (selectedBusiness !== "All Businesses") {
    filteredContents = filteredContents.filter(content => content.businessName === selectedBusiness);
  }

  if (selectedStatus) {
    filteredContents = filteredContents.filter(content => content.status === selectedStatus);
  }

  const columns = createColumns(handleStatusChange);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border">
        <div>
          <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Content
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {format(date, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[200px] justify-start text-left font-normal hover:bg-white hover:border-blue-600 transition-all dark:hover:bg-blue-950/40 dark:hover:border-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
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
        data={filteredContents}
        searchKey="businessName"
        searchPlaceholder="Search business name..."
        showColumnToggle={false}
        filterButtons={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 hover:bg-white hover:border-blue-600 transition-all dark:hover:bg-blue-950/40 dark:hover:border-blue-600"
                >
                  <Filter className="h-4 w-4" />
                  {selectedStatus ? `Status: ${selectedStatus}` : "Filter by Status"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleStatusSelect(null)}
                  className={`cursor-pointer ${
                    !selectedStatus
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                      : ""
                  }`}
                >
                  <span className="flex items-center justify-between w-full">
                    All Status
                    {!selectedStatus && <Check className="h-4 w-4" />}
                  </span>
                </DropdownMenuItem>
                {statuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                    className={`cursor-pointer ${
                      selectedStatus === status
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                        : ""
                    }`}
                  >
                    <span className="flex items-center justify-between w-full">
                      {status}
                      {selectedStatus === status && <Check className="h-4 w-4" />}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet open={isBusinessSheetOpen} onOpenChange={setIsBusinessSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 hover:bg-white hover:border-blue-600 transition-all dark:hover:bg-blue-950/40 dark:hover:border-blue-600"
                >
                  <Filter className="h-4 w-4" />
                  {selectedBusiness === "All Businesses" ? "Filter by Business" : selectedBusiness}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Filter by Business</SheetTitle>
                  <SheetDescription>
                    Select a business to filter the content table
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {businesses.map((business) => (
                    <button
                      key={business}
                      onClick={() => handleBusinessSelect(business)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                        selectedBusiness === business
                          ? "bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-950/40 dark:border-blue-600 dark:text-blue-400"
                          : "bg-card border-border hover:bg-accent hover:border-accent-foreground/20"
                      }`}
                    >
                      <span className="font-medium">{business}</span>
                      {selectedBusiness === business && (
                        <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </>
        }
      />
    </div>
  );
}
