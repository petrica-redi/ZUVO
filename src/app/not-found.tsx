/**
 * Root-level not-found, used for routes outside the [locale] segment.
 * No translations available here. Plain HTML so it always renders.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4F6FB",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          color: "#0F172A",
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "420px" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#CBD5E1",
              lineHeight: 1,
            }}
          >
            404
          </div>
          <h1
            style={{
              margin: "12px 0 8px",
              fontSize: "20px",
              fontWeight: 800,
            }}
          >
            Page not found
          </h1>
          <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "20px" }}>
            The page you were looking for has moved or never existed.
          </p>
          {/* Intentional plain anchor: root not-found is reached before locale routing. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: "14px",
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              background:
                "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            }}
          >
            Go home
          </a>
        </div>
      </body>
    </html>
  );
}
