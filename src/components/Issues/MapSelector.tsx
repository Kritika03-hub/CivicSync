import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { X, MapPin, Check } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onClose: () => void;
  initialLocation: { lat: number; lng: number; address: string };
}

const LocationMarker: React.FC<{
  position: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ position, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return <Marker position={position} />;
};

const MapSelector: React.FC<MapSelectorProps> = ({ onLocationSelect, onClose, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [isLoading, setIsLoading] = useState(false);

  // Mock reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const areas = [
      'Arera Colony', 'MP Nagar', 'New Market', 'Habibganj', 'Kolar',
      'Shahpura', 'TT Nagar', 'Berasia Road', 'Govindpura', 'Bairagarh',
      'Shyamla Hills', 'Indrapuri', 'Ayodhya Nagar', 'Gulmohar Colony'
    ];
    
    const roads = [
      'Main Road', 'Link Road', 'Station Road', 'Market Road', 'Colony Road',
      'Bypass Road', 'Ring Road', 'Service Road'
    ];
    
    const randomArea = areas[Math.floor(Math.random() * areas.length)];
    const randomRoad = roads[Math.floor(Math.random() * roads.length)];
    
    setIsLoading(false);
    return `Near ${randomRoad}, ${randomArea}, Bhopal, Madhya Pradesh`;
  };

  const handleMapClick = async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    setSelectedLocation({ lat, lng, address });
  };

  const handleConfirm = () => {
    onLocationSelect(selectedLocation);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pin Exact Location</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Click on the map to pin the exact location of the issue
          </p>
          
          {/* Real Map Interface */}
          <div className="w-full h-96 rounded-lg border-2 border-gray-300 overflow-hidden">
            <MapContainer
              center={[selectedLocation.lat, selectedLocation.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker
                position={[selectedLocation.lat, selectedLocation.lng]}
                onLocationSelect={handleMapClick}
              />
            </MapContainer>
          </div>
          
          {/* Location Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-gray-900">
                      {selectedLocation.address || 'Click on map to select location'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedLocation.address || isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSelector;