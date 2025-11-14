// src/components/LeafletGeosearch.tsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

type LeafletGeosearchProps = {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    label: string;
  }) => void;
  placeholder?: string;
};

const LeafletGeosearch = ({
  onLocationSelect,
  placeholder = "Search...",
}: LeafletGeosearchProps) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider(); // Free (Nominatim) provider

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: "bar",
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: placeholder,
    });

    // Event listener for when a location is selected
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onResult = (e: any) => {
      onLocationSelect({
        lat: e.location.y, // Latitude
        lng: e.location.x, // Longitude
        label: e.location.label,
      });
    };

    map.addControl(searchControl);
    map.on("geosearch/showlocation", onResult);

    // Cleanup function
    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation", onResult);
    };
  }, [map, onLocationSelect, placeholder]);

  return null; // This component also just adds a control to the map
};

export default LeafletGeosearch;
