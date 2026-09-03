import styles from "./SkeletonCard.module.css";

export function SkeletonCard({ variant = "destination" }) {
  if (variant === "place") {
    return (
      <div className={styles.placeCard} aria-hidden="true">
        <div className={`${styles.img} skeleton`} style={{ height: 200 }} />
        <div className={styles.body}>
          <div className={`${styles.label} skeleton`} />
          <div className={`${styles.title} skeleton`} />
          <div className={`${styles.desc} skeleton`} />
        </div>
      </div>
    );
  }
  if (variant === "weather") {
    return (
      <div className={styles.weatherCard} aria-hidden="true">
        <div className={`${styles.wIcon} skeleton`} />
        <div className={`${styles.wTemp} skeleton`} />
        <div className={`${styles.wLabel} skeleton`} />
      </div>
    );
  }
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.img} skeleton`} />
      <div className={styles.body}>
        <div className={`${styles.tag} skeleton`} />
        <div className={`${styles.title} skeleton`} />
        <div className={`${styles.sub} skeleton`} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, variant = "destination" }) {
  return (
    <div className={styles.grid} aria-label="Loading destinations" role="status">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  );
}
