import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import L from "leaflet";
import LeafletRouting from "@/components/LeafletRouting";
import LeafletGeosearch from "@/components/LeafletGeosearch";
import {
  useRequestRideMutation,
  useGetRideHistoryQuery,
} from "@/redux/features/ride/ride.api";
import { Skeleton } from "@/components/ui/skeleton";
import { RiderActiveRide } from '@/components/RiderActiveRide';

type TGeoJson = {
  type: "Point";
  coordinates: [number, number];
};
type TLatLng = {
  lat: number;
  lng: number;
};

interface IRide {
  _id: string;
  status:
    | "REQUESTED"
    | "ACCEPTED"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "COMPLETED"
    | "CANCELLED";
  driver?: {
    _id: string;
    name: string;
    phone?: string;
  };
}

const LocationMarker = ({
  setInitialCenter,
}: {
  setInitialCenter: (pos: TLatLng) => void;
}) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    map
      .locate()
      .on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, 14);
        setInitialCenter(e.latlng);
      })
      .on("locationerror", function (e) {
        toast.error("Could not find your location. Please enable permissions.");
      });
  }, [map, setInitialCenter]);

  return position === null ? null : <Marker position={position}></Marker>;
};

const RequestRideView = () => {
  const [pickup, setPickup] = useState<TGeoJson | null>(null);
  const [destination, setDestination] = useState<TGeoJson | null>(null);

  const [pickupCoords, setPickupCoords] = useState<TLatLng | null>(null);
  const [destCoords, setDestCoords] = useState<TLatLng | null>(null);
  const [initialCenter, setInitialCenter] = useState<TLatLng>({
    lat: 22.5726,
    lng: 88.3639,
  });

  const [requestRide, { isLoading }] = useRequestRideMutation();

  const handleSetPickup = (loc: {
    lat: number;
    lng: number;
    label: string;
  }) => {
    setPickupCoords(loc);
    setPickup({ type: "Point", coordinates: [loc.lng, loc.lat] });
    toast.success(`Pickup set: ${loc.label.substring(0, 30)}...`);
  };

  const handleSetDestination = (loc: {
    lat: number;
    lng: number;
    label: string;
  }) => {
    setDestCoords(loc);
    setDestination({ type: "Point", coordinates: [loc.lng, loc.lat] });
    toast.success(`Destination set: ${loc.label.substring(0, 30)}...`);
  };

  const handleSubmitRide = async () => {
    if (!pickup || !destination) {
      toast.error("Please set both pickup and destination.");
      return;
    }
    try {
      const res = await requestRide({
        pickupLocation: pickup,
        destinationLocation: destination,
      }).unwrap();
      toast.success(res.message || "Ride requested! Searching for drivers...");
    } catch (err: any) {
      toast.error(err.data.message || "Failed to request ride.");
    }
  };

  return (
    <div className="space-y-4">
      <div
        style={{
          height: "60vh",
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[initialCenter.lat, initialCenter.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <LocationMarker setInitialCenter={setInitialCenter} />

          <LeafletGeosearch
            onLocationSelect={handleSetPickup}
            placeholder="Set pickup location"
          />

          <LeafletGeosearch
            onLocationSelect={handleSetDestination}
            placeholder="Set destination location"
          />

          {pickupCoords && destCoords && (
            <LeafletRouting pickup={pickupCoords} destination={destCoords} />
          )}
        </MapContainer>
      </div>

      <Button
        onClick={handleSubmitRide}
        disabled={isLoading || !pickup || !destination}
        className="w-full"
      >
        {isLoading ? "Finding Driver..." : "Confirm Ride Request"}
      </Button>
    </div>
  );
};

const RequestRidePage = () => {
  const {
    data: historyResponse,
    isLoading,
    error,
  } = useGetRideHistoryQuery(undefined, {
    pollingInterval: 10000,
  });

  const activeRide = useMemo(() => {
    return (historyResponse?.data as IRide[])?.find(
      (ride) =>
        ride.status === "REQUESTED" ||
        ride.status === "ACCEPTED" ||
        ride.status === "PICKED_UP" ||
        ride.status === "IN_TRANSIT"
    );
  }, [historyResponse]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        Error loading ride data. Please refresh.
      </div>
    );
  }

  if (activeRide) {
    return <RiderActiveRide ride={activeRide} />;
  }

  return <RequestRideView />;
};

export default RequestRidePage;
