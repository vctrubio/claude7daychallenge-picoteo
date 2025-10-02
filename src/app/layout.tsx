import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexProvider } from "./ConvexProvider";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <ConvexProvider>
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-8 py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  E-commerce MVP
                </Link>
                <Link 
                  href="/basket" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Basket
                </Link>
              </div>
            </div>
          </nav>
          {children}
        </ConvexProvider>
      </body>
    </html>
  );
}
