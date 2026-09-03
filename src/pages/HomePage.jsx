import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/home/HeroSection";
import DestinationCard from "../components/destinations/DestinationCard";
import WeatherCard from "../components/weather/WeatherCard";
import { useLocation } from "../context/LocationContext";
import { destinations } from "../data/destinations";
import Toast from "../components/ui/Toast";
import { forwardGeocode } from "../services/geocodingService";
import styles from "./HomePage.module.css";

const FEATURED = destinations.slice(0, 6);

export default function HomePage() {
  const { status, coords, locationName, requestLocation, setManualLocation } = useLocation();
  const [toast, setToast] = useState(null);
  const [locationSearch, setLocationSearch] = useState("");
  const [locSuggestions, setLocSuggestions] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    document.title = "Wanderlust — World Travel Explorer";
    if (status === "idle") requestLocation();
  }, []);

  useEffect(() => {
    if (status === "denied")
      setToast({ message: "Location access denied. Search for a city below.", type: "warning" });
    if (status === "granted" && locationName?.city)
      setToast({ message: `📍 Location: ${locationName.city}`, type: "success" });
  }, [status]);

  // Reveal animations
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleLocSearch = e => {
    const val = e.target.value;
    setLocationSearch(val);
    clearTimeout(debounceRef.current);
    if (val.length < 2) { setLocSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await forwardGeocode(val);
        setLocSuggestions(res.slice(0, 4));
      } catch { setLocSuggestions([]); }
    }, 400);
  };

  const handleLocSelect = loc => {
    setManualLocation(loc);
    setLocationSearch(loc.city);
    setLocSuggestions([]);
    setToast({ message: `📍 Showing weather for ${loc.city}`, type: "success" });
  };

  return (
    <main className={styles.main}>
      {/* ── HERO (includes search bar) ── */}
      <HeroSection />

      {/* ── WEATHER ── */}
      <section className={styles.weatherSection} id="weather" aria-label="Live weather">
        <div className="container">
          <p className={`label-category ${styles.sectionTag}`}>LIVE WEATHER</p>
          <h2 className={`${styles.sectionTitle} reveal`}>
            {status === "granted" && locationName?.city
              ? `Right now in ${locationName.city}`
              : "Weather at any destination"}
          </h2>

          <div className={styles.weatherLayout}>
            {/* Left — user location */}
            <div className={styles.weatherLeft}>
              {status === "granted" && coords ? (
                <WeatherCard coords={coords} label={locationName?.city} />
              ) : (
                <div className={styles.locationPrompt}>
                  {status === "requesting" ? (
                    <div className={styles.detecting}>
                      <div className={styles.detectSpinner} aria-label="Detecting location" />
                      <p>Detecting your location…</p>
                    </div>
                  ) : (
                    <>
                      <span className={styles.promptEmoji} aria-hidden="true">📍</span>
                      <h3 className={styles.promptTitle}>Where are you?</h3>
                      <p className={styles.promptMsg}>
                        Share your location for local weather, or search for any city below.
                      </p>
                      <button className={styles.locationBtn} onClick={requestLocation}>
                        Use my location
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Manual location search */}
              <div className={styles.locSearchWrap}>
                <div className={styles.locSearchBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    type="search"
                    className={styles.locSearchInput}
                    placeholder="Search any city for weather…"
                    value={locationSearch}
                    onChange={handleLocSearch}
                    aria-label="Search location for weather"
                  />
                </div>
                {locSuggestions.length > 0 && (
                  <ul className={styles.locSuggestions} role="listbox">
                    {locSuggestions.map((s,i)=>(
                      <li key={i} className={styles.locSugg} role="option"
                        onMouseDown={()=>handleLocSelect(s)} tabIndex={0}
                        onKeyDown={e=>e.key==="Enter"&&handleLocSelect(s)}>
                        📍 {s.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right — destination weather previews */}
            <div className={styles.weatherRight}>
              <p className={styles.weatherRightLabel}>Popular destinations right now</p>
              <div className={styles.miniGrid}>
                {destinations.slice(0,3).map(d=>(
                  <Link key={d.id} to={`/destination/${d.id}`} className={styles.miniLink}>
                    <WeatherCard cityName={d.name} label={d.name}/>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED DESTINATIONS ── */}
      <section className={`${styles.featuredSection} section--alt`} id="featured" aria-label="Featured destinations">
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <p className={`label-category ${styles.sectionTag}`}>EXPLORE THE WORLD</p>
              <h2 className={`${styles.sectionTitle} reveal`}>Popular destinations</h2>
              <p className={`${styles.sectionSub} reveal`}>
                From ancient temples to sun-soaked coastlines — a world worth exploring.
              </p>
            </div>
            <Link to="/explore" className={styles.viewAll}>View all destinations →</Link>
          </div>
          <div className={styles.destGrid}>
            {FEATURED.map((d,i)=>(
              <DestinationCard key={d.id} destination={d} index={i}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI TEASER ── */}
      <section className={styles.aiSection} aria-label="AI travel assistant">
        <div className="container">
          <div className={`${styles.aiCard} reveal`}>
            <div className={styles.aiLeft}>
              <span className={styles.aiBadge}>✦ GEMINI AI</span>
              <h2 className={styles.aiTitle}>
                Your personal travel planner,<br/>
                <span className={styles.aiAccent}>available 24/7</span>
              </h2>
              <p className={styles.aiDesc}>
                Ask anything about a destination — when to go, what to see, where to eat.
                Then generate a full day-by-day itinerary rendered clearly on the page.
              </p>
              <Link to="/explore" className={styles.aiCta}>Start planning →</Link>
            </div>
            <div className={styles.aiRight} aria-hidden="true">
              <div className={styles.chatPreview}>
                <div className={styles.chatBubbleAi}>
                  <span>🤖</span>
                  <p>Kyoto is best in spring (March–May) for cherry blossoms, or autumn (Oct–Nov) for vibrant foliage. 🌸</p>
                </div>
                <div className={styles.chatBubbleUser}>
                  <p>How many days should I spend there?</p>
                </div>
                <div className={styles.chatBubbleAi}>
                  <span>🤖</span>
                  <p>5–7 days lets you explore temples, day-trip to Nara, and find the quiet spots ✨</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    </main>
  );
}
