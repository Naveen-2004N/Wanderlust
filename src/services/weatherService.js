const BASE = "https://api.openweathermap.org/data/2.5";
const KEY = import.meta.env.VITE_OPENWEATHER_KEY;

export async function getWeatherByCoords(lat, lon) {
  if (!KEY) throw new Error("OpenWeather API key not configured");
  const res = await fetch(
    `${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`
  );
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
  return res.json();
}

export async function getWeatherByCity(city) {
  if (!KEY) throw new Error("OpenWeather API key not configured");
  const res = await fetch(
    `${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${KEY}`
  );
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
  return res.json();
}

export function getWeatherIconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function getWindDirection(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}
