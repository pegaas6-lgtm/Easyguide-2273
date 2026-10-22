import { useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "wouter";

export type MapPoint = { id: string; lat: number; lng: number; name: string; label?: string; href?: string };

function Fit({ points, path }: { points: MapPoint[]; path?: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    const all: [number, number][] = [...points.map((p) => [p.lat, p.lng] as [number, number]), ...(path ?? [])];
    if (all.length === 1) map.setView(all[0]!, 16);
    else if (all.length) map.fitBounds(L.latLngBounds(all), { padding: [40, 40] });
  }, [map, points, path]);
  return null;
}

const icon = (label: string, dark?: boolean) =>
  L.divIcon({ className: "", html: `<div class="eg-marker${dark ? " dark" : ""}">${label}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] });

export function MapView({
  points,
  path,
  className,
  numbered,
}: {
  points: MapPoint[];
  path?: [number, number][];
  className?: string;
  numbered?: boolean;
}) {
  return (
    <MapContainer center={[49.8414, 24.0312]} zoom={15} scrollWheelZoom={false} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {path && path.length > 1 && (
        <>
          <Polyline positions={path} pathOptions={{ color: "#fff", weight: 9, opacity: 0.9 }} />
          <Polyline positions={path} pathOptions={{ color: "#c0502d", weight: 5, opacity: 0.95, dashArray: numbered ? undefined : "6 8" }} />
        </>
      )}
      {points.map((p, i) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={icon(p.label ?? (numbered ? String(i + 1) : "•"), !numbered)}>
          <Popup>
            {p.href ? (
              <Link to={p.href} className="font-medium">
                {p.name}
              </Link>
            ) : (
              p.name
            )}
          </Popup>
        </Marker>
      ))}
      <Fit points={points} path={path} />
    </MapContainer>
  );
}
