import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

const MapReadOnly = ({selectedLocationParam}) => {
  const initialCenter = { lat: 28.6139, lng: 77.2090 }; // Coordinates for Delhi
  const [center, setCenter] = useState(selectedLocationParam?selectedLocationParam:initialCenter); // State to store the map center
  const [selectedLocation, setSelectedLocation] = useState(selectedLocationParam?selectedLocationParam:null); // State to store selected location
 
  const apiKey = "AIzaSyAAPq5IMotbu90TZAEtyj8qgYyVJoROzsQ"; // Replace with your API Key

  // Function to handle map click and update selected location
  const handleMapClick = ({ x, y, lat, lng, event }) => {
    setSelectedLocation({ lat, lng });
  };


  return (
    <div style={{ height: '500px', width: '100%' }}>
        <div>
        
      </div>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        center={center}
        defaultZoom={15}
        
      >
        {/* Add markers or other map elements here */}
        {selectedLocation && (
          <PinMarker
            lat={selectedLocation.lat}
            lng={selectedLocation.lng}
           
          />
        )}
      </GoogleMapReact>
    </div>
  );
};

// Custom marker component
const PinMarker = ({ text }) => (
  <div style={{ position: 'relative', textAlign: 'center' }}>
    <div style={{ color: 'red', fontSize: '24px' }}>📍</div>
    <div style={{ position: 'absolute', top: '25px', left: '-20px', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }}>{text}</div>
  </div>
);

export default MapReadOnly;

