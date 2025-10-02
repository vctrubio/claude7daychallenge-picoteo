import type { Metadata } from "next";
import "./globals.css";
import { ConvexProvider } from "./ConvexProvider";
import Navbar from "../components/Navbar";
import RouteNav from "../components/RouteNav";
import SeedNavBar from "../components/SeedNavBar";

export const metadata: Metadata = {
  title: "E-commerce MVP",
  description: "A simple e-commerce MVP built with Next.js and Convex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexProvider>
          <RouteNav />
          <SeedNavBar />
          <Navbar />
          {children}
        </ConvexProvider>
      </body>
    </html>
  );
}
