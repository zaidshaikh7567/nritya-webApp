import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useJsApiLoader } from "@react-google-maps/api";
import { FaMapMarkerAlt } from "react-icons/fa";
import { TextField } from "@mui/material";

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

const libraries = ["places"];
const apiKey = "AIzaSyAAPq5IMotbu90TZAEtyj8qgYyVJoROzsQ";

const FORM_FIELD_HEIGHT = 56;

function MapsInput({
  selectedLocation,
  setSelectedLocation,
  mapAddress,
  setMapAddress,
}) {
  const [center, setCenter] = useState(
    selectedLocation || { lat: 28.6139, lng: 77.209 }
  );

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  useEffect(() => {
    if (selectedLocation) {
      setCenter(selectedLocation);
    }
  }, [selectedLocation]);

  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      setMapAddress(selectedAddress);
      setCenter(latLng);
      setSelectedLocation(latLng);
    } catch (error) {
      console.error("Error in handleSelect:", error);
      // Still update the address even if geocoding fails
      setMapAddress(selectedAddress);
    }
  };

  const handleMapClick = async ({ lat, lng }) => {
    const latLng = { lat, lng };
    setSelectedLocation(latLng);
    setCenter(latLng);

    if (!mapAddress.trim()) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results[0]) {
            setMapAddress(results[0].formatted_address);
          } else {
            console.error("Geocoder failed due to: ", status);
          }
        });
      } catch (error) {
        console.error("Error with reverse geocoding:", error);
      }
    }
  };

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps...</p>;

  return (
    <div>
      {/* Autocomplete Input */}
      {isLoaded && (
        <PlacesAutocomplete
          value={mapAddress}
          onChange={setMapAddress}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div style={autocompleteStyles.autocompleteContainer}>
              <TextField
                fullWidth
                {...getInputProps({
                  placeholder: "Enter address...",
                })}
                sx={{ height: FORM_FIELD_HEIGHT }}
                variant="outlined"
              />

              {suggestions.length > 0 && (
                <div style={autocompleteStyles.autocompleteDropdown}>
                  {loading && <div style={{ padding: '10px 15px' }}>Loading...</div>}
                  {suggestions.map((suggestion) => (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        style: suggestion.active 
                          ? autocompleteStyles.suggestionItemActive 
                          : autocompleteStyles.suggestionItem,
                      })}
                      key={suggestion.placeId}
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

      {/* Google Map */}
      <div style={{ height: "400px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          defaultCenter={center}
          center={center}
          defaultZoom={16}
          onClick={handleMapClick}
        >
          {selectedLocation && (
            <PinMarker lat={selectedLocation.lat} lng={selectedLocation.lng} />
          )}
        </GoogleMapReact>
      </div>
    </div>
  );
}

const PinMarker = () => (
  <div style={{ position: "relative", textAlign: "center" }}>
    <FaMapMarkerAlt style={{ color: "green", fontSize: "24px" }} />
  </div>
);

export default MapsInput;
