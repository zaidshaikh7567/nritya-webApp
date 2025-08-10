import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useJsApiLoader } from "@react-google-maps/api";
import { FaMapMarkerAlt } from "react-icons/fa";
import { TextField } from "@mui/material";

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
    } catch (err) {
      console.error("Error selecting address:", err);
    }
  };

  const handleMapClick = async ({ lat, lng }) => {
    const latLng = { lat, lng };
    setSelectedLocation(latLng);
    setCenter(latLng);

    if (!mapAddress.trim() && window.google?.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          setMapAddress(results[0].formatted_address);
        } else {
          console.error("Geocoder failed:", status);
        }
      });
    }
  };

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded || !window.google?.maps?.places) {
    return <p>Loading maps...</p>;
  }

  return (
    <div>
      {/* Autocomplete Input */}
      <PlacesAutocomplete
        value={mapAddress}
        onChange={setMapAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <TextField
              fullWidth
              {...getInputProps({ placeholder: "Enter address..." })}
              sx={{ height: FORM_FIELD_HEIGHT }}
              variant="outlined"
            />

            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className: "suggestion-item",
                  })}
                  key={suggestion.placeId}
                >
                  <span>{suggestion.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      <br />

      {/* Google Map */}
      <div style={{ height: "400px", width: "100%" }}>
        <GoogleMapReact
          defaultCenter={center}
          center={center}
          defaultZoom={16}
          onClick={handleMapClick}
          yesIWantToUseGoogleMapApiInternals
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
