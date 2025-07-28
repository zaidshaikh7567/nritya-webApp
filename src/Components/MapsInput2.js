import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useDispatch } from 'react-redux';
import { updateStudioGeolocation } from '../redux/actions/studioGeolocationActions';
import { LoadScript } from '@react-google-maps/api';

const libraries = ['places'];

function MapsInput2({ studioId, geoLocation }) {
  const dispatch = useDispatch();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [apiKey] = useState("AIzaSyAAPq5IMotbu90TZAEtyj8qgYyVJoROzsQ"); // Replace with your API key
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (geoLocation) {
      setSelectedLocation(geoLocation);
    } else if (studioId) {
        setSelectedLocation({ address: '', latLng: { lat: 0, lng: 0 } });
        dispatch(updateStudioGeolocation("Id", { lat: 0, lng: 0 }));
      }
  
  }, [dispatch, geoLocation, studioId]);

  const handleSelect = async (selectedAddress) => {
    const results = await geocodeByAddress(selectedAddress);
    const latLng = await getLatLng(results[0]);

    setSelectedLocation({ address: selectedAddress, latLng });
    dispatch(updateStudioGeolocation(studioId, { address: selectedAddress, latLng }));
  };

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
    >
      <div>
        <div>
          <br />
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
                    style: { height: '40px', fontSize: '16px', width: '100%' },
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion, index) => {
                    const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                    return (
                      <div
                        key={index}
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
    </LoadScript>
  );
}

const PinMarker = ({ text }) => (
  <div style={{ position: 'relative', textAlign: 'center' }}>
    <div style={{ color: 'red', fontSize: '24px' }}>📍</div>
    <div style={{ position: 'absolute', top: '25px', left: '-20px', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }}>{text}</div>
  </div>
);

export default MapsInput2;
