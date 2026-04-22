import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useFinalizeFacebookPost } from "@/lib/hooks/useContentGenerator";
import { FinalizeFacebookPostPayload } from "@/lib/services/contentGeneratorService";
import { toast } from "sonner";
import { FacebookPost } from "@/types/facebook";
import {
  Facebook,
  Instagram,
  FileText,
  Calendar,
  Clock,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

interface ViewDraftModalProps {
  post: FacebookPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewDraftModal({ post, isOpen, onClose }: ViewDraftModalProps) {
  const [actionMode, setActionMode] = useState<"view" | "schedule" | "publish">(
    "view",
  );
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const queryClient = useQueryClient();

  const { mutateAsync: handleFinalizePost, isPending } =
    useFinalizeFacebookPost();

  if (!post) return null;

  const imageUrl = post.media && post.media.length > 0 ? post.media[0].url : "";

  const handleActionClick = async (mode: "schedule" | "publish") => {
    if (mode === "publish") {
      await executeAction("publish");
    } else {
      setActionMode(mode);
    }
  };

  const executeAction = async (actionFinalMode: "schedule" | "publish") => {
    // Shared validations
    if (!post?.pageId) {
      toast.error("Missing Page ID for this post.");
      return;
    }
    if (!post?.content?.message) {
      toast.error("Missing caption for this post.");
      return;
    }
    if (!imageUrl) {
      toast.error("Missing image for this post.");
      return;
    }

    // Schedule-specific validation
    if (actionFinalMode === "schedule") {
      if (!scheduleDate || !scheduleTime) {
        toast.error("Please select both date and time.");
        return;
      }
    }

    try {
      const payload: FinalizeFacebookPostPayload = {
        status: actionFinalMode === "schedule" ? "SCHEDULED" : "PUBLISHED",
        pageId: post.pageId,
        postType: post.postType || "SINGLE_IMAGE",
        content: {
          message: post.content.message,
          hashtags: post.content.hashtags || [],
        },
        platforms: post.platforms || ["facebook"],
        mediaUrls: [imageUrl],
      };

      if (actionFinalMode === "schedule") {
        const selectedDateTime = new Date(`${scheduleDate}T${scheduleTime}:00`);
        // Fix timezone difference
        selectedDateTime.setHours(selectedDateTime.getHours());
        const scheduledTimeIso = selectedDateTime
          .toISOString()
          .replace(".000", "");
        payload.scheduledTime = scheduledTimeIso;
      }

      await handleFinalizePost(payload);

      toast.success(
        actionFinalMode === "schedule"
          ? "Post scheduled successfully."
          : "Post published successfully.",
      );

      // Reset state and close
      setActionMode("view");
      setScheduleDate("");
      setScheduleTime("");
      onClose();

      // Refresh content list
      queryClient.invalidateQueries({ queryKey: ["savedDrafts"] });
    } catch (error) {
      console.error("Action failed:", error);
      toast.error(`Failed to ${actionFinalMode} post. Please try again.`);
    }
  };

  const handleConfirmAction = async () => {
    if (actionMode === "schedule" || actionMode === "publish") {
      await executeAction(actionMode);
    }
  };

  const handleModalClose = () => {
    setActionMode("view");
    setScheduleDate("");
    setScheduleTime("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="relative">
          {/* Header Image */}
          <div className="relative h-64 w-full bg-gray-100">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.listingName || "Post Image"}
                className="h-full w-full object-cover"
                width={800}
                height={400}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <FileText className="h-16 w-16" />
              </div>
            )}

            {/* Platform Badges */}
            <div className="absolute top-4 right-4 flex gap-2">
              {post.platforms?.includes("facebook") && (
                <div className="bg-white p-2 rounded-full shadow-lg">
                  <Facebook className="h-5 w-5 text-blue-600" />
                </div>
              )}
              {post.platforms?.includes("instagram") && (
                <div className="bg-white p-2 rounded-full shadow-lg">
                  <Instagram className="h-5 w-5 text-pink-600" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-[#0B3B36]">
                {post.listingName || "Untitled Post"}
              </DialogTitle>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  post.status === "PUBLISHED"
                    ? "bg-[#F0F6E7] text-[#65A30D] border-[#CFE2B4]"
                    : post.status === "SCHEDULED"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : post.status === "FAILED"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {post.status}
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Message Content */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Content
              </h4>
              <p className="text-[#0B3B36] whitespace-pre-wrap leading-relaxed">
                {post.content?.message || "No content provided."}
              </p>
            </div>

            {/* Hashtags */}
            {post.content?.hashtags && post.content.hashtags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Hashtags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {post.content.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-sm"
                    >
                      {tag.startsWith("#") ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
              {post.updatedAt && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase">
                    {post.status === "SCHEDULED"
                      ? "Scheduled For"
                      : "Last Updated"}
                  </h4>
                  <p className="text-sm text-[#0B3B36] font-medium mt-1">
                    {new Date(post.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {post.postType && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase">
                    Post Type
                  </h4>
                  <p className="text-sm text-[#0B3B36] font-medium mt-1 capitalize">
                    {post.postType.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            {actionMode === "view" ? (
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleModalClose}
                  className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleActionClick("schedule")}
                  className="px-5 py-2.5 rounded-xl font-bold text-[#76A91F] bg-[#F6FAF1] border border-[#76A91F] hover:bg-[#EDF6E1] transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#7AAE2A]/25"
                >
                  Schedule
                </button>
                <button
                  onClick={() => handleActionClick("publish")}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#76A91F] hover:bg-[#6A9A1B] shadow-[0_4px_10px_rgba(118,169,31,0.2)] transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#76A91F]/30"
                >
                  Publish
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="text-sm font-bold text-[#0B3B36] mb-4">
                  Set Date and Time to{" "}
                  {actionMode === "schedule" ? "Schedule" : "Publish"}
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#65A30D] focus:ring-2 focus:ring-[#7AAE2A]/20 outline-none text-sm bg-white"
                        disabled={isPending}
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">
                      Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#65A30D] focus:ring-2 focus:ring-[#7AAE2A]/20 outline-none text-sm bg-white"
                        disabled={isPending}
                      />
                      <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setActionMode("view")}
                    className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                    disabled={isPending}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    disabled={!scheduleDate || !scheduleTime || isPending}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#76A91F] hover:bg-[#6A9A1B] shadow-[0_4px_10px_rgba(118,169,31,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#76A91F]/30 flex items-center gap-2"
                  >
                    {isPending && (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    )}
                    {isPending ? "Processing..." : "Confirm Schedule"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
