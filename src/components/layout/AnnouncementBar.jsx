import { useState } from "react";
import styles from "./AnnouncementBar.module.css";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className={styles.bar} role="status" aria-label="Announcement">
      <p className={styles.msg}>
        ✦ New destinations added every week.&nbsp;
        <a href="/explore" className={styles.cta}>Explore the world →</a>
      </p>
      <button
        className={styles.dismiss}
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
      >
        ×
      </button>
    </div>
  );
}
