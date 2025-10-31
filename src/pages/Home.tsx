import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to CRM Client v2
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Modern CRM solution for managing users, businesses, and tasks
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/login">Employee Login</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage employees and their roles efficiently
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Business Tracking</CardTitle>
              <CardDescription>
                Track and manage business relationships
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                Organize and track tasks effectively
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
