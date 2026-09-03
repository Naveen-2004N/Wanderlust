import { useEffect, useRef } from "react";
import styles from "./Toast.module.css";

export default function Toast({ message, type = "info", onClose, duration = 4000 }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(onClose, duration);
    return () => clearTimeout(timerRef.current);
  }, [duration, onClose]);

  const icons = { info: "ℹ", success: "✓", warning: "⚠", error: "✕" };

  return (
    <div
      className={`${styles.toast} ${styles[type]} slide-down`}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.icon} aria-hidden="true">{icons[type]}</span>
      <p className={styles.msg}>{message}</p>
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
