import { useState } from "react";
import {
  useAcceptRideMutation,
  useGetPendingRidesQuery,
} from "@/redux/features/ride/ride.api";
import {
  useUpdateDriverLocationMutation,
  useUpdateDriverAvailabilityMutation,
} from "@/redux/features/driver/driver.api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface IRide {
  _id: string;
  pickupLocation: { coordinates: [number, number] };
  destinationLocation: { coordinates: [number, number] };
  rider: {
    _id: string;
    name: string;
    phone?: string;
  };
  status: string;
}

const AccptBooking = () => {
  const [isAvailable, setIsAvailable] = useState(false);

  const {
    data: ridesResponse,
    isLoading,
    error,
    refetch,
  } = useGetPendingRidesQuery(undefined, {
    pollingInterval: isAvailable ? 15000 : 0,
  });

  const [acceptRide, { isLoading: isAccepting }] = useAcceptRideMutation();
  const [updateLocation, { isLoading: isUpdatingLocation }] =
    useUpdateDriverLocationMutation();
  const [updateAvailability, { isLoading: isToggling }] =
    useUpdateDriverAvailabilityMutation();

  const handleAcceptRide = async (rideId: string) => {
    try {
      const res = await acceptRide(rideId).unwrap();
      toast.success(res.message || "Ride accepted!");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to accept ride.");
    }
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    toast.info("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 Driver Location Fetched:", { latitude, longitude });

        const locationData = {
          currentLocation: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        };

        try {
          await updateLocation(locationData).unwrap();
          toast.success("Location updated! Searching for rides...");
        } catch (err: any) {
          toast.error(err.data?.message || "Failed to update location.");
        }
      },
      (error) => {
        toast.error(`Location error: ${error.message}`);
      }
    );
  };

  const handleAvailabilityToggle = async (checked: boolean) => {
    try {
      const res = await updateAvailability({ isAvailable: checked }).unwrap();
      setIsAvailable(checked);
      toast.success(
        res.message || `You are now ${checked ? "Online" : "Offline"}`
      );
      if (checked) {
        refetch();
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update status.");
      setIsAvailable(!checked);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Pending Ride Requests</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = (error as any).data?.message;

    if (errorMessage?.includes("location is not set")) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Step 1: Set Your Location
          </h2>
          <p className="text-muted-foreground max-w-md">
            We need your location to find rides.
          </p>
          <Button
            onClick={handleUpdateLocation}
            disabled={isUpdatingLocation}
            size="lg"
          >
            {isUpdatingLocation ? "Updating..." : "📍 Set My Location"}
          </Button>
        </div>
      );
    }

    if (errorMessage?.includes("You are currently offline")) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 text-center">
          <h2 className="text-xl font-semibold">Step 2: Go Online</h2>
          <p className="text-muted-foreground max-w-md">
            Your location is set! Go online to start receiving ride requests.
          </p>
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <Switch
              id="availability-toggle"
              checked={isAvailable}
              onCheckedChange={handleAvailabilityToggle}
              disabled={isToggling}
            />
            <Label htmlFor="availability-toggle" className="text-lg">
              {isToggling ? "Updating..." : isAvailable ? "Online" : "Offline"}
            </Label>
          </div>
        </div>
      );
    }

    if (errorMessage === "No pending ride requests found at the moment.") {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Pending Ride Requests</h1>
            <div className="flex items-center space-x-2">
              <Switch
                id="availability-toggle"
                checked={isAvailable}
                onCheckedChange={handleAvailabilityToggle}
                disabled={isToggling}
              />
              <Label htmlFor="availability-toggle">
                {isAvailable ? "Online" : "Offline"}
              </Label>
            </div>
          </div>
          <div className="p-8 text-center border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">
              No rides available nearby right now.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {isAvailable
                ? "Auto-refreshing every 15s..."
                : "Go online to search for rides."}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="text-destructive-foreground bg-destructive/10 p-4 rounded-md border border-destructive/20">
        <h2 className="font-bold">Error</h2>
        <p>{errorMessage || "Failed to load rides."}</p>
        <Button variant="outline" className="mt-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const rides: IRide[] = ridesResponse?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pending Ride Requests</h1>
        <div className="flex items-center space-x-2">
          <Switch
            id="availability-toggle"
            checked={isAvailable}
            onCheckedChange={handleAvailabilityToggle}
            disabled={isToggling}
          />
          <Label htmlFor="availability-toggle">
            {isToggling ? "Updating..." : isAvailable ? "Online" : "Offline"}
          </Label>
        </div>
      </div>

      {rides.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">
            No rides available nearby right now.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {isAvailable
              ? "Auto-refreshing every 15s..."
              : "Go online to search for rides."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="border p-4 rounded-lg shadow-sm space-y-3 bg-card text-card-foreground"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{ride.rider.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {ride.rider.phone || "No phone"}
                  </p>
                </div>
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                  {ride.status}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex gap-2">
                  <span className="font-medium min-w-[40px]">From:</span>
                  <span className="text-muted-foreground truncate">
                    {ride.pickupLocation.coordinates.join(", ")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium min-w-[40px]">To:</span>
                  <span className="text-muted-foreground truncate">
                    {ride.destinationLocation.coordinates.join(", ")}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => handleAcceptRide(ride._id)}
                disabled={isAccepting}
              >
                {isAccepting ? "Accepting..." : "Accept Ride"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccptBooking;
