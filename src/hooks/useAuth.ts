"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useAuth() {
  console.log("dev:useAuth:hook - initializing auth hook");
  
  const [currentUserId, setCurrentUserId] = useState<Id<"users"> | null>(null);
  const createUser = useMutation(api.users.createSimpleUser);
  const user = useQuery(api.users.getUser, currentUserId ? { userId: currentUserId } : "skip");

  console.log("dev:useAuth:state", { 
    currentUserId, 
    user: user ? { id: user._id, role: user.role } : null, 
    isAuthenticated: !!user,
    userDataLoaded: user !== undefined 
  });

  useEffect(() => {
    console.log("dev:useAuth:effect - checking localStorage for existing user");
    const stored = localStorage.getItem("picoteoUserId");
    if (stored) {
      console.log("dev:useAuth:effect - found stored user ID:", stored);
      setCurrentUserId(stored as Id<"users">);
    } else {
      console.log("dev:useAuth:effect - no stored user found");
    }
  }, []);

  const signIn = async () => {
    console.log("dev:useAuth:signIn - attempting sign in", { currentUserId });
    if (!currentUserId) {
      console.log("dev:useAuth:signIn - creating new user");
      const newUserId = await createUser({ role: "customer" });
      console.log("dev:useAuth:signIn - new user created:", newUserId);
      localStorage.setItem("picoteoUserId", newUserId);
      setCurrentUserId(newUserId);
    } else {
      console.log("dev:useAuth:signIn - user already exists, skipping creation");
    }
  };

  const signOut = () => {
    console.log("dev:useAuth:signOut - signing out user");
    localStorage.removeItem("picoteoUserId");
    setCurrentUserId(null);
  };

  const refreshUser = () => {
    console.log("dev:useAuth:refreshUser - forcing user data refresh");
    const storedUserId = currentUserId;
    if (storedUserId) {
      setCurrentUserId(null);
      // Use requestAnimationFrame for smoother refresh
      requestAnimationFrame(() => setCurrentUserId(storedUserId));
    }
  };

  const authState = {
    user,
    signIn,
    signOut,
    refreshUser,
    isAuthenticated: !!user,
    isOwner: user?.role === "owner",
    isCustomer: user?.role === "customer",
  };

  console.log("dev:useAuth:return", authState);
  return authState;
}