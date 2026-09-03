const KEY = import.meta.env.VITE_OPENCAGE_KEY;
const BASE = "https://api.opencagedata.com/geocode/v1/json";

export async function reverseGeocode(lat, lon) {
  if (!KEY) {
    // Fallback: return generic location string
    return { city: "Your Location", country: "" };
  }
  try {
    const res = await fetch(
      `${BASE}?q=${lat}+${lon}&key=${KEY}&limit=1&no_annotations=1`
    );
    if (!res.ok) throw new Error("Geocode failed");
    const data = await res.json();
    const comp = data.results?.[0]?.components || {};
    return {
      city: comp.city || comp.town || comp.village || comp.county || "Your Location",
      country: comp.country || "",
      countryCode: comp.country_code?.toUpperCase() || "",
    };
  } catch {
    return { city: "Your Location", country: "" };
  }
}

export async function forwardGeocode(query) {
  if (!KEY) throw new Error("OpenCage API key not configured");
  const res = await fetch(
    `${BASE}?q=${encodeURIComponent(query)}&key=${KEY}&limit=5&no_annotations=1`
  );
  if (!res.ok) throw new Error("Geocode failed");
  const data = await res.json();
  return (data.results || []).map((r) => ({
    label: r.formatted,
    lat: r.geometry.lat,
    lon: r.geometry.lng,
    city: r.components.city || r.components.town || r.components.village || query,
    country: r.components.country || "",
  }));
}
