import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SUCHAKREE — Seventh Trumpet Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static share-card matching the Seventh Trumpet theme's palette, generated
// at request/build time via next/og — picked up automatically by Next for
// og:image and Twitter card meta, no manual <meta> wiring needed.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0812",
          backgroundImage:
            "radial-gradient(circle at 50% 35%, rgba(155,111,209,0.25) 0%, rgba(11,8,18,0) 60%)",
          position: "relative",
        }}
      >
        {/* Corner dot accents, echoing the site's stud-row motif */}
        <div style={{ position: "absolute", top: 40, left: 40, display: "flex", gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#2C2140",
              }}
            />
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 40, right: 40, display: "flex", gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#2C2140",
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#8A7BA8",
            fontFamily: "monospace",
            marginBottom: 18,
            display: "flex",
          }}
        >
          // fullstack developer
        </div>

        <div
          style={{
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: 10,
            color: "#E8E2F5",
            textTransform: "uppercase",
            display: "flex",
            textShadow: "0 0 40px rgba(155,111,209,0.5)",
          }}
        >
          SUCHAKREE
        </div>

        <div
          style={{
            fontSize: 24,
            letterSpacing: 4,
            color: "#9B6FD1",
            fontFamily: "monospace",
            marginTop: 26,
            display: "flex",
          }}
        >
          Gothic for Introverts. Code for Everyone.
        </div>
      </div>
    ),
    { ...size }
  );
}
