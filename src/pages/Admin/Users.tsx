import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "@/redux/features/admin/admin.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type TUser = {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Driver" | "Rider";
  status: "ACTIVE" | "BLOCK" | "INACTIVE";
};

const Users = () => {
  const { data: usersResponse, isLoading, error } = useGetAllUsersQuery() as {
    data: { data: TUser[] } | undefined;
    isLoading: boolean;
    error: any;
  };
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  const handleUpdateStatus = async (id: string, status: "ACTIVE" | "BLOCK") => {
    try {
      const res = await updateStatus({ id, body: { status } }).unwrap();
      toast.success(`User status updated to ${res.status}`);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update status.");
    }
  };

  const getStatusBadgeVariant = (status: TUser["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "BLOCK":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load users. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const users: TUser[] = usersResponse?.data || [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user._id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Badge variant="outline">{user.role}</Badge>
              <Badge variant={getStatusBadgeVariant(user.status)}>
                {user.status}
              </Badge>
            </CardContent>
            <CardFooter className="flex gap-2">
              {user.role !== "Admin" && (
                <>
                  {user.status === "ACTIVE" ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleUpdateStatus(user._id, "BLOCK")}
                      disabled={isUpdating}
                    >
                      Block
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUpdateStatus(user._id, "ACTIVE")}
                      disabled={isUpdating}
                    >
                      Activate
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Users;
