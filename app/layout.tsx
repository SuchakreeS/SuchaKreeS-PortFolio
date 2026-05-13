import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUCHAKREE — Seventh Trumpet Portfolio",
  description:
    "Fullstack Developer & Creative Coder. Building at the intersection of high-performance code and 90s emo-rock aesthetics.",
  keywords: [
    "Suchakree",
    "Fullstack Developer",
    "React",
    "Next.js",
    "Node.js",
    "Mapbox",
    "WebSocket",
    "Portfolio",
  ],
  authors: [{ name: "Suchakree" }],
  openGraph: {
    title: "SUCHAKREE — Seventh Trumpet Portfolio",
    description: "Fullstack Developer & Creative Coder",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

