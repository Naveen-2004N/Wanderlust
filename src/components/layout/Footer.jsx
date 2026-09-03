import { Link } from "react-router-dom";
import { destinations } from "../../data/destinations";
import styles from "./Footer.module.css";

const FOOTER_LINKS = {
  Explore: destinations.slice(0, 6).map((d) => ({
    label: d.name,
    to: `/destination/${d.id}`,
  })),
  Regions: [
    { label: "Europe", to: "/explore?region=Europe" },
    { label: "Asia", to: "/explore?region=Asia" },
    { label: "Americas", to: "/explore?region=Americas" },
    { label: "Africa", to: "/explore?region=Africa" },
    { label: "Oceania", to: "/explore?region=Oceania" },
  ],
  Resources: [
    { label: "Plan a Trip", to: "/explore" },
    { label: "Weather Guide", to: "/explore" },
    { label: "AI Travel Assistant", to: "/explore" },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`${styles.inner} container`}>
        <div className={styles.top}>
          {/* Brand column */}
          <div className={styles.brand}>
            <Link to="/" className={styles.wordmark} aria-label="Wanderlust home">
              WANDERLUST
            </Link>
            <p className={styles.tagline}>
              Explore the world with purpose.<br />Real weather. Real places. AI-powered planning.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className={styles.col}>
              <h3 className={styles.colHeading}>{section}</h3>
              <ul role="list">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className={styles.footerLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Wanderlust. Built for the TAP Academy Front-End Assessment.
          </p>
          <p className={styles.stack}>
            React · Vite · Gemini AI · OpenWeather · Pexels
          </p>
        </div>
      </div>
    </footer>
  );
}
