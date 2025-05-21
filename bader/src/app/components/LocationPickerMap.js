"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: "/images/logo.png", 
  iconSize: [42, 42],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function LocationPickerMap({ onLocationSelect }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapRef.current.dataset.initialized) return;
    mapRef.current.dataset.initialized = true;

    const map = L.map(mapRef.current, {
      center: [31.9632, 35.9304],
      zoom: 9,
      minZoom: 6,
      maxZoom: 16,
      maxBounds: [
        [29.0, 34.0],
        [33.5, 39.0],
      ],
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", function (e) {
      const { lat, lng } = e.latlng;

      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], {
          draggable: true,
          icon: customIcon, // ✨ استخدمنا الأيقونة المخصصة
        }).addTo(map);

        markerRef.current.on("dragend", (event) => {
          const { lat, lng } = event.target.getLatLng();
          onLocationSelect({ lat, lng });
        });
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }

      onLocationSelect({ lat, lng });
    });
  }, [onLocationSelect]);

  return (
    <div
      ref={mapRef}
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "8px",
        zIndex: 1,
      }}
    />
  );
}
