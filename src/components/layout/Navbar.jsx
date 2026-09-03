import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`${styles.header} ${transparent ? styles.transparent : styles.solid}`}
      role="banner"
    >
      <nav className={`${styles.nav} container`} aria-label="Main navigation">
        <Link to="/" className={styles.wordmark} aria-label="Wanderlust — home">
          WANDERLUST
        </Link>

        <ul className={styles.links} role="list">
          {[{to:"/",label:"Home"},{to:"/explore",label:"Explore"}].map(({to,label})=>(
            <li key={to}>
              <NavLink
                to={to}
                end={to==="/"}
                className={({isActive})=>[styles.link,isActive?styles.active:""].join(" ")}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link to="/explore" className={styles.cta}>
          Start Exploring
        </Link>

        <button
          className={styles.burger}
          onClick={()=>setMenuOpen(v=>!v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen?"Close menu":"Open menu"}
        >
          <span className={`${styles.bar} ${menuOpen?styles.barOpen1:""}`}/>
          <span className={`${styles.bar} ${menuOpen?styles.barOpen2:""}`}/>
          <span className={`${styles.bar} ${menuOpen?styles.barOpen3:""}`}/>
        </button>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu} role="navigation" aria-label="Mobile navigation">
          <Link to="/"       className={styles.mobileLink} onClick={()=>setMenuOpen(false)}>Home</Link>
          <Link to="/explore"className={styles.mobileLink} onClick={()=>setMenuOpen(false)}>Explore</Link>
          <Link to="/explore"className={styles.mobileCta}  onClick={()=>setMenuOpen(false)}>Start Exploring →</Link>
        </div>
      )}
    </header>
  );
}
