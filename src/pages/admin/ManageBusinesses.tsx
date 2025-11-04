import { Link } from "react-router";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGetAllBusinessesQuery, useDeleteBusinessMutation } from "@/redux/features/business/businessApi";
import { toast } from "sonner";

export default function ManageBusinesses() {
  const { data: businessesData, isLoading } = useGetAllBusinessesQuery();
  const [deleteBusiness] = useDeleteBusinessMutation();

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteBusiness(id).unwrap();
      toast.success(`Business "${name}" deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete business");
      console.error("Error deleting business:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading businesses...</p>
        </div>
      </div>
    );
  }

  const businesses = businessesData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Manage Businesses
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            View, edit, and delete business accounts
          </p>
        </div>
        <Link to="/admin/add-business">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Business
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-card">
        {businesses.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No businesses found. Create your first business to get started.</p>
            <Link to="/admin/add-business">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Business
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Entry Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses.map((business) => (
                <TableRow key={business._id}>
                  <TableCell className="font-medium">{business.businessName}</TableCell>
                  <TableCell>{business.typeOfBusiness}</TableCell>
                  <TableCell>{business.country}</TableCell>
                  <TableCell>{business.package}</TableCell>
                  <TableCell>{business.entryDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/edit-business/${business._id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{business.businessName}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(business._id, business.businessName)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
