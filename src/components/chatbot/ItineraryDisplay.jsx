import { useState } from "react";
import { generateItinerary } from "../../services/geminiService";
import styles from "./ItineraryDisplay.module.css";

const TIME_ICONS = { morning: "🌅", afternoon: "☀", evening: "🌙" };
const TIME_LABELS = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };

function DayCard({ day }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={styles.dayCard}>
      <button
        className={styles.dayHeader}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={`day-${day.day}-content`}
      >
        <div className={styles.dayNum}>
          <span className={styles.dayLabel}>DAY</span>
          <span className={styles.dayNumber}>{day.day}</span>
        </div>
        <div className={styles.dayInfo}>
          <h3 className={styles.dayTitle}>{day.title}</h3>
          {day.accommodation && (
            <p className={styles.accommodation}>
              <span aria-hidden="true">🏨</span> {day.accommodation}
            </p>
          )}
        </div>
        <span className={styles.chevron} aria-hidden="true">{expanded ? "↑" : "↓"}</span>
      </button>

      {expanded && (
        <div id={`day-${day.day}-content`} className={styles.dayContent}>
          {["morning", "afternoon", "evening"].map((time) => {
            const slot = day[time];
            if (!slot) return null;
            return (
              <div key={time} className={styles.timeSlot}>
                <div className={styles.timeLine}>
                  <span className={styles.timeIcon} aria-hidden="true">{TIME_ICONS[time]}</span>
                  <span className={styles.timeLabel}>{TIME_LABELS[time]}</span>
                  {slot.duration && <span className={styles.duration}>{slot.duration}</span>}
                  {slot.cost && <span className={styles.cost}>{slot.cost}</span>}
                </div>
                <div className={styles.slotBody}>
                  <h4 className={styles.activity}>{slot.activity}</h4>
                  <p className={styles.slotDesc}>{slot.description}</p>
                </div>
              </div>
            );
          })}
          {day.localTip && (
            <div className={styles.tip}>
              <span aria-hidden="true">💡</span>
              <p><strong>Local tip:</strong> {day.localTip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ItineraryDisplay({ destination }) {
  const [days, setDays] = useState(5);
  const [preferences, setPreferences] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const result = await generateItinerary(destination, days, preferences);
      setItinerary(result);
    } catch (err) {
      setError(err.message || "Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();
  const handleCopy = () => {
    const text = itinerary?.itinerary?.map((d) =>
      `Day ${d.day}: ${d.title}\nMorning: ${d.morning?.activity}\nAfternoon: ${d.afternoon?.activity}\nEvening: ${d.evening?.activity}`
    ).join("\n\n");
    navigator.clipboard?.writeText(text || "").then(() => alert("Itinerary copied!"));
  };

  return (
    <section className={styles.section} aria-label="Trip itinerary planner">
      {/* Generator controls */}
      {!itinerary && (
        <div className={styles.generator}>
          <div className={styles.genHeader}>
            <span className={styles.genBadge} aria-hidden="true">✦ AI PLANNER</span>
            <h2 className={styles.genTitle}>Plan your trip to {destination.name}</h2>
            <p className={styles.genSub}>
              Get a personalized day-by-day itinerary powered by Gemini AI.
            </p>
          </div>

          <div className={styles.genControls}>
            {/* Days selector */}
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel} htmlFor="days-input">How many days?</label>
              <div className={styles.counter}>
                <button
                  className={styles.counterBtn}
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                  aria-label="Decrease days"
                  disabled={days <= 1}
                >−</button>
                <input
                  id="days-input"
                  type="number"
                  className={styles.counterVal}
                  value={days}
                  onChange={(e) => setDays(Math.min(14, Math.max(1, +e.target.value)))}
                  min={1}
                  max={14}
                  aria-label={`${days} days selected`}
                />
                <button
                  className={styles.counterBtn}
                  onClick={() => setDays((d) => Math.min(14, d + 1))}
                  aria-label="Increase days"
                  disabled={days >= 14}
                >+</button>
              </div>
            </div>

            {/* Preferences */}
            <div className={styles.controlGroup} style={{ flex: 1 }}>
              <label className={styles.controlLabel} htmlFor="prefs-input">
                Any preferences? (optional)
              </label>
              <input
                id="prefs-input"
                type="text"
                className={styles.prefsInput}
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g. family with kids, food lover, budget travel…"
                maxLength={200}
              />
            </div>

            {/* Generate button */}
            <button
              className={styles.generateBtn}
              onClick={handleGenerate}
              disabled={loading}
              aria-busy={loading}
              aria-label={`Generate ${days}-day itinerary for ${destination.name}`}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Generating…
                </>
              ) : (
                <>✦ Generate Itinerary</>
              )}
            </button>
          </div>

          {error && (
            <div className={styles.errorBox} role="alert">
              <p>⚠ {error}</p>
              <button onClick={handleGenerate} className={styles.retryBtn}>Retry</button>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingState} role="status" aria-live="polite">
          <div className={styles.loadDots}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
          <p>Crafting your perfect {days}-day itinerary for {destination.name}…</p>
          <p className={styles.loadSub}>This usually takes 10–20 seconds.</p>
        </div>
      )}

      {/* Itinerary result */}
      {itinerary && !loading && (
        <div className={styles.result}>
          {/* Result header */}
          <div className={styles.resultHeader}>
            <div>
              <h2 className={styles.resultTitle}>
                {itinerary.days}-Day Itinerary: {itinerary.destination}
              </h2>
              {itinerary.currency && (
                <p className={styles.resultSub}>Currency: {itinerary.currency}</p>
              )}
            </div>
            <div className={styles.resultActions}>
              <button className={styles.actionBtn} onClick={handleCopy} aria-label="Copy itinerary to clipboard">
                📋 Copy
              </button>
              <button className={styles.actionBtn} onClick={handlePrint} aria-label="Print itinerary">
                🖨 Print
              </button>
              <button className={styles.regenerateBtn} onClick={() => setItinerary(null)} aria-label="Create a new itinerary">
                ✦ Regenerate
              </button>
            </div>
          </div>

          {/* Tips */}
          {itinerary.bestTips?.length > 0 && (
            <div className={styles.tips}>
              <h3 className={styles.tipsTitle}>✦ Key tips for your trip</h3>
              <ul className={styles.tipsList}>
                {itinerary.bestTips.map((t, i) => (
                  <li key={i} className={styles.tipItem}>
                    <span aria-hidden="true">→</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Day cards */}
          <div className={styles.days}>
            {itinerary.itinerary?.map((day) => (
              <DayCard key={day.day} day={day} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
