import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FacebookPost } from "@/types/facebook";
import { Facebook, Instagram, FileText } from "lucide-react";
import Image from "next/image";

interface ViewDraftModalProps {
  post: FacebookPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewDraftModal({ post, isOpen, onClose }: ViewDraftModalProps) {
  if (!post) return null;

  const imageUrl = post.media && post.media.length > 0 ? post.media[0].url : "";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
