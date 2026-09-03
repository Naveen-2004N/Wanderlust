const KEY = import.meta.env.VITE_PEXELS_KEY;
const BASE = "https://api.pexels.com/v1";

async function pexelsFetch(url) {
  if (!KEY) throw new Error("Pexels API key not configured");
  const res = await fetch(url, { headers: { Authorization: KEY } });
  if (!res.ok) throw new Error(`Pexels fetch failed: ${res.status}`);
  return res.json();
}

export async function searchPhotos(query, perPage = 1) {
  const data = await pexelsFetch(
    `${BASE}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`
  );
  return data.photos || [];
}

export async function getDestinationPhoto(destinationName, countryName) {
  try {
    const photos = await searchPhotos(`${destinationName} ${countryName} travel`, 3);
    if (photos.length) return photos[0];
    const fallback = await searchPhotos(`${destinationName}`, 1);
    return fallback[0] || null;
  } catch {
    return null;
  }
}

export async function getPlacePhoto(placeName, destinationName) {
  try {
    const photos = await searchPhotos(`${placeName} ${destinationName}`, 2);
    if (photos.length) return photos[0];
    const fallback = await searchPhotos(placeName, 1);
    return fallback[0] || null;
  } catch {
    return null;
  }
}

export function getPhotoUrl(photo, size = "large") {
  if (!photo) return null;
  return photo.src?.[size] || photo.src?.large || photo.src?.medium || null;
}
