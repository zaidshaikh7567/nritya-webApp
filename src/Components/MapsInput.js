import React, { useState, useEffect }from 'react';
import GoogleMapReact from 'google-map-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { LoadScript } from '@react-google-maps/api';

const libraries = ['places'];

function MapsInput({selectedLocation, setSelectedLocation}) {
    const [center, setCenter] = useState(selectedLocation? selectedLocation:{ lat: 28.6139, lng: 77.2090 }); // Default center: Delhi
    //const [selectedLocation, setSelectedLocation] = useState(null);
    const [address, setAddress] = useState('');
    //const libraries = ['places']; //
  
    const apiKey = "AIzaSyAAPq5IMotbu90TZAEtyj8qgYyVJoROzsQ"; // Replace with your API Key
    // const apiKey = process.env.REACT_GOOGLE_MAPS_API_KEY;
    // console.log(apiKey)
    const handleSelect = async (selectedAddress) => {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
  
      setAddress(selectedAddress);
      setCenter(latLng);
      setSelectedLocation(latLng);
      console.log(latLng)
    };

    useEffect(() => {
      // Check if selectedLocation is null and set it to Delhi's coordinates
      console.log(selectedLocation)
      if (!selectedLocation) {
        setCenter({ lat: 28.6139, lng: 77.2090 });
        setAddress('');
        setSelectedLocation({ lat: 28.6139, lng: 77.2090 });
      }else{
        setCenter(selectedLocation)
      }
    }, [selectedLocation, setSelectedLocation]);
  
    return (
        <LoadScript
            googleMapsApiKey={apiKey}
            libraries={libraries}
            >
      <div>
        <div>
        <br></br>
        
        <PlacesAutocomplete
          value={address}
          onChange={(newAddress) => setAddress(newAddress)}
          onSelect={handleSelect}
          >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Enter address...',
                  className: 'location-search-input',
                  style: { // Add inline styles for the input element
                    height: '40px', // Adjust the height as needed
                    fontSize: '16px', // Adjust the font size as needed
                    width: '100%',
                  },
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
          <br></br>
        </div>
        <div style={{ height: '500px', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey }}
            defaultCenter={center}
            center={center}
            defaultZoom={16}
            onClick={({ lat, lng }) => {
              setSelectedLocation({ lat, lng });
            }}
          >
            {selectedLocation && (
              <PinMarker
              lat={selectedLocation.lat}
              lng={selectedLocation.lng}
              text="Selected Location"
            />
            )}
          </GoogleMapReact>
        </div>
      </div>
      </LoadScript>
    );
}

const Marker = ({ text }) => (
    <div style={{ color: 'red', fontWeight: 'bold' }}>
      {text}
    </div>
  );

const PinMarker = ({ text }) => (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <div style={{ color: 'red', fontSize: '24px' }}>📍</div>
      <div style={{ position: 'absolute', top: '25px', left: '-20px', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }}>{text}</div>
    </div>
  );

export default MapsInput
