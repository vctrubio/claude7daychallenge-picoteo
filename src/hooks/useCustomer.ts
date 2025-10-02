"use client";

import { useState, useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";

export function useCustomer() {
  const [customerId, setCustomerId] = useState<Id<"customers"> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("customerId");
    if (stored) {
      setCustomerId(stored as Id<"customers">);
    }
  }, []);

  const saveCustomerId = (id: Id<"customers">) => {
    localStorage.setItem("customerId", id);
    setCustomerId(id);
  };

  return { customerId, saveCustomerId };
}