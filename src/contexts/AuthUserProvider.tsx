"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface AuthContextType {
  user: any;
  currentUserId: Id<"users"> | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  isCustomer: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthUserProvider({ children }: { children: ReactNode }) {
  console.log("dev:AuthProvider:render - AuthUserProvider rendering");
  
  const [currentUserId, setCurrentUserId] = useState<Id<"users"> | null>(null);
  const createUser = useMutation(api.users.createSimpleUser);
  const user = useQuery(api.users.getUser, currentUserId ? { userId: currentUserId } : "skip");

  console.log("dev:AuthProvider:state", { 
    currentUserId, 
    user: user ? { id: user._id, role: user.role } : null, 
    isAuthenticated: !!user,
    userDataLoaded: user !== undefined 
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    console.log("dev:AuthProvider:init - checking localStorage for existing user");
    const stored = localStorage.getItem("picoteoUserId");
    if (stored) {
      console.log("dev:AuthProvider:init - found stored user ID:", stored);
      setCurrentUserId(stored as Id<"users">);
    } else {
      console.log("dev:AuthProvider:init - no stored user found");
    }
  }, []);

  // Handle case where user ID exists but user was deleted from database
  useEffect(() => {
    if (currentUserId && user === null) {
      console.log("dev:AuthProvider:cleanup - user ID exists but user not found in database, clearing auth state");
      localStorage.removeItem("picoteoUserId");
      setCurrentUserId(null);
    }
  }, [currentUserId, user]);

  const signIn = async () => {
    console.log("dev:AuthProvider:signIn - attempting sign in", { currentUserId });
    if (!currentUserId) {
      try {
        console.log("dev:AuthProvider:signIn - creating new user");
        const newUserId = await createUser({ role: "customer" });
        console.log("dev:AuthProvider:signIn - new user created:", newUserId);
        localStorage.setItem("picoteoUserId", newUserId);
        setCurrentUserId(newUserId);
        toast.success("Welcome to Picoteo!");
      } catch (error) {
        console.error("dev:AuthProvider:signIn - error creating user:", error);
        toast.error("Cannot connect to Convex. Please check if the server is running.");
      }
    } else {
      console.log("dev:AuthProvider:signIn - user already exists, skipping creation");
    }
  };

  const signOut = () => {
    console.log("dev:AuthProvider:signOut - signing out user");
    localStorage.removeItem("picoteoUserId");
    setCurrentUserId(null);
  };

  const refreshUser = () => {
    console.log("dev:AuthProvider:refreshUser - forcing user data refresh");
    const storedUserId = currentUserId;
    if (storedUserId) {
      setCurrentUserId(null);
      // Use requestAnimationFrame for smoother refresh
      requestAnimationFrame(() => setCurrentUserId(storedUserId));
    }
  };

  const contextValue: AuthContextType = {
    user,
    currentUserId,
    isAuthenticated: !!user,
    isOwner: user?.role === "owner",
    isCustomer: user?.role === "customer",
    signIn,
    signOut,
    refreshUser,
  };

  console.log("dev:AuthProvider:contextValue", contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthUserProvider");
  }
  return context;
}