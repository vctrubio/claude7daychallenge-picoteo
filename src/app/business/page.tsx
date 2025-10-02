"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateShopForm from "../../forms/CreateShopForm";
import { CreateShopFormData } from "../../forms/schemas";

export default function BusinessPage() {
  console.log("dev:BusinessPage:render - Business page rendering");

  const { user, isAuthenticated, isOwner, refreshUser } = useAuth();
  const router = useRouter();
  const myShops = useQuery(
    api.businessShops.getMyShops,
    user ? { userId: user._id } : "skip",
  );
  const createShop = useMutation(api.businessShops.createShop);
  const updateUserRole = useMutation(api.users.updateUserRole);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isCreatingShop, setIsCreatingShop] = useState(false);

  console.log("dev:BusinessPage:state", {
    user: user?._id,
    isAuthenticated,
    isOwner,
    myShopsCount: myShops?.length,
    showCreateForm,
  });

  // Redirect non-owners to home page, but only after user data is fully loaded and not updating
  useEffect(() => {
    console.log("dev:BusinessPage:effect - checking auth and redirects", {
      isAuthenticated,
      isOwner,
      isUpdatingRole,
      user,
    });
    if (!isAuthenticated && user === null) {
      console.log(
        "dev:BusinessPage:effect - not authenticated, redirecting to home",
      );
      router.replace("/");
    } else if (user && isAuthenticated && !isOwner && !isUpdatingRole) {
      console.log(
        "dev:BusinessPage:effect - authenticated but not owner, redirecting to home",
      );
      router.replace("/");
    }
  }, [user, isAuthenticated, isOwner, router, isUpdatingRole]);

  const handleBecomeOwner = async () => {
    console.log("dev:BusinessPage:becomeOwner - attempting to become owner", {
      userId: user?._id,
    });
    if (!user) return;

    setIsUpdatingRole(true);
    try {
      await updateUserRole({ userId: user._id, role: "owner" });
      console.log("dev:BusinessPage:becomeOwner - successfully became owner");
      // Force refresh user data to get updated role
      refreshUser();
      // Wait a bit for the refresh to complete
      setTimeout(() => setIsUpdatingRole(false), 500);
    } catch (error) {
      console.error(
        "dev:BusinessPage:becomeOwner - failed to become owner",
        error,
      );
      setIsUpdatingRole(false);
    }
  };

  const handleCreateShop = async (formData: CreateShopFormData) => {
    console.log("dev:BusinessPage:createShop - attempting to create shop", {
      userId: user?._id,
      formData,
    });
    if (!user) return;

    setIsCreatingShop(true);
    try {
      await createShop({ userId: user._id, ...formData });
      console.log("dev:BusinessPage:createShop - successfully created shop");
      setShowCreateForm(false);
    } catch (error) {
      console.error(
        "dev:BusinessPage:createShop - failed to create shop",
        error,
      );
    } finally {
      setIsCreatingShop(false);
    }
  };

  // Prevent rendering while redirecting non-owners or unauthenticated users
  if (!isAuthenticated && user === null) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">Redirecting to home...</div>
    );
  }

  if (user && isAuthenticated && !isOwner && !isUpdatingRole) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">Redirecting to home...</div>
    );
  }

  // Still loading user data
  if (!user && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">Loading user data...</div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Become a Business Owner
            </h1>
            <p className="text-gray-600 mb-6">
              Start selling your products on Picoteo and connect with your local
              community!
            </p>
            <button
              onClick={handleBecomeOwner}
              disabled={isUpdatingRole}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingRole ? "Updating..." : "Switch to Business Account"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (myShops === undefined) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Business Dashboard
          </h1>
          <p className="text-gray-600">Manage your shops and products</p>
        </header>

        <main>
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create New Shop
            </button>
          </div>

          {myShops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                You haven&apos;t created any shops yet.
              </p>
              <p className="text-sm text-gray-400">
                Create your first shop to start selling!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myShops.map((shop) => (
                <div
                  key={shop._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {shop.name}
                  </h2>
                  <p className="text-gray-600 mb-3">{shop.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{shop.address}</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Manage Products
                  </button>
                </div>
              ))}
            </div>
          )}

          {showCreateForm && (
            <CreateShopForm
              onSubmit={handleCreateShop}
              onCancel={() => setShowCreateForm(false)}
              isSubmitting={isCreatingShop}
            />
          )}
        </main>
      </div>
    </div>
  );
}
