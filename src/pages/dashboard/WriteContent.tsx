import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetAllBusinessesQuery } from "@/redux/features/business/businessApi";
import {
  useCreateRegularContentMutation,
  ContentType,
} from "@/redux/features/content/contentApi";

// Form validation schema based on backend requirements
const contentFormSchema = z.object({
  business: z.string().min(1, "Please select a business"),
  date: z.date(),
  contentType: z.nativeEnum(ContentType),
  postMaterial: z.string().optional(),
  tags: z.string().optional(),
  videoMaterial: z.string().optional(),
  vision: z.string().optional(),
  posterMaterial: z.string().optional(),
  comments: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

export default function WriteContent() {
  const [date, setDate] = useState<Date>(new Date());
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.POSTER
  );

  // RTK Query hooks
  const { data: businessesData, isLoading: isLoadingBusinesses } =
    useGetAllBusinessesQuery();
  const [createContent, { isLoading: isCreating }] =
    useCreateRegularContentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      contentType: ContentType.POSTER,
      date: new Date(),
    },
  });

  // Sync form state with local state when radio button changes
  const handleContentTypeChange = (newType: ContentType) => {
    setContentType(newType);
    setValue("contentType", newType);
  };

  const onSubmit = async (data: ContentFormValues) => {
    try {
      // Format date to MM/DD/YYYY as required by backend
      const formattedDate = format(data.date, "MM/dd/yyyy");

      // Team assignments will be auto-assigned from business settings by backend
      const payload = {
        business: data.business,
        date: formattedDate,
        contentType: data.contentType,
        postMaterial: data.postMaterial,
        tags: data.tags,
        videoMaterial: data.videoMaterial,
        vision: data.vision,
        posterMaterial: data.posterMaterial,
        comments: data.comments,
      };

      // Create content using RTK Query mutation
      await createContent(payload).unwrap();

      // Reset form after successful submission
      const today = new Date();
      reset({
        contentType: ContentType.POSTER,
        date: today,
        business: "",
        postMaterial: "",
        tags: "",
        videoMaterial: "",
        vision: "",
        posterMaterial: "",
        comments: "",
      });
      setDate(today);
      setContentType(ContentType.POSTER);

      alert("Content created successfully!");
    } catch (error) {
      console.error("Error creating content:", error);
      alert("Failed to create content. Please try again.");
    }
  };

  // Use local state for instant UI updates
  const showPosterFields =
    contentType === ContentType.POSTER || contentType === ContentType.BOTH;
  const showVideoFields =
    contentType === ContentType.VIDEO || contentType === ContentType.BOTH;

  // Get businesses list from API
  const businesses = businessesData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border">
        <div>
          <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            Write Content
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create new content for your campaigns
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Selection */}
                <div className="space-y-2">
                  <Label htmlFor="business">
                    Business <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="business"
                    {...register("business")}
                    disabled={isLoadingBusinesses}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {isLoadingBusinesses
                        ? "Loading businesses..."
                        : "Select a business"}
                    </option>
                    {businesses.map((business) => (
                      <option key={business._id} value={business._id}>
                        {business.businessName}
                      </option>
                    ))}
                  </select>
                  {errors.business && (
                    <p className="text-sm text-red-500">
                      {errors.business.message}
                    </p>
                  )}
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>
                    Content Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          if (newDate) {
                            setDate(newDate);
                            setValue("date", newDate);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm text-red-500">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Content Type Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-600" />
                Content Type <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    value: ContentType.POSTER,
                    label: "Poster Only",
                    desc: "For Content Designer",
                  },
                  {
                    value: ContentType.VIDEO,
                    label: "Video Only",
                    desc: "For Video Editor",
                  },
                  {
                    value: ContentType.BOTH,
                    label: "Both",
                    desc: "Poster & Video",
                  },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={cn(
                      "relative flex cursor-pointer rounded-lg border p-4 transition-all hover:border-blue-600",
                      contentType === type.value
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40"
                        : "border-border"
                    )}
                  >
                    <input
                      type="radio"
                      value={type.value}
                      {...register("contentType")}
                      className="sr-only"
                      onChange={() =>
                        handleContentTypeChange(type.value as ContentType)
                      }
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="font-semibold">{type.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {type.desc}
                      </span>
                    </div>
                    {contentType === type.value && (
                      <div className="absolute right-4 top-4 h-4 w-4 rounded-full bg-blue-600" />
                    )}
                  </label>
                ))}
              </div>
              {errors.contentType && (
                <p className="text-sm text-red-500">
                  {errors.contentType.message}
                </p>
              )}
            </div>

            {/* Content Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-600" />
                Content Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Post Material */}
                <div className="space-y-2">
                  <Label htmlFor="postMaterial">Social Media Caption</Label>
                  <textarea
                    id="postMaterial"
                    {...register("postMaterial")}
                    rows={4}
                    placeholder="Write your social media post content here..."
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags & Hashtags</Label>
                  <textarea
                    id="tags"
                    {...register("tags")}
                    rows={4}
                    placeholder="#hashtag1 #hashtag2 @mention"
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                  />
                </div>

                {/* Poster Material - Show if contentType is poster or both */}
                {showPosterFields && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="posterMaterial">
                        Poster Content Text
                      </Label>
                      <textarea
                        id="posterMaterial"
                        {...register("posterMaterial")}
                        rows={4}
                        placeholder="Text to include in the poster/graphic..."
                        className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vision">
                        Design Vision & Instructions
                      </Label>
                      <textarea
                        id="vision"
                        {...register("vision")}
                        rows={4}
                        placeholder="Design style, color scheme, mood, inspiration..."
                        className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                      />
                    </div>
                  </>
                )}

                {/* Video Material - Show if contentType is video or both */}
                {showVideoFields && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="videoMaterial">
                      Video Script & Instructions
                    </Label>
                    <textarea
                      id="videoMaterial"
                      {...register("videoMaterial")}
                      rows={4}
                      placeholder="Video script, scenes, voiceover text, editing instructions..."
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                    />
                  </div>
                )}

                {/* Comments */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="comments">Internal Notes & Comments</Label>
                  <textarea
                    id="comments"
                    {...register("comments")}
                    rows={2}
                    placeholder="Additional notes for the team..."
                    className="flex min-h-15 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isCreating}
            className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isCreating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Create Content
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
