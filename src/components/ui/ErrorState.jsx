import styles from "./ErrorState.module.css";
import Button from "./Button";

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  icon = "⚠",
}) {
  return (
    <div className={styles.wrap} role="alert" aria-live="polite">
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Try again →
        </Button>
      )}
    </div>
  );
}
