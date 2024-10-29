import React, { useState, useEffect }from 'react';
import GoogleMapReact from 'google-map-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { LoadScript } from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';

const libraries = ['places'];

function MapsInput({selectedLocation, setSelectedLocation}) {
    const [center, setCenter] = useState(selectedLocation? selectedLocation:{ lat: 0, lng: 0 });
    const [address, setAddress] = useState('');
  
    const apiKey = "AIzaSyAAPq5IMotbu90TZAEtyj8qgYyVJoROzsQ"; // Replace with your API Key
   //console.log("selectedLocation got in MapsInput",selectedLocation,"----",center)
    const handleSelect = async (selectedAddress) => {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
  
      setAddress(selectedAddress);
      setCenter(latLng);
      setSelectedLocation(latLng);
      //console.log(latLng,"---",selectedLocation,'---',center,'---',address)
    };

    useEffect(() => {
      // Check if selectedLocation is null and set it to Delhi's coordinates
      //console.log(selectedLocation)
      if (!selectedLocation) {
        //console.log("Location changing !selectedLocation",selectedLocation)
      }else{
        //console.log("Location changing",selectedLocation)
        setCenter(selectedLocation)
        //setSelectedLocation()
      }
      //console.log(center,address,selectedLocation)
    }, [selectedLocation]);
  
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
        <div style={{ height: '400px', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey }}
            defaultCenter={center}
            center={center}
            defaultZoom={16}
            onClick={({ lat, lng }) => {
              setSelectedLocation({ lat, lng });
            }}
          >
            { (
              <PinMarker
              lat={selectedLocation && selectedLocation.lat ? selectedLocation.lat: 0}
              lng={selectedLocation && selectedLocation.lng ? selectedLocation.lng: 0}
              text="Selected Location"
            />
            )}
          </GoogleMapReact>
        </div>
      </div>
      </LoadScript>
    );
}

const PinMarker = () => (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <FaMapMarkerAlt style={{ color: 'green', fontSize: '24px' }} />
    </div>
  );

export default MapsInput
