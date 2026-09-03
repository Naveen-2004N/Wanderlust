import { useWeather } from "../../hooks/useWeather";
import { getWeatherIconUrl, getWindDirection } from "../../services/weatherService";
import styles from "./WeatherCard.module.css";

function Skeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.skelHeader}>
        <div className={`${styles.skelLine} skeleton`} style={{width:100,height:12}}/>
        <div className={`${styles.skelLine} skeleton`} style={{width:40,height:18,borderRadius:99}}/>
      </div>
      <div className={styles.skelMain}>
        <div className={`skeleton`} style={{width:56,height:56,borderRadius:"50%"}}/>
        <div>
          <div className={`skeleton`} style={{width:90,height:44,borderRadius:8,marginBottom:8}}/>
          <div className={`skeleton`} style={{width:120,height:14,borderRadius:6}}/>
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ label }) {
  return (
    <div className={styles.errorCard} role="alert">
      <span className={styles.errorIcon} aria-hidden="true">🌧</span>
      <p className={styles.errorTitle}>Weather unavailable</p>
      <p className={styles.errorMsg}>
        {!import.meta.env.VITE_OPENWEATHER_KEY
          ? "Add your OpenWeather API key."
          : "Could not load live data. Key may still be activating (takes up to 2h)."}
      </p>
      {label && <p className={styles.errorLocation}>{label}</p>}
    </div>
  );
}

export default function WeatherCard({ coords = null, cityName = null, label = null }) {
  const { data, loading, error } = useWeather(coords, cityName);

  if (loading) return <Skeleton />;
  if (error || !data) return <ErrorCard label={label || cityName} />;

  const temp      = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const condition = data.weather[0]?.description || "";
  const icon      = data.weather[0]?.icon;
  const humidity  = data.main.humidity;
  const wind      = data.wind?.speed?.toFixed(1);
  const windDir   = getWindDirection(data.wind?.deg || 0);
  const cityLabel = label || data.name || cityName || "Location";

  return (
    <div className={styles.card} aria-label={`Current weather in ${cityLabel}`}>
      <div className={styles.header}>
        <div className={styles.location}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{cityLabel}</span>
        </div>
        <span className={styles.liveBadge}>LIVE</span>
      </div>

      <div className={styles.main}>
        {icon && (
          <img src={getWeatherIconUrl(icon)} alt={condition} className={styles.icon} width="64" height="64"/>
        )}
        <div>
          <p className={styles.temp}>{temp}°C</p>
          <p className={styles.condition}>{condition}</p>
        </div>
      </div>

      <div className={styles.details} role="list">
        {[
          {label:"Feels like", val:`${feelsLike}°C`},
          {label:"Humidity",   val:`${humidity}%`},
          {label:"Wind",       val:`${wind} m/s ${windDir}`},
        ].map(({label:l,val})=>(
          <div key={l} className={styles.detail} role="listitem">
            <span className={styles.detailLabel}>{l}</span>
            <span className={styles.detailVal}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
