"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock3,
  Eye,
  Heart,
  Instagram,
  Pencil,
  Trash2,
  MessageCircle,
  FileText,
  AlertCircle,
  Facebook,
  Loader2,
} from "lucide-react";
import {
  useGetSavedDrafts,
  useDeleteSavedDrafts,
} from "@/lib/hooks/useSavedDrafts";
import { toast } from "sonner";
import { FacebookPost, FacebookPostStatus } from "@/types/facebook";
import Image from "next/image";
import { ViewDraftModal } from "./ViewDraftModal";

const TABS = [
  { key: "DRAFT", label: "Draft" },
  { key: "SCHEDULED", label: "Scheduled" },
  { key: "PUBLISHED", label: "Published" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function StatusPill({ status }: { status: FacebookPostStatus }) {
  const map = {
    DRAFT: {
      label: "Draft",
      wrap: "bg-gray-50 text-gray-700 border-gray-200",
      Icon: FileText,
    },
    SCHEDULED: {
      label: "Scheduled",
      wrap: "bg-amber-50 text-amber-700 border-amber-200",
      Icon: Clock3,
    },
    PUBLISHED: {
      label: "Published",
      wrap: "bg-[#F0F6E7] text-[#65A30D] border-[#CFE2B4]", // Updated to brand green
      Icon: CheckCircle2,
    },
    FAILED: {
      label: "Failed",
      wrap: "bg-red-50 text-red-700 border-red-200",
      Icon: AlertCircle,
    },
  }[status] || {
    label: status,
    wrap: "bg-gray-50 text-gray-700 border-gray-200",
    Icon: FileText,
  };

  const Icon = map.Icon;

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        map.wrap,
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      {map.label}
    </div>
  );
}

function SocialCornerIcon({ platforms }: { platforms: string[] }) {
  // If multiple platforms, maybe show overlap or just one. Assuming Facebook for now based on response.
  if (platforms?.includes("instagram"))
    return (
      <div className="absolute right-3 top-3 z-10 rounded-lg bg-white/90 p-1.5 shadow">
        <Instagram className="h-4 w-4 text-pink-600" />
      </div>
    );

  if (platforms?.includes("facebook"))
    return (
      <div className="absolute right-3 top-3 z-10 rounded-lg bg-white/90 p-1.5 shadow">
        <Facebook className="h-4 w-4 text-blue-600" />
      </div>
    );

  return null;
}

// NOTE: Real API doesn't seem to return stats yet based on user JSON
// But keeping the component structure in case we add it later
function StatRow({
  stats,
}: {
  stats: { views: number; likes: number; comments: number };
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <div className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
        <Eye className="h-4 w-4" />
        {stats.views} views
      </div>
      <div className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
        <Heart className="h-4 w-4" />
        {stats.likes} likes
      </div>
      <div className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
        <MessageCircle className="h-4 w-4" />
        {stats.comments} comments
      </div>
    </div>
  );
}

function ScheduleRow({ scheduledAt }: { scheduledAt: string }) {
  // Format date nicely
  const displayDate = new Date(scheduledAt).toLocaleString();
  return (
    <div className="mt-3 inline-flex w-full items-center gap-2 rounded-xl bg-amber-50 px-3 py-3 text-xs font-medium text-amber-800">
      <Calendar className="h-4 w-4" />
      {displayDate}
    </div>
  );
}

function PostCard({
  post,
  onView,
}: {
  post: FacebookPost;
  onView: (post: FacebookPost) => void;
}) {
  const imageUrl = post.media && post.media.length > 0 ? post.media[0].url : "";
  const { mutate: deleteDraft, isPending: isDeleting } = useDeleteSavedDrafts();

  const handleDelete = () => {
    deleteDraft(post._id, {
      onSuccess: () => {
        toast.success("Post deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete post");
      },
    });
  };

  // Placeholder stats - replace when API supports it
  const stats = { views: 0, likes: 0, comments: 0 };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-[#65A30D] hover:shadow-md">
      {/* image */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <SocialCornerIcon platforms={post.platforms} />
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.listingName || "Post Image"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width={500}
            height={500}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <FileText className="h-10 w-10" />
          </div>
        )}
      </div>

      {/* content */}
      <div className="p-4">
        {/* <div className="flex items-center justify-between gap-3">
          <StatusPill status={post.status} />
          <span className="text-xs text-gray-400">{createdAgo}</span>
        </div> */}

        <h3 className="mt-3 text-lg font-bold text-[#0B3B36] truncate">
          {post.listingName || "Untitled Post"}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-[#0B3B36]/80 min-h-[40px]">
          {post.content?.message || "No description"}
        </p>

        {/* scheduled/published extras - logic placeholder, adjust when API provides real scheduledAt */}
        {post.status === "SCHEDULED" && post.updatedAt ? (
          <ScheduleRow scheduledAt={post.updatedAt} />
        ) : null}

        {post.status === "PUBLISHED" ? <StatRow stats={stats} /> : null}

        {/* actions */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onView(post)}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#65A30D] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b910e] cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          <button
            aria-label="Edit"
            className="grid h-11 w-11 place-items-center rounded-xl border border-[#CFE2B4] bg-white text-[#0B3B36] transition hover:bg-[#F0F6E7] cursor-pointer"
            onClick={() =>
              (window.location.href = `/saved-drafts/edit-saved-draft/${post._id}`)
            }
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            aria-label="Delete"
            onClick={handleDelete}
            disabled={isDeleting}
            className="grid h-11 w-11 place-items-center rounded-xl border border-red-200 bg-white text-red-500 transition hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SavedDrafts() {
  const [activeTab, setActiveTab] = useState<TabKey>("DRAFT");
  const [selectedPost, setSelectedPost] = useState<FacebookPost | null>(null);
  const { data: savedDrafts, isLoading } = useGetSavedDrafts(activeTab);

  // console.log(savedDrafts);

  const posts = savedDrafts?.data || [];

  return (
    <div className="w-full px-4 py-6">
      {/* container */}
      <div className="mx-auto w-full container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0B3B36]">All Content</h1>
          <p className="text-sm text-[#0B3B36]/70">Manage your All Content.</p>
        </div>

        {/* tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "border-[#65A30D] bg-[#65A30D] text-white shadow-sm"
                    : "border-gray-200 bg-white text-[#0B3B36] hover:bg-[#F0F6E7] hover:border-[#CFE2B4]",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* grid */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading-spinner text-[#65A30D]">Loading...</span>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onView={(p) => setSelectedPost(p)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#0B3B36]/60">
              No posts found.
            </div>
          )}
        </div>
      </div>

      <ViewDraftModal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        post={selectedPost}
      />
    </div>
  );
}
