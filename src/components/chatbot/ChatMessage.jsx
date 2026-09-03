import ReactMarkdown from "react-markdown";
import styles from "./ChatMessage.module.css";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`${styles.msgWrap} ${isUser ? styles.user : styles.ai}`}>
      {!isUser && (
        <div className={styles.avatar} aria-hidden="true">✦</div>
      )}
      <div
        className={`${styles.bubble} ${isUser ? styles.userBubble : styles.aiBubble} ${message.isError ? styles.errorBubble : ""}`}
      >
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <div className={styles.markdown}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
