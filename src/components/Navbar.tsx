"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

const useNavbarLogic = () => {
  console.log("dev:Navbar:hook - initializing navbar logic");
  
  const { user, signIn, signOut, isAuthenticated, isOwner } = useAuth();

  console.log("dev:Navbar:state", { 
    user: user?._id, 
    isAuthenticated, 
    isOwner,
    userRole: user?.role 
  });

  const handleSignIn = () => {
    console.log("dev:Navbar:signIn - sign in button clicked");
    signIn();
  };

  const handleSignOut = () => {
    console.log("dev:Navbar:signOut - sign out button clicked");
    signOut();
  };

  const handleBusinessClick = () => {
    console.log("dev:Navbar:businessClick - business link clicked");
  };

  return {
    user,
    isAuthenticated,
    isOwner,
    handleSignIn,
    handleSignOut,
    handleBusinessClick,
  };
};

const Logo = () => (
  <Link href="/" className="text-xl font-bold text-neutral-900">
    Picoteo
  </Link>
);

const UserInfo = ({ user, isOwner }: { user: any; isOwner: boolean }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className={`px-2 py-1 rounded-full text-xs ${
      isOwner ? 'bg-neutral-200 text-neutral-800' : 'bg-emerald-100 text-emerald-800'
    }`}>
      {user.role}
    </span>
    <span className="text-neutral-500 text-xs font-mono">
      ID: {user._id.slice(-6)}
    </span>
  </div>
);

const NavigationLinks = ({ 
  isOwner, 
  onBusinessClick 
}: { 
  isOwner: boolean; 
  onBusinessClick: () => void;
}) => (
  <>
  </>
);

const AuthButtons = ({ 
  isAuthenticated, 
  onSignIn, 
  onSignOut 
}: { 
  isAuthenticated: boolean; 
  onSignIn: () => void; 
  onSignOut: () => void; 
}) => (
  <>
    {isAuthenticated ? (
      <button
        onClick={onSignOut}
        className="text-neutral-600 hover:text-neutral-800 px-3 py-2"
      >
        Sign Out
      </button>
    ) : (
      <button
        onClick={onSignIn}
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Enter Marketplace
      </button>
    )}
  </>
);

export default function Navbar() {
  console.log("dev:Navbar:render - Navbar component rendering");
  
  const {
    user,
    isAuthenticated,
    isOwner,
    handleSignIn,
    handleSignOut,
    handleBusinessClick,
  } = useNavbarLogic();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          
          <div className="flex items-center gap-4">
            {isAuthenticated && user && (
              <>
                <UserInfo user={user} isOwner={isOwner} />
                <NavigationLinks 
                  isOwner={isOwner}
                  onBusinessClick={handleBusinessClick}
                />
              </>
            )}
            
            <AuthButtons 
              isAuthenticated={isAuthenticated}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}