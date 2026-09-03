import { useState, useEffect } from "react";
import { getWeatherByCoords, getWeatherByCity } from "../services/weatherService";

export function useWeather(coords = null, cityName = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coords && !cityName) return;

    let cancelled = false;
    async function fetch() {
      setLoading(true);
      setError(null);
      try {
        const result = coords
          ? await getWeatherByCoords(coords.lat, coords.lon)
          : await getWeatherByCity(cityName);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [coords?.lat, coords?.lon, cityName]);

  return { data, loading, error };
}
