import { useState, useEffect, useRef } from "react";
import { searchPhotos, getPhotoUrl } from "../services/pexelsService";

const cache = new Map();

export function usePexelsPhoto(query, fallbackQuery = null) {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = query + (fallbackQuery || "");

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    if (cache.has(key)) {
      setPhoto(cache.get(key));
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function fetch() {
      setLoading(true);
      try {
        let photos = await searchPhotos(query, 3);
        if (!photos.length && fallbackQuery) {
          photos = await searchPhotos(fallbackQuery, 1);
        }
        const result = photos[0] || null;
        cache.set(key, result);
        if (!cancelled) setPhoto(result);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [key]);

  return { photo, url: getPhotoUrl(photo), loading, error };
}
