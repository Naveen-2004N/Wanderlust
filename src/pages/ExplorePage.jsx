import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DestinationGrid from "../components/destinations/DestinationGrid";
import MariGoldSearchBar from "../components/home/MariGoldSearchBar";
import styles from "./ExplorePage.module.css";

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const initialQuery  = searchParams.get("q")      || "";
  const initialRegion = searchParams.get("region") || "";

  useEffect(() => {
    document.title = "Explore Destinations — Wanderlust";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <main className={styles.page}>
      {/* ── Header ── */}
      <section className={styles.header} aria-label="Explore header">
        <div className={`${styles.headerInner} container`}>
          <p className={`label-category ${styles.tag}`}>DESTINATION EXPLORER</p>
          <h1 className={styles.title}>
            Explore the world,<br/>
            <span className={styles.accent}>one destination at a time</span>
          </h1>
          <p className={styles.sub}>
            12 curated destinations — live weather, famous places and AI-powered itineraries.
          </p>
          <div className={styles.searchWrap}>
            <MariGoldSearchBar compact />
          </div>
        </div>

        {/* Scrolling ticker */}
        <div className={styles.ticker} aria-hidden="true">
          {["PARIS","KYOTO","BALI","ISTANBUL","CAPE TOWN","QUEENSTOWN","MARRAKECH","MALDIVES","NEW YORK","SANTORINI","AMALFI","MACHU PICCHU"].map(n=>(
            <span key={n} className={styles.tickerItem}>{n}</span>
          ))}
        </div>
      </section>

      {/* ── Grid ── */}
      <section className={styles.gridSection} aria-label="Destination listings">
        <div className="container">
          <DestinationGrid initialQuery={initialQuery} initialRegion={initialRegion}/>
        </div>
      </section>
    </main>
  );
}
