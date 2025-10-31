import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";

export default function ContentWriterDashboard() {
  const { data } = useGetCurrentUserQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Writer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {data?.data.username}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Content</CardTitle>
            <CardDescription>Content pieces created</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Content to write</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published</CardTitle>
            <CardDescription>Live content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
