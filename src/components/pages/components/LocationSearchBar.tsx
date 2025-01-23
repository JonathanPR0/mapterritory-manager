import { useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const LocationSearch = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });

  const handleSelect = async (value: string) => {
    try {
      const results = await geocodeByAddress(value);
      const { lat, lng } = await getLatLng(results[0]);
      setAddress(value);
      setCoordinates({ lat, lng });
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  return (
    <div>
      <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search for a location...",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const style = {
                  backgroundColor: suggestion.active ? "#a8d5ff" : "#fff",
                };
                return (
                  <div {...getSuggestionItemProps(suggestion, { style })} key={suggestion.placeId}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      {coordinates.lat && coordinates.lng && (
        <div>
          <h3>Coordinates:</h3>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
