import type { Metadata } from "next";
import "./globals.css";
import { ConvexProvider } from "./ConvexProvider";
import Navbar from "../components/Navbar";
import RouteNav from "../components/RouteNav";
import SeedNavBar from "../components/SeedNavBar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Picoteo | Local Marketplace",
  description: "A marketplace that empowers local communities to sell their harvests, securing pre-sales even before the first pick.",
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
          <Toaster />
        </ConvexProvider>
      </body>
    </html>
  );
}
