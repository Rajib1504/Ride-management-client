import { useGetRideHistoryQuery } from "@/redux/features/ride/ride.api";
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

interface IRide {
  _id: string;
  status: "REQUESTED" | "ACCEPTED" | "PICKED_UP" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED";
  driver?: {
    _id: string;
    name: string;
    phone?: string;
  };
  fare?: number;
  createdAt: string; 
}

const BookingHistory = () => {
  const { data: historyResponse, isLoading, error } = useGetRideHistoryQuery(undefined);

  const getStatusBadgeVariant = (status: IRide['status']) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "CANCELLED":
        return "destructive";
      case "IN_TRANSIT":
      case "ACCEPTED":
      case "PICKED_UP":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Booking History</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
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
          Failed to load booking history. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const rides: IRide[] = historyResponse?.data || [];

  if (rides.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Booking History</h1>
        <div className="p-8 text-center border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">You have no ride history yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Booking History</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rides.map((ride) => (
          <Card key={ride._id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Ride ID: ...{ride._id.slice(-6)}</CardTitle>
                <Badge variant={getStatusBadgeVariant(ride.status)}>
                  {ride.status}
                </Badge>
              </div>
              <CardDescription>
                Date: {new Date(ride.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ride.driver ? (
                <div>
                  <p className="font-medium">Driver: {ride.driver.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {ride.driver.phone || "No phone"}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Waiting for a driver...
                </p>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-lg font-semibold">
                {ride.fare ? `₹${ride.fare.toFixed(2)}` : "Fare: N/A"}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;