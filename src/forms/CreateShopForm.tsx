"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "./FormModal";
import { createShopSchema, CreateShopFormData } from "./schemas";

interface CreateShopFormProps {
  onSubmit: (formData: CreateShopFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function CreateShopForm({ onSubmit, onCancel, isSubmitting = false }: CreateShopFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateShopFormData>({
    resolver: zodResolver(createShopSchema),
    mode: "onChange",
  });

  const onSubmitHandler = async (data: CreateShopFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <FormModal
      title="Create New Shop"
      onClose={onCancel}
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shop Name *
          </label>
          <input
            type="text"
            {...register("name")}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 transition-colors ${
              errors.name 
                ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            placeholder="Enter your shop name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register("description")}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 resize-none transition-colors ${
              errors.description 
                ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            rows={4}
            placeholder="Describe what your shop offers (at least 10 characters)"
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            {...register("address")}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 transition-colors ${
              errors.address 
                ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            placeholder="Enter your shop address"
            disabled={isSubmitting}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "Creating..." : "Create Shop"}
          </button>
        </div>
      </form>
    </FormModal>
  );
}