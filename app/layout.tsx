import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

import "./globals.css";

export const metadata: Metadata = {
  title: "SSC Notice Intelligence Platform",
  description:
    "Official SSC notice browser with categorized exam feeds, PDF downloads, extracted document content, and manual summaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <SiteHeader />
          <main className="shell-grid">
            <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">{children}</div>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
