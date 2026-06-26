import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadCard",
  description: "Mobile-first trade fair lead capture for agency-style outbound teams."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
