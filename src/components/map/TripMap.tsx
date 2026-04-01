/**
 * Interactive trip map showing selected places with markers and route lines.
 * Uses Leaflet via react-leaflet.
 */

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { type PlaceDetail } from "@/data/placeDetails";
import placeCoordinates from "@/data/placeCoordinates";
import { MapPin, Clock, Route } from "lucide-react";

// Fix default marker icons in leaflet + bundler
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/** Haversine distance between two lat/lng points in km */
function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Estimate travel time (hours) assuming 50 km/h average */
function estimateTime(km: number) {
  return km / 50;
}

function formatDuration(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Auto-fit the map bounds to show all markers */
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [positions, map]);
  return null;
}

/** Custom numbered marker icon */
function createNumberedIcon(num: number) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: hsl(222, 47%, 31%);
      color: white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">${num}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

interface RouteSegment {
  from: PlaceDetail;
  to: PlaceDetail;
  distance: number;
  time: number;
}

interface TripMapProps {
  places: PlaceDetail[];
}

const TripMap = ({ places }: TripMapProps) => {
  const resolvedPlaces = useMemo(
    () => places.filter((p) => placeCoordinates[p.id]),
    [places]
  );

  const positions: [number, number][] = useMemo(
    () => resolvedPlaces.map((p) => [placeCoordinates[p.id].lat, placeCoordinates[p.id].lng]),
    [resolvedPlaces]
  );

  const segments: RouteSegment[] = useMemo(() => {
    const segs: RouteSegment[] = [];
    for (let i = 0; i < resolvedPlaces.length - 1; i++) {
      const a = placeCoordinates[resolvedPlaces[i].id];
      const b = placeCoordinates[resolvedPlaces[i + 1].id];
      const dist = haversine(a, b);
      segs.push({
        from: resolvedPlaces[i],
        to: resolvedPlaces[i + 1],
        distance: dist,
        time: estimateTime(dist),
      });
    }
    return segs;
  }, [resolvedPlaces]);

  const totalDistance = segments.reduce((s, seg) => s + seg.distance, 0);
  const totalTime = segments.reduce((s, seg) => s + seg.time, 0);

  if (resolvedPlaces.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl bg-muted/30 border border-border">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Add places to see them on the map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
          <MapPin className="w-4 h-4" />
          {resolvedPlaces.length} places
        </div>
        {segments.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent font-medium">
              <Route className="w-4 h-4" />
              {totalDistance.toFixed(0)} km total
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/20 text-foreground font-medium">
              <Clock className="w-4 h-4" />
              ~{formatDuration(totalTime)} drive
            </div>
          </>
        )}
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-border shadow-lg" style={{ height: 420 }}>
        <MapContainer
          center={positions[0] || [20.5937, 78.9629]}
          zoom={6}
          scrollWheelZoom
          className="h-full w-full"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds positions={positions} />

          {/* Markers */}
          {resolvedPlaces.map((place, idx) => {
            const coord = placeCoordinates[place.id];
            return (
              <Marker
                key={place.id}
                position={[coord.lat, coord.lng]}
                icon={createNumberedIcon(idx + 1)}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>Day {idx + 1}: {place.name}</strong>
                    <br />
                    <span className="text-muted-foreground">{place.state}</span>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Route line */}
          {positions.length > 1 && (
            <Polyline
              positions={positions}
              pathOptions={{
                color: "hsl(222, 47%, 31%)",
                weight: 3,
                opacity: 0.8,
                dashArray: "8, 6",
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Route segments */}
      {segments.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Route className="w-4 h-4 text-primary" /> Route Details
          </h4>
          {segments.map((seg, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border text-sm"
            >
              <div className="flex items-center gap-1 font-medium text-foreground min-w-0 flex-1">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="truncate">{seg.from.name}</span>
                <span className="text-muted-foreground mx-1">→</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                  {i + 2}
                </span>
                <span className="truncate">{seg.to.name}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 text-muted-foreground">
                <span>{seg.distance.toFixed(0)} km</span>
                <span>~{formatDuration(seg.time)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripMap;
