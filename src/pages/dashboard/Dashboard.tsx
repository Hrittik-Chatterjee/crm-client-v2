import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ViewContentDialog } from "@/components/ViewContentDialog";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";
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
import { useGetAllBusinessesQuery } from "@/redux/features/business/businessApi";
import {
  useGetAllRegularContentsQuery,
  useUpdateRegularContentMutation,
  useDeleteRegularContentMutation,
  RegularContent,
  contentApi,
} from "@/redux/features/content/contentApi";
import { useAppDispatch } from "@/redux/hook";

// Content type for table display
type Content = {
  id: string;
  businessName: string;
  date: string;
  status: boolean;
  contentType: string;
  postMaterial?: string;
  tags?: string;
  videoMaterial?: string;
  vision?: string;
  posterMaterial?: string;
  comments?: string;
};

console.log("from dashboard");

// Status list for filtering
const statuses = ["Done", "Pending"];

// StatusSwitch component for each row
function StatusSwitch({
  initialStatus,
  onStatusChange,
}: {
  initialStatus: boolean;
  onStatusChange: (newStatus: boolean) => void;
}) {
  const [checked, setChecked] = useState<boolean>(initialStatus);

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    onStatusChange(newChecked);
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
  handleStatusChange: (id: string, newStatus: boolean) => void,
  handleView: (content: Content) => void,
  handleDelete: (id: string) => void
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
    accessorKey: "contentType",
    header: () => <div className="text-center">Content Type</div>,
    cell: ({ row }) => {
      const contentType = row.getValue("contentType") as string;
      return (
        <div className="text-center">
          <Badge
            variant="outline"
            className="min-w-20 inline-flex justify-center bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300 dark:bg-purple-950/40 dark:text-purple-400 dark:hover:bg-purple-950/60 dark:border-purple-800"
          >
            {contentType.toUpperCase()}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean;
      return (
        <div className="text-center">
          <Badge
            variant={status ? "default" : "outline"}
            className={
              status
                ? "min-w-20 inline-flex justify-center bg-green-100 text-green-700 hover:bg-green-200 border-green-300 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-950/60 dark:border-green-800"
                : "min-w-20 inline-flex justify-center bg-red-100 text-red-700 hover:bg-red-200 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60 dark:border-red-800"
            }
          >
            {status ? "Done" : "Pending"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "changeStatus",
    header: () => <div className="text-center">Change Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean;
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
    cell: ({ row }) => {
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
            onClick={() => handleView(row.original)}
            className="hover:bg-green-50 hover:text-green-600 hover:border-green-600 dark:hover:bg-green-950/40 dark:hover:text-green-400 dark:hover:border-green-600"
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(row.original.id)}
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
  const [selectedBusiness, setSelectedBusiness] =
    useState<string>("All Businesses");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isBusinessSheetOpen, setIsBusinessSheetOpen] = useState(false);
  const [viewContent, setViewContent] = useState<Content | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // RTK Query hooks - Use backend date filtering for better performance with large datasets
  const dispatch = useAppDispatch();
  const { data: businessesData, isLoading: isLoadingBusinesses } =
    useGetAllBusinessesQuery();
  const { data: contentsData, isLoading: isLoadingContents } =
    useGetAllRegularContentsQuery({
      date: format(date, "MM/dd/yyyy"),
    });
  const [updateContent] = useUpdateRegularContentMutation();
  const [deleteContent] = useDeleteRegularContentMutation();

  // Socket.io connection and real-time updates
  const { on } = useSocket();

  useEffect(() => {
    // Listen for new content notifications
    const cleanupNew = on?.("new:content", (data: any) => {
      console.log("📩 New content received:", data);

      // Show toast notification
      toast.success(`New ${data.type} content assigned to you!`, {
        description: `${data.business} - ${data.message}`,
      });

      // Invalidate the content cache to refetch data
      dispatch(
        contentApi.util.invalidateTags([{ type: "CONTENT" }])
      );
    });

    // Listen for content update notifications
    const cleanupUpdate = on?.("update:content", (data: any) => {
      console.log("🔄 Content updated:", data);

      // Show toast notification
      toast.info(`Content has been updated!`, {
        description: `${data.business} - ${data.message}`,
      });

      // Invalidate the content cache to refetch data
      dispatch(
        contentApi.util.invalidateTags([{ type: "CONTENT" }])
      );
    });

    // Listen for content delete notifications
    const cleanupDelete = on?.("delete:content", (data: any) => {
      console.log("🗑️ Content deleted:", data);

      // Show toast notification
      toast.error(`Content has been deleted!`, {
        description: `${data.business} - ${data.message}`,
      });

      // Invalidate the content cache to refetch data
      dispatch(
        contentApi.util.invalidateTags([{ type: "CONTENT" }])
      );
    });

    return () => {
      cleanupNew?.();
      cleanupUpdate?.();
      cleanupDelete?.();
    };
  }, [on, dispatch]);

  // Transform API data to table format - memoize to prevent unnecessary recalculations
  const contents: Content[] = useMemo(
    () =>
      contentsData?.data?.map((content: RegularContent) => ({
        id: content._id,
        businessName:
          typeof content.business === "string"
            ? businessesData?.data?.find((b) => b._id === content.business)
                ?.businessName || "Unknown"
            : content.business?.businessName || "Unknown",
        date: content.date,
        status: content.status,
        contentType: content.contentType,
        postMaterial: content.postMaterial,
        tags: content.tags,
        videoMaterial: content.videoMaterial,
        vision: content.vision,
        posterMaterial: content.posterMaterial,
        comments: content.comments,
      })) || [],
    [contentsData, businessesData]
  );

  console.log("Contents array:", contents);

  const businesses = useMemo(
    () => [
      "All Businesses",
      ...(businessesData?.data?.map((b) => b.businessName) || []),
    ],
    [businessesData]
  );

  const handleStatusChange = useCallback(
    async (id: string, newStatus: boolean) => {
      try {
        await updateContent({
          id,
          data: { status: newStatus },
        }).unwrap();
      } catch (error) {
        console.error("Failed to update status:", error);
        alert("Failed to update status. Please try again.");
      }
    },
    [updateContent]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      // Confirm before deleting
      if (!window.confirm("Are you sure you want to delete this content?")) {
        return;
      }

      try {
        await deleteContent(id).unwrap();
        toast.success("Content deleted successfully!");
      } catch (error) {
        console.error("Failed to delete content:", error);
        toast.error("Failed to delete content. Please try again.");
      }
    },
    [deleteContent]
  );

  const handleBusinessSelect = (business: string) => {
    setSelectedBusiness(business);
    setIsBusinessSheetOpen(false);
  };

  const handleStatusSelect = (status: string | null) => {
    setSelectedStatus(status);
  };

  const handleView = (content: Content) => {
    setViewContent(content);
    setIsViewDialogOpen(true);
  };

  // Filter contents by business and status (date is filtered by backend)
  const filteredContents = useMemo(() => {
    let filtered = contents;

    // Filter by business
    if (selectedBusiness !== "All Businesses") {
      filtered = filtered.filter(
        (content) => content.businessName === selectedBusiness
      );
    }

    // Filter by status
    if (selectedStatus) {
      const statusBool = selectedStatus === "Done";
      filtered = filtered.filter((content) => {
        // Ensure status is compared as boolean, handle both boolean and string types
        const contentStatus = typeof content.status === 'string'
          ? content.status === 'true'
          : Boolean(content.status);
        return contentStatus === statusBool;
      });
    }

    return filtered;
  }, [contents, selectedBusiness, selectedStatus]);

  const columns = useMemo(
    () => createColumns(handleStatusChange, handleView, handleDelete),
    [handleStatusChange, handleDelete]
  );

  // Show loading state
  if (isLoadingBusinesses || isLoadingContents) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border">
        <div>
          <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
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
                  {selectedStatus
                    ? `Status: ${selectedStatus}`
                    : "Filter by Status"}
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
                      {selectedStatus === status && (
                        <Check className="h-4 w-4" />
                      )}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet
              open={isBusinessSheetOpen}
              onOpenChange={setIsBusinessSheetOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 hover:bg-white hover:border-blue-600 transition-all dark:hover:bg-blue-950/40 dark:hover:border-blue-600"
                >
                  <Filter className="h-4 w-4" />
                  {selectedBusiness === "All Businesses"
                    ? "Filter by Business"
                    : selectedBusiness}
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

      {/* View Content Dialog */}
      <ViewContentDialog
        content={viewContent}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </div>
  );
}
