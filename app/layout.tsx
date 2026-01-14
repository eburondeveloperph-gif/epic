
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EPIC-OS / GENESIS (Apex Edition)",
  description: "Unified Resilience-as-a-Service ecosystem powered by WCX CLOUD SERVER.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
