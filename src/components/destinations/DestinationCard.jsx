import { Link } from "react-router-dom";
import { usePexelsPhoto } from "../../hooks/usePexels";
import styles from "./DestinationCard.module.css";

function CardImage({ name, country, tags }) {
  const { url, loading } = usePexelsPhoto(`${name} ${country} travel`, name);
  return (
    <div className={styles.imgWrap} aria-hidden="true">
      {loading ? (
        <div className={`${styles.imgSkeleton} skeleton`} />
      ) : url ? (
        <img src={url} alt={`${name}, ${country}`} className={styles.img} loading="lazy" />
      ) : (
        <div className={styles.imgFallback}>
          <span>{name[0]}</span>
        </div>
      )}
      {/* Region tag on image */}
      {tags?.[0] && (
        <span className={styles.tag} aria-label={`Category: ${tags[0]}`}>
          {tags[0]}
        </span>
      )}
    </div>
  );
}

export default function DestinationCard({ destination, index = 0 }) {
  const { id, name, country, region, tagline, tags } = destination;

  return (
    <article
      className={`${styles.card} reveal`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <Link
        to={`/destination/${id}`}
        className={styles.link}
        aria-label={`Explore ${name}, ${country}`}
      >
        <CardImage name={name} country={country} tags={tags} />

        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={`${styles.region} label-category`}>{region}</span>
          </div>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.country}>{country}</p>
          <p className={styles.tagline}>{tagline}</p>

          <div className={styles.tags} aria-label="Destination tags">
            {tags.slice(0, 3).map((t) => (
              <span key={t} className={styles.chip}>{t}</span>
            ))}
          </div>

          <span className={styles.cta} aria-hidden="true">
            Explore destination →
          </span>
        </div>
      </Link>
    </article>
  );
}
