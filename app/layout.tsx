
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EPIC-OS / GENESIS v2.1",
  description: "Unified Resilience-as-a-Service ecosystem powered by WCX Neural Fabric.",
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
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
