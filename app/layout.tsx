import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";


export const metadata: Metadata = {
  title: "RouteGraph — Explore Connected Destinations",
  description:
    "Discover destinations, routes and travel connections through a graph-powered travel explorer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}