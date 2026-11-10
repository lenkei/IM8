import "./globals.css";

export const metadata = {
  title: "Vital Grape Essence | A természet esszenciája",
  description: "Három növény, egy különleges esszencia. Ismerje meg a Vital Grape Essence prémium étrend-kiegészítőt és a dupla csomagot.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
