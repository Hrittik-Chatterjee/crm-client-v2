import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";

export default function SuperAdminDashboard() {
  const { data } = useGetCurrentUserQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {data?.data.username}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Manage all users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Businesses</CardTitle>
            <CardDescription>All business accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">✓</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
