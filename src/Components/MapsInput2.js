import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useDispatch } from 'react-redux';
import { updateStudioGeolocation } from '../redux/actions/studioGeolocationActions';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

// Add CSS styles for autocomplete dropdown
const autocompleteStyles = {
  autocompleteContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  autocompleteDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1000,
  },
  suggestionItem: {
    padding: '10px 15px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  suggestionItemActive: {
    padding: '10px 15px',
    cursor: 'pointer',
    backgroundColor: '#e3f2fd',
    borderBottom: '1px solid #eee',
  },
};

function MapsInput2({ studioId, geoLocation }) {
  const dispatch = useDispatch();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [apiKey] = useState("AIzaSyAAPq5IMotbu90TZAEtyj8qgYyVJoROzsQ"); // Replace with your API key
  const [address, setAddress] = useState('');

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  useEffect(() => {
    if (geoLocation) {
      setSelectedLocation(geoLocation);
    } else if (studioId) {
        setSelectedLocation({ address: '', latLng: { lat: 0, lng: 0 } });
        dispatch(updateStudioGeolocation("Id", { lat: 0, lng: 0 }));
      }
  
  }, [dispatch, geoLocation, studioId]);

  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      setSelectedLocation({ address: selectedAddress, latLng });
      dispatch(updateStudioGeolocation(studioId, { address: selectedAddress, latLng }));
    } catch (error) {
      console.error("Error in handleSelect:", error);
      // Still update the address even if geocoding fails
      setSelectedLocation({ address: selectedAddress, latLng: { lat: 0, lng: 0 } });
      dispatch(updateStudioGeolocation(studioId, { address: selectedAddress, latLng: { lat: 0, lng: 0 } }));
    }
  };

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps...</p>;

  return (
    <div>
      <div>
        <br />
        {isLoaded && (
          <PlacesAutocomplete
            value={address}
            onChange={(newAddress) => setAddress(newAddress)}
            onSelect={handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div style={autocompleteStyles.autocompleteContainer}>
                <input
                  {...getInputProps({
                    placeholder: 'Enter address...',
                    className: 'location-search-input',
                    style: { height: '40px', fontSize: '16px', width: '100%' },
                  })}
                />
                {suggestions.length > 0 && (
                  <div style={autocompleteStyles.autocompleteDropdown}>
                    {loading && <div style={{ padding: '10px 15px' }}>Loading...</div>}
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        {...getSuggestionItemProps(suggestion, {
                          style: suggestion.active 
                            ? autocompleteStyles.suggestionItemActive 
                            : autocompleteStyles.suggestionItem,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </PlacesAutocomplete>
        )}
        <br />
      </div>
      <div style={{ height: '500px', width: '100%' }}>
        <GoogleMapReact
          defaultCenter={{ lat: 0, lng: 0 }}
          center={selectedLocation && selectedLocation.latLng? selectedLocation.latLng:{ lat: 0, lng: 0 }}
          defaultZoom={16}
          onClick={({ lat, lng }) => {
            setSelectedLocation({ address: 'Selected Location', latLng: { lat, lng } });
            dispatch(updateStudioGeolocation(studioId, { address: 'Selected Location', latLng: { lat, lng } }));
          }}
        >
          {selectedLocation && selectedLocation.latLng && (
            <PinMarker
              lat={selectedLocation.latLng.lat}
              lng={selectedLocation.latLng.lng}
              text="Selected Location"
            />
          )}
        </GoogleMapReact>
      </div>
    </div>
  );
}

const PinMarker = ({ text }) => (
  <div style={{ position: 'relative', textAlign: 'center' }}>
    <div style={{ color: 'red', fontSize: '24px' }}>📍</div>
    <div style={{ position: 'absolute', top: '25px', left: '-20px', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }}>{text}</div>
  </div>
);

export default MapsInput2;
