import { usePexelsPhoto } from "../../hooks/usePexels";
import styles from "./PlaceCard.module.css";

const CATEGORY_COLORS = {
  MUSEUM: { bg: "#a6dfff", color: "#004449" },
  NATURE: { bg: "#d7ffc2", color: "#006434" },
  TEMPLE: { bg: "#fcbd1c", color: "#23212c" },
  FOOD: { bg: "#f0e8d4", color: "#dd5000" },
  LANDMARK: { bg: "#23212c", color: "#fffef0" },
  HISTORY: { bg: "#e8d4f0", color: "#5c3a7a" },
  ARCHITECTURE: { bg: "#ffe4cc", color: "#b84000" },
  CULTURE: { bg: "#fce8d7", color: "#8b4513" },
  BEACHES: { bg: "#cceeff", color: "#004449" },
  ADVENTURE: { bg: "#d7ffc2", color: "#006434" },
  VILLAGE: { bg: "#f7f0e1", color: "#23212c" },
  NEIGHBOURHOOD: { bg: "#f0f0f0", color: "#23212c" },
  SHRINE: { bg: "#ffe0e0", color: "#c0392b" },
};

function getStyle(cat) {
  return CATEGORY_COLORS[cat] || { bg: "#e8e4dc", color: "#23212c" };
}

export default function PlaceCard({ place, destinationName, index = 0 }) {
  const { id, name, category, description } = place;
  const { url, loading } = usePexelsPhoto(`${name} ${destinationName}`, destinationName);
  const catStyle = getStyle(category);

  return (
    <article
      className={`${styles.card} reveal`}
      style={{ transitionDelay: `${index * 80}ms` }}
      aria-label={`${name} — ${category}`}
    >
      {/* Image */}
      <div className={styles.imgWrap}>
        {loading ? (
          <div className={`${styles.imgSkel} skeleton`} />
        ) : url ? (
          <img src={url} alt={`${name} in ${destinationName}`} className={styles.img} loading="lazy" />
        ) : (
          <div className={styles.imgFallback} style={{ background: catStyle.bg }}>
            <span style={{ color: catStyle.color }}>{name[0]}</span>
          </div>
        )}
        {/* Category badge */}
        <span
          className={styles.badge}
          style={{ background: catStyle.bg, color: catStyle.color }}
          aria-label={`Category: ${category}`}
        >
          {category}
        </span>
      </div>

      {/* Caption (Raus IDEA editorial style) */}
      <div className={styles.caption}>
        <span className={`${styles.ideaLabel} label-category`}>
          NOTABLE PLACE
        </span>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}
