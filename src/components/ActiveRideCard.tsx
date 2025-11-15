import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LeafletRouting from "@/components/LeafletRouting";
import { useUpdateRideStatusMutation } from "@/redux/features/ride/ride.api";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface IRide {
  _id: string;
  pickupLocation: { coordinates: [number, number] };
  destinationLocation: { coordinates: [number, number] };
  rider: {
    _id: string;
    name: string;
    phone?: string;
  };
  status: "ACCEPTED" | "PICKED_UP" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED";
}

type ActiveRideCardProps = {
  ride: IRide;
};

export const ActiveRideCard = ({ ride }: ActiveRideCardProps) => {
  const [updateStatus, { isLoading }] = useUpdateRideStatusMutation();

  const pickupCoords = useMemo(
    () => ({
      lat: ride.pickupLocation.coordinates[1],
      lng: ride.pickupLocation.coordinates[0],
    }),
    [ride.pickupLocation]
  );

  const destCoords = useMemo(
    () => ({
      lat: ride.destinationLocation.coordinates[1],
      lng: ride.destinationLocation.coordinates[0],
    }),
    [ride.destinationLocation]
  );

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const res = await updateStatus({
        rideId: ride._id,
        status: newStatus,
      }).unwrap();
      toast.success(res.message || `Ride status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update status.");
    }
  };

  const renderNextStepButton = () => {
    switch (ride.status) {
      case "ACCEPTED":
        return (
          <Button
            onClick={() => handleUpdateStatus("PICKED_UP")}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Updating..." : "Mark as Picked Up"}
          </Button>
        );
      case "PICKED_UP":
        return (
          <Button
            onClick={() => handleUpdateStatus("IN_TRANSIT")}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Updating..." : "Start Ride (In Transit)"}
          </Button>
        );
      case "IN_TRANSIT":
        return (
          <Button
            onClick={() => handleUpdateStatus("COMPLETED")}
            disabled={isLoading}
            className="w-full"
            size="lg"
            variant="default"
          >
            {isLoading ? "Updating..." : "Mark as Completed"}
          </Button>
        );
      default:
        return null; 
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Active Ride</h1>
      <Card>
        <CardContent className="p-0">
          <div
            style={{
              height: "300px",
              width: "100%",
              borderTopLeftRadius: "var(--radius-lg)",
              borderTopRightRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            <MapContainer
              center={[pickupCoords.lat, pickupCoords.lng]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <LeafletRouting
                pickup={pickupCoords}
                destination={destCoords}
              />
              <Marker position={[pickupCoords.lat, pickupCoords.lng]} />
              <Marker position={[destCoords.lat, destCoords.lng]} />
            </MapContainer>
          </div>
        </CardContent>

        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{ride.rider.name}</CardTitle>
            <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium">
              {ride.status}
            </span>
          </div>
          <CardDescription>
            {ride.rider.phone || "No phone provided"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="font-medium text-muted-foreground">FROM:</span>{" "}
            {pickupCoords.lat}, {pickupCoords.lng}
          </p>
          <p>
            <span className="font-medium text-muted-foreground">TO:</span>{" "}
            {destCoords.lat}, {destCoords.lng}
          </p>
        </CardContent>

        <CardFooter>{renderNextStepButton()}</CardFooter>
      </Card>
    </div>
  );
};