import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Package, Navigation as NavigationIcon } from "lucide-react";
import type { DeliveryWithDetails } from "@shared/schema";

interface MapProps {
  delivery: DeliveryWithDetails;
  liveLocation?: { lat: number; lng: number } | null;
  className?: string;
}

export default function Map({ delivery, liveLocation, className = "" }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [driverLocation, setDriverLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [eta, setEta] = useState(25);

  // Mock GPS coordinates based on addresses (in a real app, these would be geocoded)
  const pickupCoords = delivery.pickupLat && delivery.pickupLng 
    ? { lat: parseFloat(delivery.pickupLat), lng: parseFloat(delivery.pickupLng) }
    : { lat: 40.7589, lng: -73.9851 }; // Default to Times Square area

  const dropoffCoords = delivery.dropoffLat && delivery.dropoffLng
    ? { lat: parseFloat(delivery.dropoffLat), lng: parseFloat(delivery.dropoffLng) }
    : { lat: 40.7505, lng: -73.9934 }; // Default to Herald Square area

  // Use live location if available, otherwise use mock location
  const currentDriverLocation = liveLocation || driverLocation;

  // Simulate driver movement (in a real app, this would come from WebSocket)
  useEffect(() => {
    if (!liveLocation && delivery.status === 'in_transit') {
      const interval = setInterval(() => {
        setDriverLocation(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001,
        }));
        setEta(prev => Math.max(1, prev - 1));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [liveLocation, delivery.status]);

  const getStatusMessage = () => {
    switch (delivery.status) {
      case 'assigned':
        return 'Driver is heading to pickup location';
      case 'picked_up':
        return 'Package picked up, starting delivery';
      case 'in_transit':
        return `In transit • ETA: ${eta} minutes`;
      case 'delivered':
        return 'Package delivered successfully';
      default:
        return 'Preparing for delivery';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Mock Map Background */}
      <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 rounded-lg overflow-hidden relative">
        {/* Street pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Horizontal streets */}
            <line x1="0" y1="60" x2="400" y2="60" stroke="#666" strokeWidth="1" />
            <line x1="0" y1="120" x2="400" y2="120" stroke="#666" strokeWidth="1" />
            <line x1="0" y1="180" x2="400" y2="180" stroke="#666" strokeWidth="1" />
            <line x1="0" y1="240" x2="400" y2="240" stroke="#666" strokeWidth="1" />
            
            {/* Vertical streets */}
            <line x1="80" y1="0" x2="80" y2="300" stroke="#666" strokeWidth="1" />
            <line x1="160" y1="0" x2="160" y2="300" stroke="#666" strokeWidth="1" />
            <line x1="240" y1="0" x2="240" y2="300" stroke="#666" strokeWidth="1" />
            <line x1="320" y1="0" x2="320" y2="300" stroke="#666" strokeWidth="1" />
          </svg>
        </div>

        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d="M 80 240 Q 200 120 320 60"
            stroke="url(#routeGradient)"
            strokeWidth="4"
            strokeDasharray="8 4"
            fill="none"
            className="animate-pulse"
          />
        </svg>

        {/* Pickup Location */}
        <div 
          className="absolute flex items-center justify-center"
          style={{ 
            left: '20%', 
            top: '80%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <Badge variant="secondary" className="text-xs">
                Pickup
              </Badge>
            </div>
          </div>
        </div>

        {/* Dropoff Location */}
        <div 
          className="absolute flex items-center justify-center"
          style={{ 
            left: '80%', 
            top: '20%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <div className="w-8 h-8 bg-secondary rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <Badge variant="secondary" className="text-xs">
                Delivery
              </Badge>
            </div>
          </div>
        </div>

        {/* Driver Location (only show if in transit) */}
        {['assigned', 'picked_up', 'in_transit'].includes(delivery.status) && (
          <div 
            className="absolute flex items-center justify-center"
            style={{ 
              left: '50%', 
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-accent rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <Badge className="text-xs bg-accent">
                  Driver
                </Badge>
              </div>
              {/* Radar circle animation */}
              <div className="absolute inset-0 rounded-full border-2 border-accent opacity-50 animate-ping"></div>
            </div>
          </div>
        )}

        {/* Status Overlay */}
        <div className="absolute top-4 left-4 bg-white rounded-lg px-4 py-2 shadow-lg max-w-xs">
          <div className="flex items-center space-x-2">
            <NavigationIcon className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-gray-900" data-testid="text-map-status">
              {getStatusMessage()}
            </p>
          </div>
        </div>

        {/* Driver Info (if available and active) */}
        {delivery.driver && ['assigned', 'picked_up', 'in_transit'].includes(delivery.status) && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={delivery.driver.user.profileImageUrl || `https://ui-avatars.com/api/?name=${delivery.driver.user.firstName}+${delivery.driver.user.lastName}&background=000&color=fff`}
                    alt={`Driver ${delivery.driver.user.firstName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {delivery.driver.user.firstName} {delivery.driver.user.lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                      ⭐ {delivery.driver.rating} • {delivery.driver.vehicleType}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  Live
                </Badge>
              </div>
            </Card>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-1">
          <button 
            className="w-8 h-8 bg-white rounded border shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50"
            data-testid="button-zoom-in"
          >
            +
          </button>
          <button 
            className="w-8 h-8 bg-white rounded border shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50"
            data-testid="button-zoom-out"
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
}
