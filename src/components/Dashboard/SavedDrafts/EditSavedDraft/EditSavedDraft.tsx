"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import {
  useGetSingleSavedDrafts,
  useEditSavedDrafts,
} from "@/lib/hooks/useSavedDrafts";
import { toast } from "sonner";
import Image from "next/image";

type EditDraftFormData = {
  listingName: string;
  message: string;
};

export default function EditSavedDraft() {
  const router = useRouter();
  const params = useParams();
  // Ensure id is a string
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const { data: draftData, isLoading } = useGetSingleSavedDrafts(id as string);

  console.log(draftData);

  const { mutate: editDraft, isPending: isSaving } = useEditSavedDrafts(
    id as string,
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditDraftFormData>();

  // API returns single object in data, not array
  const post = draftData?.data;

  useEffect(() => {
    if (post) {
      setValue("listingName", post.listingName || "");
      setValue("message", post.content?.message || "");
    }
  }, [post, setValue]);

  const onSubmit = (data: EditDraftFormData) => {
    if (!id || !post) return;

    // Construct payload matching the API structure roughly, or what the edit endpoint expects
    // Based on user request "Automatically pre-fill... modify previously saved drafts"
    const payload = {
      listingName: data.listingName,
      content: {
        ...post.content,
        message: data.message,
      },
    };

    editDraft(payload, {
      onSuccess: () => {
        toast.success("Draft updated successfully");
        router.push("/saved-drafts");
      },
      onError: (err) => {
        console.error("Failed to update draft", err);
        toast.error("Failed to update draft");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <span className="loading-spinner text-emerald-600">
          Loading draft...
        </span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Draft not found.</p>
        <button
          onClick={() => router.back()}
          className="text-emerald-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full container px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Draft</h1>
            <p className="text-sm text-gray-500">
              Update your saved post details.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            {/* Listing Name */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Listing Name
              </label>
              <input
                {...register("listingName", {
                  required: "Listing name is required",
                })}
                type="text"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Enter listing name"
              />
              {errors.listingName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.listingName.message}
                </p>
              )}
            </div>

            {/* Message/Caption */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Caption
              </label>
              <textarea
                {...register("message", { required: "Caption is required" })}
                rows={6}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Write your post caption..."
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              Media Preview
            </h3>
            {post.media && post.media.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                <Image
                  src={post.media[0].url}
                  alt="Preview"
                  width={400}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-48 w-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-gray-400">
                No media available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
