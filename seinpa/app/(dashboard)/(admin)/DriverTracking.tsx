import React from "react";
//import LiveTrackingMap from "../../components/LiveTrackingMap";

export default function DriverTrackingScreen({ route }: any) {
  // For demo, get driverId from navigation params or hardcode
  const driverId = route?.params?.driverId ?? 1;

  // Optionally, pass route points (from backend) for polylines
  // const shipmentRoute = [{lat:..., lng:...}, ...];

  return (
    <LiveTrackingMap driverId={driverId} /* route={shipmentRoute} */ />
  );
}
