import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { reverseGeocode } from "../services/geocodingService";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [coords, setCoords] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | requesting | granted | denied | error
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setCoords({ lat, lon });
        setStatus("granted");
        try {
          const name = await reverseGeocode(lat, lon);
          setLocationName(name);
        } catch {
          setLocationName({ city: "Your Location", country: "" });
        }
      },
      (err) => {
        setStatus("denied");
        setError(err.message || "Location access denied.");
      },
      { timeout: 10000 }
    );
  }, []);

  const setManualLocation = useCallback((locationData) => {
    setCoords({ lat: locationData.lat, lon: locationData.lon });
    setLocationName({ city: locationData.city, country: locationData.country });
    setStatus("granted");
    setError(null);
  }, []);

  const clearLocation = useCallback(() => {
    setCoords(null);
    setLocationName(null);
    setStatus("idle");
    setError(null);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        coords,
        locationName,
        status,
        error,
        requestLocation,
        setManualLocation,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}
