import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useCreateBusinessMutation } from "@/redux/features/business/businessApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useNavigate } from "react-router";
import { role } from "@/constants/role";
import { SocialMediaInput } from "@/components/ui/SocialMediaInput";
import { toast } from "sonner";

const businessSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  typeOfBusiness: z.string().min(1, "Type of business is required"),
  country: z.string().min(1, "Country is required"),
  package: z.string().min(1, "Package is required"),
  entryDate: z.date({ message: "Entry date is required" }),
  contactDetails: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  note: z.string().optional(),
  tags: z.string().optional(),
  assignedCW: z.array(z.string()).optional(),
  assignedCD: z.array(z.string()).optional(),
  assignedVE: z.array(z.string()).optional(),
  // Social media links
  facebookUrl: z.string().optional(),
  facebookUsername: z.string().optional(),
  facebookPassword: z.string().optional(),
  instagramUrl: z.string().optional(),
  instagramUsername: z.string().optional(),
  instagramPassword: z.string().optional(),
  whatsAppUrl: z.string().optional(),
  whatsAppUsername: z.string().optional(),
  whatsAppPassword: z.string().optional(),
  youtubeUrl: z.string().optional(),
  youtubeUsername: z.string().optional(),
  youtubePassword: z.string().optional(),
  website: z.string().optional(),
  tripAdvisor: z.string().optional(),
  googleBusiness: z.string().optional(),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export default function AddBusiness() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [selectedCW, setSelectedCW] = useState<string[]>([]);
  const [selectedCD, setSelectedCD] = useState<string[]>([]);
  const [selectedVE, setSelectedVE] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
  });

  const { data: usersData, isLoading: isLoadingUsers } = useGetAllUsersQuery();
  const [createBusiness, { isLoading: isCreating }] =
    useCreateBusinessMutation();

  // Filter users by role
  const cwUsers =
    usersData?.data?.filter((user) =>
      user.roles.includes(role.contentWriter)
    ) || [];
  const cdUsers =
    usersData?.data?.filter((user) =>
      user.roles.includes(role.contentDesigner)
    ) || [];
  const veUsers =
    usersData?.data?.filter((user) => user.roles.includes(role.videoEditor)) ||
    [];

  const onSubmit = async (data: BusinessFormValues) => {
    try {
      const formattedDate = data.entryDate
        ? format(data.entryDate, "MM/dd/yyyy")
        : "";

      // Build social media links object
      const socialMediaLinks = {
        facebook: {
          url: data.facebookUrl || "",
          username: data.facebookUsername || "",
          password: data.facebookPassword || "",
        },
        instagram: {
          url: data.instagramUrl || "",
          username: data.instagramUsername || "",
          password: data.instagramPassword || "",
        },
        whatsApp: {
          url: data.whatsAppUrl || "",
          username: data.whatsAppUsername || "",
          password: data.whatsAppPassword || "",
        },
        youtube: {
          url: data.youtubeUrl || "",
          username: data.youtubeUsername || "",
          password: data.youtubePassword || "",
        },
        website: data.website || "",
        tripAdvisor: data.tripAdvisor || "",
        googleBusiness: data.googleBusiness || "",
      };

      const payload = {
        businessName: data.businessName,
        typeOfBusiness: data.typeOfBusiness,
        country: data.country,
        package: data.package,
        entryDate: formattedDate,
        contactDetails: data.contactDetails || "",
        email: data.email || "",
        address: data.address || "",
        note: data.note || "",
        tags: data.tags || "",
        assignedCW: selectedCW,
        assignedCD: selectedCD,
        assignedVE: selectedVE,
        socialMediaLinks,
        status: true,
      };

      await createBusiness(payload).unwrap();

      toast.success("Business created successfully!");
      reset();
      setDate(undefined);
      setSelectedCW([]);
      setSelectedCD([]);
      setSelectedVE([]);
      navigate("/admin/businesses");
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error("Failed to create business. Please try again.");
    }
  };

  const toggleSelection = (
    userId: string,
    selected: string[],
    setSelected: (value: string[]) => void
  ) => {
    if (selected.includes(userId)) {
      setSelected(selected.filter((id) => id !== userId));
    } else {
      setSelected([...selected, userId]);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Business</h1>
        <p className="text-muted-foreground">Create a new business entry</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">
                Business Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="businessName"
                {...register("businessName")}
                placeholder="Enter business name"
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.businessName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="typeOfBusiness">
                Type of Business <span className="text-red-500">*</span>
              </Label>
              <Input
                id="typeOfBusiness"
                {...register("typeOfBusiness")}
                placeholder="e.g., Restaurant, Hotel"
              />
              {errors.typeOfBusiness && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.typeOfBusiness.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                {...register("country")}
                placeholder="Enter country"
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="package">
                Package <span className="text-red-500">*</span>
              </Label>
              <Input
                id="package"
                {...register("package")}
                placeholder="Enter package"
              />
              {errors.package && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.package.message}
                </p>
              )}
            </div>

            <div>
              <Label>
                Entry Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setValue("entryDate", selectedDate as Date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.entryDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.entryDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactDetails">Contact Details</Label>
              <Input
                id="contactDetails"
                {...register("contactDetails")}
                placeholder="Phone number"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Full address"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>

          <SocialMediaInput platform="Facebook" register={register} />
          <SocialMediaInput platform="Instagram" register={register} />
          <SocialMediaInput platform="WhatsApp" register={register} />
          <SocialMediaInput platform="YouTube" register={register} />

          {/* Other Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register("website")}
                placeholder="Website URL"
              />
            </div>
            <div>
              <Label htmlFor="tripAdvisor">TripAdvisor</Label>
              <Input
                id="tripAdvisor"
                {...register("tripAdvisor")}
                placeholder="TripAdvisor URL"
              />
            </div>
            <div>
              <Label htmlFor="googleBusiness">Google Business</Label>
              <Input
                id="googleBusiness"
                {...register("googleBusiness")}
                placeholder="Google Business URL"
              />
            </div>
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Content Writers */}
            <div>
              <Label>Assigned Content Writers (CW)</Label>
              <div className="border rounded p-3 max-h-40 overflow-y-auto">
                {isLoadingUsers ? (
                  <p className="text-sm text-muted-foreground">
                    Loading users...
                  </p>
                ) : cwUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No CW users found
                  </p>
                ) : (
                  cwUsers.map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center gap-2 mb-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCW.includes(user._id)}
                        onChange={() =>
                          toggleSelection(user._id, selectedCW, setSelectedCW)
                        }
                        className="rounded"
                      />
                      <span className="text-sm">{user.username}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Content Designers */}
            <div>
              <Label>Assigned Content Designers (CD)</Label>
              <div className="border rounded p-3 max-h-40 overflow-y-auto">
                {isLoadingUsers ? (
                  <p className="text-sm text-muted-foreground">
                    Loading users...
                  </p>
                ) : cdUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No CD users found
                  </p>
                ) : (
                  cdUsers.map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center gap-2 mb-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCD.includes(user._id)}
                        onChange={() =>
                          toggleSelection(user._id, selectedCD, setSelectedCD)
                        }
                        className="rounded"
                      />
                      <span className="text-sm">{user.username}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Video Editors */}
            <div>
              <Label>Assigned Video Editors (VE)</Label>
              <div className="border rounded p-3 max-h-40 overflow-y-auto">
                {isLoadingUsers ? (
                  <p className="text-sm text-muted-foreground">
                    Loading users...
                  </p>
                ) : veUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No VE users found
                  </p>
                ) : (
                  veUsers.map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center gap-2 mb-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedVE.includes(user._id)}
                        onChange={() =>
                          toggleSelection(user._id, selectedVE, setSelectedVE)
                        }
                        className="rounded"
                      />
                      <span className="text-sm">{user.username}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div>
              <Label htmlFor="note">Notes</Label>
              <Textarea
                id="note"
                {...register("note")}
                placeholder="Additional notes"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isCreating} className="flex-1">
            {isCreating ? "Creating..." : "Create Business"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/businesses")}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
