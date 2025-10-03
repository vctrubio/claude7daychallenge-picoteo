"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { path: "/", label: "Home", description: "Customer marketplace view" },
  { path: "/shops", label: "Shops", description: "All shops listing" },
  { path: "/order-confirmation", label: "Confirmation", description: "Order confirmation" },
  { path: "/order-success", label: "Success", description: "Order success" },
  { path: "/profile", label: "Profile", description: "User profile and settings" },
  { path: "/business", label: "Business", description: "Owner dashboard" },
];

export default function RouteNav() {
  const pathname = usePathname();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 p-2">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-1 text-xs">
          <span className="text-yellow-700 font-medium">DEV NAV:</span>
          {routes.map((route, index) => (
            <div key={route.path} className="flex items-center">
              {index > 0 && <span className="text-yellow-400 mx-1">|</span>}
              <Link
                href={route.path}
                className={`px-2 py-1 rounded transition-colors ${
                  pathname === route.path
                    ? "bg-yellow-200 text-yellow-900 font-medium"
                    : "text-yellow-600 hover:bg-yellow-100 hover:text-yellow-800"
                }`}
                title={route.description}
              >
                {route.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}