import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MariGoldSearchBar from "./MariGoldSearchBar";
import styles from "./HeroSection.module.css";

/* Local downloaded travel aerial (immune to network blocking) */
const HERO_VIDEO_MP4 = "/hero.mp4";

export default function HeroSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Force the browser to play it if autoplay gets stuck
    if (videoRef.current) {
      // Slow down the video by 50% for a smooth, cinematic feel
      videoRef.current.playbackRate = 0.5;
      videoRef.current.play().catch(err => console.log("Video autoplay blocked:", err));
    }
  }, []);

  return (
    <section className={styles.hero} aria-label="Hero — welcome to Wanderlust">
      
      <div className={styles.videoBg} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={HERO_VIDEO_MP4} type="video/mp4" />
        </video>
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={`${styles.content} container`}>
        <div className={styles.textBlock}>
          <span className={styles.eyebrow}>✦ WORLD TRAVEL EXPLORER</span>
          <h1 className={styles.headline}>
            <span className={styles.line1}>The world is</span>
            <span className={styles.line2}>
              yours to <em className={styles.accent}>explore.</em>
            </span>
          </h1>
          <p className={styles.sub}>
            Real weather. Famous places. AI-powered itineraries.
            <br />
            Wherever you want to go, we'll help you get there.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/explore" className={styles.primaryCta}>
              Explore Destinations
            </Link>
            <a href="#featured" className={styles.ghostCta}>
              See what's popular ↓
            </a>
          </div>
        </div>

        {/* Social proof */}
        <div className={styles.proof}>
          <span className={styles.proofDots} aria-hidden="true">
            <span style={{background:"var(--color-marigold)"}} />
            <span style={{background:"var(--color-lime-pulse)"}} />
            <span style={{background:"var(--color-morning-sky)"}} />
          </span>
          <span>12 curated destinations · Live weather · AI travel planning</span>
        </div>
      </div>

      {/* Search bar — INSIDE hero, not overlapping */}
      <div className={styles.searchWrap}>
        <div className="container">
          <MariGoldSearchBar />
        </div>
      </div>
    </section>
  );
}
