import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { destinations, getRegions } from "../../data/destinations";
import DestinationCard from "./DestinationCard";
import { SkeletonGrid } from "../ui/SkeletonCard";
import styles from "./DestinationGrid.module.css";

const REGIONS = ["All", ...getRegions()];

export default function DestinationGrid({ initialQuery = "", initialRegion = "" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || initialQuery);
  const [region, setRegion] = useState(searchParams.get("region") || initialRegion || "All");
  const [activeTag, setActiveTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  // Simulate brief loading for UX
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [query, region, activeTag]);

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (region !== "All") params.region = region;
    setSearchParams(params, { replace: true });
  }, [query, region]);

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const matchQuery =
        !query ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchRegion = region === "All" || d.region === region;
      const matchTag = !activeTag || d.tags.includes(activeTag);
      return matchQuery && matchRegion && matchTag;
    });
  }, [query, region, activeTag]);

  const allTags = useMemo(() => {
    const set = new Set(destinations.flatMap((d) => d.tags));
    return [...set].slice(0, 12);
  }, []);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setActiveTag(null);
  };

  const clearFilters = () => {
    setQuery("");
    setRegion("All");
    setActiveTag(null);
    inputRef.current?.focus();
  };

  const hasFilters = query || region !== "All" || activeTag;

  // Reveal animation for cards
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, filtered]);

  return (
    <div className={styles.wrapper}>
      {/* Search + filters */}
      <div className={styles.controls}>
        {/* Text search */}
        <div className={styles.searchBox} role="search">
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            className={styles.searchInput}
            placeholder="Search destinations…"
            value={query}
            onChange={handleQueryChange}
            aria-label="Search destinations"
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery("")} aria-label="Clear search">×</button>
          )}
        </div>

        {/* Region pills */}
        <div className={styles.regionPills} role="group" aria-label="Filter by region">
          {REGIONS.map((r) => (
            <button
              key={r}
              className={`${styles.pill} ${region === r ? styles.pillActive : ""}`}
              onClick={() => setRegion(r)}
              aria-pressed={region === r}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Tag chips */}
      <div className={styles.tagRow} role="group" aria-label="Filter by category">
        {allTags.map((t) => (
          <button
            key={t}
            className={`${styles.tagChip} ${activeTag === t ? styles.tagActive : ""}`}
            onClick={() => setActiveTag(activeTag === t ? null : t)}
            aria-pressed={activeTag === t}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Results header */}
      <div className={styles.resultsRow}>
        <p className={styles.count} aria-live="polite" aria-atomic="true">
          {loading ? "Loading…" : `${filtered.length} destination${filtered.length !== 1 ? "s" : ""}`}
          {hasFilters && !loading && " found"}
        </p>
        {hasFilters && (
          <button className={styles.clearAll} onClick={clearFilters}>
            Clear all filters ×
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : filtered.length === 0 ? (
        <div className={styles.empty} role="status" aria-live="polite">
          <p className={styles.emptyIcon} aria-hidden="true">🌍</p>
          <h3 className={styles.emptyTitle}>No destinations found</h3>
          <p className={styles.emptyMsg}>Try a different search term or region.</p>
          <button className={styles.emptyBtn} onClick={clearFilters}>Clear filters</button>
        </div>
      ) : (
        <div className={styles.grid} role="list" aria-label="Destination results">
          {filtered.map((d, i) => (
            <div key={d.id} role="listitem">
              <DestinationCard destination={d} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
