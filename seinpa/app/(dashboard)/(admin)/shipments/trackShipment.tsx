import Maps from "../../../../components/Maps";

export default function TrackingPage() {
  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <Maps
        // Fallback center if user blocks geolocation
        center={{ lat: 39.0997, lng: -94.5786 }} // Kansas City as a neutral fallback
        zoom={12}
        markers={[
          { id: "depot", position: { lat: 39.1, lng: -94.58 }, title: "Depot" }
        ]}
        googleMapsApiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}
      />
    </div>
  );
}
