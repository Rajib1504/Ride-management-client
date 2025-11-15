// src/pages/Rider/RequestRidePage.tsx
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import L from "leaflet";
import LeafletRouting from "@/components/LeafletRouting";
import LeafletGeosearch from "@/components/LeafletGeosearch";
import { useRequestRideMutation } from "@/redux/features/ride/ride.api";

// Define coordinate types
type TGeoJson = {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
};
type TLatLng = {
  lat: number;
  lng: number;
};

// A small component to show the user's live location
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
        map.flyTo(e.latlng, 14); // Fly to user's location
        setInitialCenter(e.latlng); // Send location to parent
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      })
      .on("locationerror", function (e) {
        toast.error("Could not find your location. Please enable permissions.");
      });
  }, [map, setInitialCenter]);

  return position === null ? null : (
    <Marker position={position}>
      {/* You can add a <Popup> here if you want */}
    </Marker>
  );
};

// The Main Page Component
const RequestRidePage = () => {
  // State for the API
  const [pickup, setPickup] = useState<TGeoJson | null>(null);
  const [destination, setDestination] = useState<TGeoJson | null>(null);

  // State for the Map (Leaflet needs [lat, lng])
  const [pickupCoords, setPickupCoords] = useState<TLatLng | null>(null);
  const [destCoords, setDestCoords] = useState<TLatLng | null>(null);
  const [initialCenter, setInitialCenter] = useState<TLatLng>({
    lat: 22.5726, // Default to Kolkata
    lng: 88.3639,
  });

  // The RTK Query hook for our API
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

          {/* 1. Component to find user's location */}
          <LocationMarker setInitialCenter={setInitialCenter} />

          {/* 2. Search box for Pickup */}
          <LeafletGeosearch
            onLocationSelect={handleSetPickup}
            placeholder="Set pickup location"
          />

          {/* 3. Search box for Destination */}
          <LeafletGeosearch
            onLocationSelect={handleSetDestination}
            placeholder="Set destination location"
          />

          {/* 4. Component to draw the route */}
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

export default RequestRidePage;
