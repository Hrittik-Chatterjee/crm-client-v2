export default function WriteContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border">
        <div>
          <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Write Content
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create new content for your campaigns
          </p>
        </div>
      </div>

      <div className="p-6 border rounded-lg bg-card">
        <p className="text-muted-foreground">Write content form will be implemented here.</p>
      </div>
    </div>
  );
}
