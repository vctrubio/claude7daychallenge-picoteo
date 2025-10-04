"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import Dropdown from "./Dropdown";

export default function SeedNavBar() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [seedStatus, setSeedStatus] = useState<"idle" | "success" | "error">("idle");
  const [clearStatus, setClearStatus] = useState<"idle" | "success" | "error">("idle");
  const seedDatabase = useMutation(api.seedData.seedDatabase);
  const clearDatabase = useMutation(api.seedData.clearDatabase);

  const tables = [
    { name: "users", label: "Users" },
    { name: "owners", label: "Owners" },
    { name: "shops", label: "Shops" },
    { name: "products", label: "Products" },
    { name: "customers", label: "Customers" },
    { name: "orders", label: "Orders" },
  ];

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedStatus("idle");
    
    try {
      await seedDatabase({});
      setSeedStatus("success");
      setTimeout(() => setSeedStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to seed database:", error);
      setSeedStatus("error");
      setTimeout(() => setSeedStatus("idle"), 3000);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearDatabase = async (tablesToClear: string[]) => {
    setIsClearing(true);
    setClearStatus("idle");
    
    try {
      await clearDatabase({ tables: tablesToClear });
      setClearStatus("success");
      setTimeout(() => setClearStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to clear database:", error);
      setClearStatus("error");
      setTimeout(() => setClearStatus("idle"), 3000);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-purple-50 border-b border-purple-200 p-2">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-purple-700 font-medium">DEV SEEDS:</span>
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding || isClearing}
              className={`px-3 py-1 rounded transition-colors text-xs font-medium ${
                isSeeding || isClearing
                  ? "bg-purple-200 text-purple-600 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isSeeding ? "Seeding..." : "Seed Database"}
            </button>
            
            <Dropdown
              disabled={isSeeding || isClearing}
              trigger={
                <span className={`px-3 py-1 rounded transition-colors text-xs font-medium flex items-center gap-1 ${
                  isSeeding || isClearing
                    ? "bg-red-200 text-red-600 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}>
                  {isClearing ? "Clearing..." : "Clear Database"}
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L11.414 12l3.293 3.293a1 1 0 01-1.414 1.414L10 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 12 5.293 8.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              }
            >
              {({ closeDropdown }: { closeDropdown: () => void }) => (
                <div className="py-1">
                  <button
                    onClick={() => {
                      handleClearDatabase([]);
                      closeDropdown();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L7.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l2.293 2.293a1 1 0 001.414-1.414L11.414 12l1.293-1.293z" clipRule="evenodd" />
                    </svg>
                    Clear All Tables
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-4 py-2 text-xs text-gray-500 font-medium">Clear Individual Tables:</div>
                  {tables.map((table) => (
                    <button
                      key={table.name}
                      onClick={() => {
                        handleClearDatabase([table.name]);
                        closeDropdown();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      {table.label}
                    </button>
                  ))}
                </div>
              )}
            </Dropdown>
          </div>
          
          {(seedStatus !== "idle" || clearStatus !== "idle") && (
            <div className="flex items-center gap-2 text-xs">
              {seedStatus === "success" && (
                <div className="flex items-center gap-1 text-green-700">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Database seeded successfully!</span>
                </div>
              )}
              
              {clearStatus === "success" && (
                <div className="flex items-center gap-1 text-green-700">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Database cleared successfully!</span>
                </div>
              )}
              
              {seedStatus === "error" && (
                <div className="flex items-center gap-1 text-red-700">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Failed to seed database</span>
                </div>
              )}

              {clearStatus === "error" && (
                <div className="flex items-center gap-1 text-red-700">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Failed to clear database</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="text-xs text-purple-600 mt-1">
          Creates sample users, shops, and products for testing
        </div>
      </div>
    </div>
  );
}