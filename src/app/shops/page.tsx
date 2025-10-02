"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

export default function ShopsPage() {
  const shops = useQuery(api.shops.getShops);

  if (shops === undefined) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shops</h1>
          <p className="text-gray-600">Browse available shops</p>
        </header>

        <main>
          {shops.length === 0 ? (
            <p className="text-gray-500">No shops available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <Link
                  key={shop._id}
                  href={`/shops/${shop._id}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {shop.name}
                  </h2>
                  <p className="text-gray-600 mb-3">{shop.description}</p>
                  <p className="text-sm text-gray-500">{shop.address}</p>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}