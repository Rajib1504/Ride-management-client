// src/components/LeafletRouting.tsx
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

// Fix for default Leaflet icon not showing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

type TCoords = {
  lat: number;
  lng: number;
};

type LeafletRoutingProps = {
  pickup: TCoords;
  destination: TCoords;
};

const LeafletRouting = ({ pickup, destination }: LeafletRoutingProps) => {
  const map = useMap();

  useEffect(() => {
    // This creates the routing control and adds it to the map
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pickup.lat, pickup.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: false,
      show: true, // Show the turn-by-turn directions
    }).addTo(map);

    // This is the "cleanup" function
    // It runs when the component is unmounted or props change
    return () => {
      map.removeControl(routingControl);
    };
  }, [map, pickup, destination]);

  return null; // This component only adds things to the map, it doesn't render any HTML
};

export default LeafletRouting;
