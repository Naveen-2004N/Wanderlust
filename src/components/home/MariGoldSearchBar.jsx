import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../../context/LocationContext";
import { forwardGeocode } from "../../services/geocodingService";
import { destinations } from "../../data/destinations";
import styles from "./MariGoldSearchBar.module.css";

const REGIONS = ["All Regions", "Europe", "Asia", "Americas", "Africa", "Oceania"];

export default function MariGoldSearchBar({ compact = false }) {
  const navigate = useNavigate();
  const { setManualLocation } = useLocation();

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSugg, setLoadingSugg] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (val.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoadingSugg(true);
      // First filter local destinations
      const localMatches = destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(val.toLowerCase()) ||
          d.country.toLowerCase().includes(val.toLowerCase())
      );
      try {
        const geo = await forwardGeocode(val);
        const combined = [
          ...localMatches.map((d) => ({ type: "destination", label: `${d.name}, ${d.country}`, id: d.id })),
          ...geo.slice(0, 3).map((g) => ({ type: "location", label: g.label, lat: g.lat, lon: g.lon, city: g.city, country: g.country })),
        ].slice(0, 6);
        setSuggestions(combined);
        setShowSuggestions(combined.length > 0);
      } catch {
        const local = localMatches.map((d) => ({ type: "destination", label: `${d.name}, ${d.country}`, id: d.id }));
        setSuggestions(local);
        setShowSuggestions(local.length > 0);
      } finally {
        setLoadingSugg(false);
      }
    }, 400);
  };

  const handleSuggestionClick = (s) => {
    setShowSuggestions(false);
    setQuery(s.label);
    if (s.type === "destination") {
      navigate(`/destination/${s.id}`);
    } else {
      setManualLocation({ lat: s.lat, lon: s.lon, city: s.city, country: s.country });
      navigate(`/explore?q=${encodeURIComponent(s.city)}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      navigate(region !== "All Regions" ? `/explore?region=${region}` : "/explore");
      return;
    }
    navigate(`/explore?q=${encodeURIComponent(query)}&region=${region}`);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const close = (e) => { if (!e.target.closest(`.${styles.barWrap}`)) setShowSuggestions(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={`${styles.barWrap} ${compact ? styles.compact : ""}`}>
      <form
        className={styles.bar}
        onSubmit={handleSearch}
        role="search"
        aria-label="Search destinations"
      >
        {/* Region selector */}
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="region-select">REGION</label>
          <select
            id="region-select"
            className={styles.select}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            aria-label="Filter by region"
          >
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* Search input */}
        <div className={`${styles.field} ${styles.fieldGrow}`}>
          <label className={styles.fieldLabel} htmlFor="destination-search">DESTINATION</label>
          <input
            id="destination-search"
            ref={inputRef}
            type="search"
            className={styles.input}
            placeholder="City, country or region…"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => suggestions.length && setShowSuggestions(true)}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={showSuggestions}
          />
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* Submit button */}
        <button type="submit" className={styles.searchBtn} aria-label="Search destinations">
          {loadingSugg ? (
            <span className={styles.loadDot} aria-hidden="true" />
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>Search</span>
            </>
          )}
        </button>
      </form>

      {/* Autocomplete suggestions */}
      {showSuggestions && (
        <ul
          id="search-suggestions"
          className={styles.suggestions}
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              className={styles.suggestion}
              role="option"
              aria-selected="false"
              onMouseDown={() => handleSuggestionClick(s)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleSuggestionClick(s)}
            >
              <span className={styles.suggIcon} aria-hidden="true">
                {s.type === "destination" ? "🗺" : "📍"}
              </span>
              <span className={styles.suggLabel}>{s.label}</span>
              <span className={styles.suggType}>{s.type === "destination" ? "Destination" : "Location"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
