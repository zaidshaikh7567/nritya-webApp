import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useJsApiLoader } from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';

const libraries = ['places'];
const apiKey = "AIzaSyAAPq5IMotbu90TZAEtyj8qgYyVJoROzsQ"; // Replace with your actual API key

function MapsInput({ selectedLocation, setSelectedLocation }) {
    const [center, setCenter] = useState(selectedLocation || { lat: 28.6139, lng: 77.2090 }); // Default to Delhi
    const [address, setAddress] = useState('');

    // Load Google Maps API only once
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
        const results = await geocodeByAddress(selectedAddress);
        const latLng = await getLatLng(results[0]);

        setAddress(selectedAddress);
        setCenter(latLng);
        setSelectedLocation(latLng);
    };

    if (loadError) return <p>Error loading maps</p>;
    if (!isLoaded) return <p>Loading maps...</p>;

    return (
        <div>
            <br />

            {/* Autocomplete Input */}
            <PlacesAutocomplete
                value={address}
                onChange={setAddress}
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
                            {suggestions.map((suggestion) => (
                                <div {...getSuggestionItemProps(suggestion, { className: 'suggestion-item' })} key={suggestion.placeId}>
                                    <span>{suggestion.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>

            <br />

            {/* Google Map */}
            <div style={{ height: '400px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: apiKey }}
                    defaultCenter={center}
                    center={center}
                    defaultZoom={16}
                    onClick={({ lat, lng }) => setSelectedLocation({ lat, lng })}
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
    <div style={{ position: 'relative', textAlign: 'center' }}>
        <FaMapMarkerAlt style={{ color: 'green', fontSize: '24px' }} />
    </div>
);

export default MapsInput;
