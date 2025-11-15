import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface IRide {
  _id: string;
  status: "REQUESTED" | "ACCEPTED" | "PICKED_UP" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED";
  driver?: {
    _id: string;
    name: string;
    phone?: string;
  };
}

type RiderActiveRideProps = {
  ride: IRide;
};

export const RiderActiveRide = ({ ride }: RiderActiveRideProps) => {
  const getStatusInfo = () => {
    switch (ride.status) {
      case "REQUESTED":
        return {
          title: "Finding you a ride...",
          description: "We are looking for nearby drivers to accept your request.",
        };
      case "ACCEPTED":
        return {
          title: "Driver is on the way!",
          description: `${ride.driver?.name || "Your driver"} has accepted your request and is coming to pick you up.`,
        };
      case "PICKED_UP":
        return {
          title: "Ride in progress",
          description: "You are on your way to the destination.",
        };
      case "IN_TRANSIT":
        return {
          title: "Ride in progress",
          description: "You are on your way to the destination.",
        };
      default:
        return {
          title: "Please wait...",
          description: "Loading ride status.",
        };
    }
  };

  const { title, description } = getStatusInfo();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Ride Status</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Spinner className="animate-spin" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {ride.driver && (
          <CardContent>
            <p className="text-lg font-semibold">{ride.driver.name}</p>
            <p className="text-muted-foreground">{ride.driver.phone || "No phone"}</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};