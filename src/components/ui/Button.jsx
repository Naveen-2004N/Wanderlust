import styles from "./Button.module.css";

/**
 * Button variants:
 * - primary: Electric Iris fill (Going™ CTA)
 * - secondary: Charcoal fill (Raus CTA)
 * - ghost: pill outline (Raus pill link)
 * - marigold: Marigold fill (search action)
 * - pine: Pine fill (brand action)
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  as: Tag = "button",
  className = "",
  icon,
  iconRight,
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <Tag
      className={[styles.btn, styles[variant], styles[`size-${size}`], className].join(" ")}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-label="Loading" />
      ) : (
        <>
          {icon && <span className={styles.iconLeft} aria-hidden="true">{icon}</span>}
          <span>{children}</span>
          {iconRight && <span className={styles.iconRight} aria-hidden="true">{iconRight}</span>}
        </>
      )}
    </Tag>
  );
}
