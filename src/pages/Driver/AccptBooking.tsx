import { useGetRideHistoryQuery } from "@/redux/features/ride/ride.api";
import { ActiveRideCard } from "@/components/ActiveRideCard";
import { PendingRidesView } from "@/components/PendingRidesView";
import { Skeleton } from "@/components/ui/skeleton";

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

const AccptBooking = () => {
  const {
    data: historyResponse,
    isLoading,
    error,
  } = useGetRideHistoryQuery(undefined, {
    pollingInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    // Jodi error-er status 404 (Not Found) hoy, tar mane history nei.
    // Eta normal, tai error dekhanor dorkar nei. Amra ride khonjar UI dekhabo.
    if ((error as any).status === 404) {
      // Kono active ride nei, tai notun ride khonjar view dekhano hobe
      return <PendingRidesView />;
    }

    // Jodi onno kono error hoy (jemon 500), tahole error dekhano hobe
    return (
      <div className="text-destructive">
        Error loading ride data. Please refresh.
      </div>
    );
  }

  const activeRide = (historyResponse?.data as IRide[])?.find(
    (ride) =>
      ride.status === "ACCEPTED" ||
      ride.status === "IN_TRANSIT" ||
      ride.status === "PICKED_UP"
  );

  if (activeRide) {
    return <ActiveRideCard ride={activeRide} />;
  } else {
    return <PendingRidesView />;
  }
};

export default AccptBooking;
