import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "./ui/shadcn-io/copy-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Content {
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
}

interface ViewContentDialogProps {
  content: Content | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewContentDialog({
  content,
  open,
  onOpenChange,
}: ViewContentDialogProps) {
  if (!content) return null;

  const showPosterFields =
    content.contentType === "poster" || content.contentType === "both";
  const showVideoFields =
    content.contentType === "video" || content.contentType === "both";

  const ReadOnlyTextarea = ({
    label,
    value,
  }: {
    label: string;
    value?: string;
  }) => {
    if (!value) return null;

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="relative flex min-h-20 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm">
          <p className="whitespace-pre-wrap w-full">{value}</p>
          <CopyButton content={value} className="absolute top-2 right-2" />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[85vw] !w-[85vw] h-[85vh] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-2xl font-bold">
              View Content
            </DialogTitle>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="min-w-20 justify-center bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800"
              >
                {content.contentType.toUpperCase()}
              </Badge>
              <Badge
                variant={content.status ? "default" : "outline"}
                className={
                  content.status
                    ? "min-w-20 justify-center bg-green-100 text-green-700 border-green-300 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800"
                    : "min-w-20 justify-center bg-red-100 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
                }
              >
                {content.status ? "Done" : "Pending"}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business */}
                    <div className="space-y-2">
                      <Label>Business</Label>
                      <div className="relative flex h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm items-center">
                        {content.businessName}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <Label>Content Date</Label>
                      <div className="relative flex h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm items-center">
                        {content.date}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-blue-600" />
                    Content Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Post Material */}
                    <ReadOnlyTextarea
                      label="Social Media Caption"
                      value={content.postMaterial}
                    />

                    {/* Tags */}
                    <ReadOnlyTextarea
                      label="Tags & Hashtags"
                      value={content.tags}
                    />

                    {/* Poster Material - Show if contentType is poster or both */}
                    {showPosterFields && (
                      <>
                        <ReadOnlyTextarea
                          label="Poster Content Text"
                          value={content.posterMaterial}
                        />

                        <ReadOnlyTextarea
                          label="Design Vision & Instructions"
                          value={content.vision}
                        />
                      </>
                    )}

                    {/* Video Material - Show if contentType is video or both */}
                    {showVideoFields && (
                      <div className="md:col-span-2">
                        <ReadOnlyTextarea
                          label="Video Script & Instructions"
                          value={content.videoMaterial}
                        />
                      </div>
                    )}

                    {/* Comments */}
                    <div className="md:col-span-2">
                      <ReadOnlyTextarea
                        label="Internal Notes & Comments"
                        value={content.comments}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
