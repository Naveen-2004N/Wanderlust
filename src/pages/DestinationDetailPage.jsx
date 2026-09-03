import { useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDestinationById } from "../data/destinations";
import { usePexelsPhoto } from "../hooks/usePexels";
import WeatherCard from "../components/weather/WeatherCard";
import PlaceCard from "../components/places/PlaceCard";
import ChatBot from "../components/chatbot/ChatBot";
import ItineraryDisplay from "../components/chatbot/ItineraryDisplay";
import ErrorState from "../components/ui/ErrorState";
import styles from "./DestinationDetailPage.module.css";

function HeroImage({ name, country }) {
  const { url, loading } = usePexelsPhoto(`${name} ${country} scenic landscape`, name);
  if (loading) return <div className={`${styles.heroImgSkel} skeleton`} />;
  if (url) return <img src={url} alt={`${name}, ${country}`} className={styles.heroImgEl} />;
  return (
    <div className={styles.heroImgFallback}>
      <span>{name[0]}</span>
    </div>
  );
}

export default function DestinationDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const destination = getDestinationById(id);
  const placesRef   = useRef(null);
  const planRef     = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (destination) document.title = `${destination.name}, ${destination.country} — Wanderlust`;
  }, [id]);

  /* Reveal on scroll */
  useEffect(() => {
    if (!destination) return;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.07 }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    }, 120);
    return () => { clearTimeout(timer); io.disconnect(); };
  }, [destination]);

  if (!destination) {
    return (
      <main className={styles.notFound}>
        <ErrorState
          icon="🌍"
          title="Destination not found"
          message="We couldn't find that destination."
          onRetry={() => navigate("/explore")}
        />
      </main>
    );
  }

  const { name, country, region, tagline, description, coords,
          tags, bestTime, currency, language, timezone, places } = destination;

  const INFO = [
    { icon:"🗓", label:"Best time",  value: bestTime  },
    { icon:"💵", label:"Currency",   value: currency  },
    { icon:"🗣", label:"Language",   value: language  },
    { icon:"⏰", label:"Timezone",   value: timezone  },
  ];

  return (
    <main className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.heroSection} aria-label={`${name} hero`}>
        <div className={styles.heroImgWrap}>
          <HeroImage name={name} country={country} />
          <div className={styles.heroOverlay} aria-hidden="true" />
        </div>

        <div className={`${styles.heroContent} container`}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link to="/"        className={styles.breadLink}>Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/explore" className={styles.breadLink}>Explore</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{name}</span>
          </nav>

          <div className={styles.heroText}>
            <p className={styles.heroRegion}>{region}</p>
            <h1 className={styles.heroTitle}>{name}</h1>
            <p className={styles.heroCountry}>{country}</p>
            <p className={styles.heroTagline}>{tagline}</p>

            <div className={styles.heroTags} aria-label="Destination themes">
              {tags.map(t => <span key={t} className={styles.heroTag}>{t}</span>)}
            </div>

            <div className={styles.heroActions}>
              <button
                className={styles.btnPlaces}
                onClick={() => placesRef.current?.scrollIntoView({ behavior:"smooth", block:"start" })}
              >
                Famous places ↓
              </button>
              <button
                className={styles.btnPlan}
                onClick={() => planRef.current?.scrollIntoView({ behavior:"smooth", block:"start" })}
              >
                ✦ Plan my trip
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW + WEATHER ── */}
      <section className={`${styles.overviewSection} section`} aria-label="Overview">
        <div className="container">
          <div className={styles.overviewGrid}>

            {/* Left */}
            <div className={styles.overviewLeft}>
              <p className={`label-category ${styles.greenTag}`}>ABOUT {name.toUpperCase()}</p>
              <p className={`${styles.description} reveal`}>{description}</p>

              <div className={styles.infoGrid} aria-label="Key facts">
                {INFO.map(({ icon, label, value }) => (
                  <div key={label} className={`${styles.infoItem} reveal`}>
                    <span className={styles.infoIcon} aria-hidden="true">{icon}</span>
                    <div>
                      <p className={styles.infoLabel}>{label}</p>
                      <p className={styles.infoVal}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — sticky sidebar */}
            <div className={styles.overviewRight}>
              <p className={`label-category ${styles.greenTag}`} style={{marginBottom:"var(--sp-16)"}}>LIVE WEATHER</p>
              <WeatherCard coords={coords} cityName={name} label={`${name}, ${country}`} />

              <div className={styles.chatWrap}>
                <p className={`label-category ${styles.greenTag}`} style={{marginBottom:"var(--sp-16)"}}>AI TRAVEL GUIDE</p>
                <ChatBot destination={destination} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAMOUS PLACES ── */}
      <section
        ref={placesRef}
        className={`${styles.placesSection} section section--alt`}
        aria-label={`Famous places in ${name}`}
        id="places"
      >
        <div className="container">
          <p className={`label-category ${styles.greenTag}`}>NOTABLE PLACES</p>
          <h2 className={`${styles.sectionTitle} reveal`}>Famous places in {name}</h2>
          <p className={`${styles.sectionSub} reveal`}>
            {places.length} curated places worth visiting — landmarks, food, nature and hidden gems.
          </p>
          <div className={styles.placesGrid}>
            {places.map((place, i) => (
              <PlaceCard key={place.id} place={place} destinationName={name} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ITINERARY ── */}
      <section
        ref={planRef}
        className={`${styles.itinerarySection} section`}
        aria-label="Itinerary planner"
        id="plan"
      >
        <div className="container">
          <ItineraryDisplay destination={destination} />
        </div>
      </section>

      {/* ── MORE ── */}
      <section className={`${styles.moreSection} section section--alt`} aria-label="More destinations">
        <div className="container">
          <div className={styles.moreInner}>
            <h2 className={styles.moreTitle}>Ready to explore more?</h2>
            <p className={styles.moreSub}>11 more destinations with live weather, places and AI planning.</p>
            <Link to="/explore" className={styles.moreBtn}>View all destinations →</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
