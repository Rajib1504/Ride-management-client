import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { LatLngExpression, LatLng } from "leaflet";
import L from "leaflet"; // Import L to fix icon issue

// Define the shape of our location data
type TGeoJson = {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
};

// Define the props our component will accept
type MapPickerProps = {
  onLocationChange: (location: TGeoJson) => void;
  // Leaflet uses [lat, lng], so we adjust our prop
  initialPosition: [number, number]; // [latitude, longitude]
  zoom?: number;
};

// FIX for default Leaflet icon not showing
// This is a common issue with React-Leaflet and bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export const MapPicker = ({
  onLocationChange,
  initialPosition,
  zoom = 13,
}: MapPickerProps) => {
  // State to hold the marker's position [lat, lng]
  const [position, setPosition] = useState<LatLngExpression>(initialPosition);

  // Send the initial location to the parent on first render
  useEffect(() => {
    onLocationChange({
      type: "Point",
      coordinates: [initialPosition[1], initialPosition[0]], // [lng, lat]
    });
  }, []); // Empty dependency array ensures this runs only once

  const eventHandlers = useMemo(
    () => ({
      dragend(e: { target: { getLatLng: () => LatLng } }) {
        const { lat, lng } = e.target.getLatLng();
        // 1. Update our internal marker state
        setPosition([lat, lng]);
        
        // 2. "Connect" to the parent by calling the prop
        const newCoords: TGeoJson = {
          type: "Point",
          coordinates: [lng, lat], // [lng, lat]
        };
        onLocationChange(newCoords);
      },
    }),
    [onLocationChange]
  );

  return (
    // MapContainer needs a CSS height to be visible.
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: "400px", width: "100%", borderRadius: '8px' }}
    >
      {/* This is the map "skin". OpenStreetMap is free. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
      />
    </MapContainer>
  );
};