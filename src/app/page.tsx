"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

const useHomePageLogic = () => {
  console.log("dev:HomePage:hook - initializing home page logic");
  
  const { user, signIn, isAuthenticated, isOwner } = useAuth();

  console.log("dev:HomePage:state", { 
    user: user?._id, 
    isAuthenticated, 
    isOwner,
    userRole: user?.role 
  });

  const handleGetStarted = () => {
    console.log("dev:HomePage:getStarted - get started button clicked");
    signIn();
  };

  return {
    user,
    isAuthenticated,
    isOwner,
    handleGetStarted,
  };
};

const HeroSection = () => (
  <div className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-700 to-neutral-900">Picoteo</span>
        </h1>
        <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-4xl mx-auto leading-relaxed">
          Your local marketplace for seasonal produce and community goods. 
          Browse local businesses, discover what they have to offer, and get everything delivered straight to your doorstep.
        </p>
      </div>
    </div>
  </div>
);

const HowItWorksSection = () => (
  <div className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-xl text-gray-600">Simple steps to connect with your local community</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-12">
        <div className="text-center group">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-3">1. Browse</h3>
          <p className="text-neutral-600">Discover local shops and their seasonal offerings in your community</p>
        </div>
        
        <div className="text-center group">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10m-10 0v5a2 2 0 002 2h6a2 2 0 002-2v-5" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-3">2. Select</h3>
          <p className="text-neutral-600">Choose fresh products and add them to your basket with a simple click</p>
        </div>
        
        <div className="text-center group">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-3">3. Enjoy</h3>
          <p className="text-neutral-600">Relax while we handle delivery straight to your doorstep</p>
        </div>
      </div>
    </div>
  </div>
);

const FeaturesSection = () => (
  <div className="py-20 bg-neutral-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Supporting Local Communities</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Fresh & Seasonal</h3>
                <p className="text-neutral-600">Get the freshest seasonal produce directly from local farmers and artisans</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Local Support</h3>
                <p className="text-neutral-600">Support small businesses in your community and strengthen local economy</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-neutral-300 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Quick Delivery</h3>
                <p className="text-neutral-600">Fast and reliable delivery service bringing local goods to your door</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl p-8 transform rotate-3">
            <div className="bg-white rounded-xl p-6 transform -rotate-3 shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">Local Marketplace</h4>
                <p className="text-neutral-600 text-sm">Connecting communities through fresh, local goods</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UnauthenticatedBanner = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <div className="bg-gradient-to-r from-neutral-700 to-neutral-900 py-16">
    <div className="max-w-4xl mx-auto text-center px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
      <p className="text-xl text-neutral-300 mb-8">Join our community and discover amazing local businesses</p>
      <button
        onClick={onGetStarted}
        className="bg-white text-neutral-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-neutral-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Enter Marketplace
      </button>
    </div>
  </div>
);

const AuthenticatedBanner = ({ user, isOwner }: { user: any; isOwner: boolean }) => (
  <div className="bg-gradient-to-r from-emerald-600 to-neutral-700 py-12">
    <div className="max-w-6xl mx-auto px-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome back, {user.name || "Friend"}!
            </h2>
            <p className="text-emerald-100 text-lg">
              {isOwner 
                ? "Manage your business and reach more customers" 
                : "Discover fresh products from local businesses"
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/profile"
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors border border-white/20"
            >
              Edit Profile
            </Link>
            <Link
              href={isOwner ? "/business" : "/shops"}
              className="bg-white text-neutral-700 px-6 py-3 rounded-lg font-medium hover:bg-neutral-50 transition-colors shadow-lg"
            >
              {isOwner ? "Business Dashboard" : "Browse Shops"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function HomePage() {
  console.log("dev:HomePage:render - Home component rendering");
  
  const {
    user,
    isAuthenticated,
    isOwner,
    handleGetStarted,
  } = useHomePageLogic();

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {isAuthenticated && user ? (
        <AuthenticatedBanner user={user} isOwner={isOwner} />
      ) : (
        <UnauthenticatedBanner onGetStarted={handleGetStarted} />
      )}
      
      <HowItWorksSection />
      <FeaturesSection />
      
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Picoteo</h3>
          <p className="text-neutral-300 mb-6">Connecting communities through local commerce</p>
          <div className="flex justify-center space-x-6">
            <span className="text-neutral-400">Built with ❤️ for local communities</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
