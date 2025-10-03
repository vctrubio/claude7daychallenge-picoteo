"use client";

import { useAuth } from "../../hooks/useAuth";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OrderCard from "../../components/OrderCard";
import { Building2, User, ToggleLeft, ToggleRight } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required").max(20, "Phone must be less than 20 characters"),
  address: z.string().min(1, "Address is required").max(100, "Address must be less than 100 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const useProfileLogic = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<"idle" | "success" | "error">("idle");
  const [viewMode, setViewMode] = useState<"orders" | "shops">("orders");
  
  const orders = useQuery(api.orders.getUserOrders, user ? { userId: user._id } : "skip");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
    values: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsUpdating(true);
    setUpdateStatus("idle");
    
    try {
      await updateUserProfile({
        userId: user._id,
        name: data.name,
        email: data.email || undefined,
        phone: data.phone,
        address: data.address,
      });
      
      refreshUser();
      setUpdateStatus("success");
      setTimeout(() => setUpdateStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setUpdateStatus("error");
      setTimeout(() => setUpdateStatus("idle"), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    user,
    isAuthenticated,
    register,
    handleSubmit,
    errors,
    isDirty,
    isUpdating,
    updateStatus,
    onSubmit,
    router,
    orders,
    viewMode,
    setViewMode,
  };
};

const BusinessToggle = ({ user, viewMode, setViewMode }: { user: any; viewMode: string; setViewMode: (mode: "orders" | "shops") => void }) => {
  if (user?.role !== "owner") return null;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 mb-6">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setViewMode("orders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === "orders" 
              ? "bg-emerald-100 text-emerald-700" 
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <User className="w-4 h-4" />
          My Orders
        </button>
        <button
          onClick={() => setViewMode("shops")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === "shops" 
              ? "bg-emerald-100 text-emerald-700" 
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          My Shops
        </button>
      </div>
    </div>
  );
};

const OrdersSection = ({ orders }: { orders: any[] | undefined }) => {
  if (!orders) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-100 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-100 text-center">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No orders yet</h3>
        <p className="text-neutral-600">Start shopping to see your orders here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">Order History</h2>
      <div className="grid gap-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

const ShopsSection = () => (
  <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-100 text-center">
    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Shop Management</h3>
    <p className="text-neutral-600">Shop management features coming soon!</p>
  </div>
);

const AvatarPlaceholder = ({ name, role }: { name: string; role: string }) => (
  <div className="relative">
    <div className="w-24 h-24 bg-gradient-to-br from-neutral-600 to-neutral-800 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
      {name ? name.charAt(0).toUpperCase() : "?"}
    </div>
    <div className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-medium ${
      role === "owner" ? "bg-neutral-200 text-neutral-800" : "bg-emerald-100 text-emerald-800"
    }`}>
      {role}
    </div>
  </div>
);

const ProfileCard = ({ 
  user, 
  register, 
  errors, 
  isDirty, 
  isUpdating, 
  updateStatus,
  onSubmit 
}: {
  user: any;
  register: any;
  errors: any;
  isDirty: boolean;
  isUpdating: boolean;
  updateStatus: string;
  onSubmit: (e: React.FormEvent) => void;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
    {/* Header */}
    <div className="bg-gradient-to-r from-neutral-700 to-neutral-900 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold">Profile</h2>
        <div className="text-white text-xs opacity-75">
          ID: {user._id.slice(-8)}
        </div>
      </div>
    </div>

    {/* Avatar Section */}
    <div className="px-6 py-6 text-center border-b border-gray-100">
      <AvatarPlaceholder name={user.name || ""} role={user.role} />
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {user.name || "No Name Set"}
        </h3>
        <p className="text-sm text-gray-500">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>

    {/* Form Section */}
    <form onSubmit={onSubmit} className="px-6 py-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          {...register("name")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-neutral-900 transition-colors ${
            errors.name 
              ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
              : "border-neutral-300 focus:ring-emerald-500 focus:border-emerald-500"
          }`}
          placeholder="Enter your full name"
          disabled={isUpdating}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-neutral-900 transition-colors ${
            errors.email 
              ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
              : "border-neutral-300 focus:ring-emerald-500 focus:border-emerald-500"
          }`}
          placeholder="your.email@example.com"
          disabled={isUpdating}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone *
        </label>
        <input
          type="tel"
          {...register("phone")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-neutral-900 transition-colors ${
            errors.phone 
              ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
              : "border-neutral-300 focus:ring-emerald-500 focus:border-emerald-500"
          }`}
          placeholder="+1 (555) 123-4567"
          disabled={isUpdating}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <textarea
          {...register("address")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-neutral-900 resize-none transition-colors ${
            errors.address 
              ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
              : "border-neutral-300 focus:ring-emerald-500 focus:border-emerald-500"
          }`}
          rows={3}
          placeholder="Enter your full address"
          disabled={isUpdating}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      {/* Status Messages */}
      {updateStatus !== "idle" && (
        <div className="pt-2">
          {updateStatus === "success" && (
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Profile updated successfully!
            </div>
          )}
          
          {updateStatus === "error" && (
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Failed to update profile
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={!isDirty || isUpdating}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </form>
  </div>
);

export default function ProfilePage() {
  const {
    user,
    isAuthenticated,
    register,
    handleSubmit,
    errors,
    isDirty,
    isUpdating,
    updateStatus,
    onSubmit,
    router,
    orders,
    viewMode,
    setViewMode,
  } = useProfileLogic();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and view your activity</p>
        </div>

        <BusinessToggle user={user} viewMode={viewMode} setViewMode={setViewMode} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ProfileCard
              user={user}
              register={register}
              errors={errors}
              isDirty={isDirty}
              isUpdating={isUpdating}
              updateStatus={updateStatus}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>
          
          <div>
            {viewMode === "orders" ? (
              <OrdersSection orders={orders} />
            ) : (
              <ShopsSection />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}