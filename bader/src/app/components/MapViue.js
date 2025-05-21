import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// custom icon
const customIcon = new L.Icon({
  iconUrl: "/images/logo.png", // مسار الصورة داخل مجلد public
  iconSize: [32, 32], // حجم الصورة
  iconAnchor: [16, 32], // نقطة الارتكاز (منتصف العرض وأسفل الصورة)
  popupAnchor: [0, -32], // مكان البالون بالنسبة للأيقونة
});

const MapComponent = ({ locationLat, locationLng, locationName }) => {
  if (!locationLat && !locationLng && !locationName)
    return <p>جارٍ تحميل الخريطة...</p>;

  const position = [locationLat, locationLng];

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "400px", width: "100%", zIndex: 0 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} icon={customIcon}>
        <Popup> {locationName}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
