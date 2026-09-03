import { useState, useRef, useEffect, useCallback } from "react";
import { sendChatMessage } from "../../services/geminiService";
import ChatMessage from "./ChatMessage";
import styles from "./ChatBot.module.css";

const SUGGESTED_QUESTIONS = [
  "When is the best time to visit?",
  "How many days should I spend here?",
  "What should I definitely not miss?",
  "What's the local food like?",
  "Is it safe for solo travellers?",
];

export default function ChatBot({ destination }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const systemContext = `You are an expert travel guide for ${destination.name}, ${destination.country}. 
You have deep knowledge about: ${destination.description}
Best time to visit: ${destination.bestTime}
Currency: ${destination.currency}
Language: ${destination.language}
Notable places: ${destination.places.map((p) => p.name).join(", ")}
Answer questions helpfully, concisely and enthusiastically. Keep responses to 3-5 sentences unless more detail is specifically requested. Use occasional emojis for warmth.`;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "model",
        text: `👋 Hi! I'm your travel guide for **${destination.name}**. Ask me anything — when to go, what to see, local tips, or how to plan your trip!`,
        id: "welcome",
      }]);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, destination.name]);

  useEffect(() => { if (open) scrollToBottom(); }, [messages, open]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", text, id: Date.now().toString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const historyForApi = messages.filter((m) => m.id !== "welcome");
      const reply = await sendChatMessage(historyForApi, text, systemContext);
      setMessages((prev) => [...prev, { role: "model", text: reply, id: Date.now().toString() }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [...prev, {
        role: "model",
        text: `⚠ **AI assistant error:** ${err.message}\n\nPlease check your VITE_GEMINI_KEY in the .env file and try again.`,
        id: Date.now().toString(),
        isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, systemContext]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className={styles.container}>
      {/* Toggle button */}
      {!open && (
        <button
          className={styles.openBtn}
          onClick={() => setOpen(true)}
          aria-label={`Open AI travel assistant for ${destination.name}`}
          aria-expanded={false}
        >
          <span className={styles.openIcon} aria-hidden="true">✦</span>
          <span>Ask the AI guide</span>
          <span className={styles.aiBadge} aria-hidden="true">Gemini</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className={`${styles.panel} slide-up`}
          role="dialog"
          aria-label={`AI travel assistant for ${destination.name}`}
          aria-modal="false"
        >
          {/* Panel header */}
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <span className={styles.aiDot} aria-hidden="true" />
              <div>
                <p className={styles.aiName}>AI Travel Guide</p>
                <p className={styles.aiSub}>{destination.name} expert · Powered by Gemini</p>
              </div>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label="Close AI assistant"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            className={styles.messages}
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {loading && (
              <div className={styles.typing} aria-label="AI is thinking" role="status">
                <div className={styles.typingDots}>
                  <span className="typing-dot" aria-hidden="true" />
                  <span className="typing-dot" aria-hidden="true" />
                  <span className="typing-dot" aria-hidden="true" />
                </div>
                <span className={styles.typingLabel}>Thinking…</span>
              </div>
            )}
          </div>

          {/* Suggested questions */}
          {messages.length <= 1 && (
            <div className={styles.suggestions} aria-label="Suggested questions">
              <p className={styles.suggLabel}>Ask me:</p>
              <div className={styles.suggList}>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    className={styles.suggChip}
                    onClick={() => sendMessage(q)}
                    aria-label={`Ask: ${q}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form className={styles.inputRow} onSubmit={handleSubmit} aria-label="Send a message">
            <input
              ref={inputRef}
              type="text"
              className={styles.chatInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${destination.name}…`}
              aria-label="Message to AI travel guide"
              disabled={loading}
              maxLength={500}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
