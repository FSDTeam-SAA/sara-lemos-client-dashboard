"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Copy,
  Facebook,
  Instagram,
  Sparkles,
  RefreshCw,
  X,
  Calendar,
  Clock,
} from "lucide-react";
import {
  useGenerateContent,
  useFinalizeFacebookPost,
} from "@/lib/hooks/useContentGenerator";
import {
  GenerateContentPayload,
  FacebookContent,
  FinalizeFacebookPostPayload,
} from "@/lib/services/contentGeneratorService";
import { Campaign } from "@/lib/services/campaignService";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useGetUserIdByUserData } from "@/lib/hooks/useSocialAccounts";
import { getUserIdByUserData } from "@/lib/services/socialAccountsService";
import { useListing } from "@/lib/hooks/useListing";

interface FacebookPage {
  pageId: string;
  pageName: string;
  pageAccessToken: string;
}

type Platform = "facebook" | "instagram";

const tones = [
  "Professional",
  "Luxury & Exclusive",
  "Casual & Friendly",
  "Exciting & Energetic",
] as const;

const postTypes = [
  "Teaser",
  "Launch",
  "Explore",
  "Lifestyle",
  "Market",
  "Sold",
] as const;

export default function ContentGenerator() {
  const { data: listingData, isLoading: isListingLoading } = useListing();
  const listings = useMemo(() => listingData?.listings ?? [], [listingData]);

  const [selectedListingId, setSelectedListingId] = useState<string>("");

  const selectedListing = useMemo(
    () => listings.find((l) => l._id === selectedListingId) ?? null,
    [listings, selectedListingId],
  );

  useEffect(() => {
    if (!selectedListingId && listings.length > 0) {
      setSelectedListingId(listings[0]._id);
    }
  }, [listings, selectedListingId]);

  // ✅ Keep only ONE platforms state (typed)
  const [platforms, setPlatforms] = useState<Platform[]>(["facebook"]);

  const [tone, setTone] = useState<(typeof tones)[number]>("Professional");
  const [postType, setPostType] =
    useState<(typeof postTypes)[number]>("Teaser");
  // const [promptText, setPromptText] = useState("");
  const [content, setContent] = useState("");
  // const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [facebookContent, setFacebookContent] =
    useState<FacebookContent | null>(null);

  const { mutateAsync: handleGenerateContent, isPending } =
    useGenerateContent();
  const { mutateAsync: handleFinalizePost, isPending: isScheduling } =
    useFinalizeFacebookPost();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const sessionUser = session?.user as
    | {
      firstName?: string;
      lastName?: string;
      image?: string;
    }
    | undefined;

  const userFirstName = sessionUser?.firstName;
  const userLastName = sessionUser?.lastName;
  const userName =
    userFirstName && userLastName
      ? `${userFirstName} ${userLastName}`
      : "User Marketing";

  const userImage =
    sessionUser?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1b2631&color=fff`;

  const { data: userData, isLoading } = useGetUserIdByUserData(
    userId as string,
  );

  // Extract campaigns from userData
  /*
  const campaigns = useMemo(() => {
    if (!userData?.data || !Array.isArray(userData.data)) return [];
    return userData?.data?.flatMap(
      (item: { campaigns?: Campaign[] }) => item.campaigns || [],
    );
  }, [userData]);
  */

  // ✅ Contact states
  const [includeContact, setIncludeContact] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const charCount = useMemo(() => content.length, [content]);

  // ✅ Schedule & Draft Modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"schedule" | "draft">("schedule");
  const [isFetchingPages, setIsFetchingPages] = useState(false);
  const [facebookPages, setFacebookPages] = useState<FacebookPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const onOpenScheduleModal = async (
    mode: "schedule" | "draft" = "schedule",
  ) => {
    setModalMode(mode);
    setIsScheduleModalOpen(true);
    setIsFetchingPages(true);
    setFacebookPages([]);
    setSelectedPageId("");

    try {
      if (userId) {
        const responseData = await getUserIdByUserData(userId);
        // The service returns the response directly, so we check responseData.data or responseData depending on API format.
        // Usually, getUserIdByUserData returns response.data
        const businesses =
          responseData?.data?.facebookBusinesses ||
          responseData?.facebookBusinesses ||
          [];
        const pages =
          businesses.flatMap(
            (b: { pages?: FacebookPage[] }) => b.pages || [],
          ) || [];
        setFacebookPages(pages);
      }
    } catch (error) {
      console.error("Failed to fetch FB pages", error);
      toast.error("Failed to fetch Facebook pages");
    } finally {
      setIsFetchingPages(false);
    }
  };

  const onSchedulePost = async () => {
    if (!selectedPageId) {
      toast.error("Please select a Facebook page.");
      return;
    }
    if (modalMode === "schedule" && (!scheduleDate || !scheduleTime)) {
      toast.error("Please select both date and time.");
      return;
    }

    if (!facebookContent?.message) {
      toast.error("Missing AI generated content.");
      return;
    }

    if (!facebookContent?.imageUrl) {
      toast.error("Missing AI generated image.");
      return;
    }

    // Combine date and time to ISO format
    try {
      const hashtags = facebookContent.message.match(/#[\w-]+/g) || [];

      const payload: FinalizeFacebookPostPayload = {
        status: modalMode === "schedule" ? "SCHEDULED" : "DRAFT",
        pageId: selectedPageId,
        postType: "SINGLE_IMAGE",
        content: {
          message: facebookContent.message,
          hashtags: hashtags,
        },
        platforms: ["facebook"],
        mediaUrls: [facebookContent.imageUrl],
      };

      if (modalMode === "schedule") {
        const selectedDateTime = new Date(`${scheduleDate}T${scheduleTime}:00`);

        // No manual timezone fix ❌
        const scheduledTimeIso = selectedDateTime.toISOString();

        payload.scheduledTime = scheduledTimeIso;
      }
      await handleFinalizePost(payload);

      toast.success(
        modalMode === "schedule"
          ? "Post successfully scheduled."
          : "Post saved as Draft successfully.",
      );
      setIsScheduleModalOpen(false);
    } catch (error) {
      console.error("Scheduling failed:", error);
      toast.error("Failed to schedule post. Please try again.");
    }
  };

  // ✅ Platform toggle logic (same as your earlier logic, multi-select)
  const togglePlatform = (name: Platform) => {
    setPlatforms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );
  };

  const baseCard =
    "rounded-2xl border border-[#DCE9C7] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.06)]";
  const subtleBg = "bg-[#F6FAF1]";

  const label = "text-sm font-semibold text-[#2E5A2E]";
  const inputBase =
    "w-full rounded-xl border border-[#DCE9C7] bg-[#F6FAF1] px-4 py-3 text-sm text-gray-700 outline-none " +
    "focus:border-[#7AAE2A] focus:ring-2 focus:ring-[#7AAE2A]/20";

  // ✅ Screenshot-like platform button styles
  const platformBtnBase =
    "flex items-center justify-center gap-2 rounded-xl border px-6 py-5 text-base font-semibold transition-all " +
    "focus:outline-none focus:ring-2 focus:ring-[#7AAE2A]/25";

  const platformActive = "border-[#65A30D] bg-[#F0F6E7] text-[#65A30D]";
  const platformInactive =
    "border-gray-300 bg-white text-gray-500 hover:border-gray-400";

  const primaryBtn =
    "w-full rounded-xl bg-[#76A91F] py-3.5 text-white font-bold shadow-[0_12px_22px_rgba(118,169,31,0.25)] " +
    "hover:bg-[#6A9A1B] active:scale-[0.99] transition focus:outline-none focus:ring-2 focus:ring-[#76A91F]/30 cursor-pointer";

  const ghostIconBtn =
    "inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 py-2 " +
    "text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7AAE2A]/25";

  const regenerateBtn =
    "inline-flex items-center gap-2 rounded-xl border border-[#DCE9C7] bg-[#F6FAF1] px-4 py-2.5 text-sm font-semibold " +
    "text-[#5A7E1F] hover:bg-[#EDF6E1] focus:outline-none focus:ring-2 focus:ring-[#7AAE2A]/25 cursor-pointer";

  const addToContentBtn =
    "inline-flex items-center gap-2 rounded-lg bg-[#76A91F] px-4 py-2.5 text-sm font-bold text-white " +
    "shadow-[0_10px_18px_rgba(118,169,31,0.22)] hover:bg-[#6A9A1B] active:scale-[0.99] transition " +
    "focus:outline-none focus:ring-2 focus:ring-[#76A91F]/30";

  const onGenerate = async () => {
    // if (!promptText.trim()) {
    //   toast.error("Please enter a prompt for generated content.");
    //   return;
    // }

    if (platforms.length === 0) {
      toast.error("Please select at least one platform.");
      return;
    }

    const payload: GenerateContentPayload = {
      tone,
      postType: `${postType}`, // Removed promptText reference since textarea is commented out
      platforms,
    };

    if (selectedListing) {
      payload.listingData = {
        yachtName: selectedListing.yachtName,
        price: selectedListing.Price,
        length: selectedListing.lengthOverall
          ? `${selectedListing.lengthOverall.value} ${selectedListing.lengthOverall.unit}`
          : undefined,
        builder: selectedListing.builder,
      };
    }

    if (includeContact && (contactPhone.trim() || contactEmail.trim())) {
      payload.contactInfo = {};
      if (contactPhone.trim()) payload.contactInfo.phone = contactPhone.trim();
      if (contactEmail.trim()) payload.contactInfo.email = contactEmail.trim();
    }

    try {
      const response = await handleGenerateContent(payload);

      // NOTE: Update for new object response
      if (response.success && response.data) {
        setContent(response.data.facebook?.message || "");
        setFacebookContent(response.data.facebook || null);
        toast.success(response.message || "Content generated successfully!");
      } else {
        toast.error(response.message || "Failed to generate content.");
      }
    } catch (error: unknown) {
      console.error("API Error:", error);
      let errorMessage = "Something went wrong while generating content.";

      if (error instanceof Error) {
        const axiosError = error as Error & {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || error.message;
      }

      toast.error(errorMessage);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || "");
      toast.success("Copied!");
    } catch {
      toast.error("Failed to copy!");
    }
  };

  const onAddContactToContent = () => {
    if (!includeContact) return;

    const lines: string[] = [];
    if (contactName.trim()) lines.push(`Name: ${contactName.trim()}`);
    if (contactPhone.trim()) lines.push(`Phone: ${contactPhone.trim()}`);
    if (contactEmail.trim()) lines.push(`Email: ${contactEmail.trim()}`);

    if (lines.length === 0) return;

    const block = `\n\nContact Information\n${lines.join("\n")}`;
    setContent((prev) => (prev ? prev + block : block.trimStart()));
  };

  return (
    <div className="w-full px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Configuration */}
          <div className={`${baseCard} p-6`}>
            <h2 className="text-xl font-bold text-[#65A30D] mb-5">
              Configuration
            </h2>

            {/* Prompt */}
            {/* <div className="mb-5">
              <div className={label}>Generated Content Prompt</div>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Enter prompt ..."
                className={`${inputBase} mt-2 min-h-[80px]`}
              />
            </div> */}

            {/* Listing */}
            <div className="mb-5">
              <div className={label}>Select Listing</div>
              <div className="relative mt-2">
                <select
                  value={selectedListingId}
                  onChange={(e) => setSelectedListingId(e.target.value)}
                  className={`${inputBase} appearance-none pr-10`}
                  disabled={isListingLoading || listings.length === 0}
                >
                  {isListingLoading ? (
                    <option value="">Loading listings...</option>
                  ) : listings.length === 0 ? (
                    <option value="">No listings available</option>
                  ) : (
                    <>
                      <option value="">Select a listing</option>
                      {listings.map((l) => (
                        <option
                          key={l._id}
                          value={l._id}
                          className="text-[#65A30D] cursor-pointer"
                        >
                          {l.yachtName}
                          {l.model ? ` — ${l.model}` : ""}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>

              {/* Selected Listing Preview */}
              {selectedListing && (
                <div className="mt-3 rounded-xl border border-[#DCE9C7] bg-[#F6FAF1] p-3 flex gap-3">
                  {selectedListing.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedListing.images[0]}
                      alt={selectedListing.yachtName}
                      className="h-16 w-20 rounded-md object-cover border border-[#DCE9C7] flex-shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-20 rounded-md bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 flex-shrink-0">
                      No Image
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-[#2E5A2E] truncate">
                      {selectedListing.yachtName}
                    </div>
                    <div className="text-[11px] text-gray-600 truncate">
                      {selectedListing.yachtType}
                      {selectedListing.model ? ` • ${selectedListing.model}` : ""}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">
                      {selectedListing.location}
                    </div>
                    <div className="text-xs font-semibold text-[#65A30D] mt-0.5">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                      }).format(selectedListing.Price)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Selection (optional) */}
            {/* 
            <div className="mb-5">
              <div className={label}>Select Campaign</div>
              <div className="relative mt-2">
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className={`${inputBase} appearance-none pr-10`}
                  disabled={isLoading}
                >
                  <option value="">
                    {isLoading ? "Loading campaigns..." : "Select a campaign"}
                  </option>
                  {campaigns.map((c: Campaign) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div> 
            */}

            {/* ✅ Platform (Screenshot style) */}
            <div className="mb-6">
              <div className={label}>Platform</div>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => togglePlatform("facebook")}
                  className={`${platformBtnBase} cursor-pointer ${platforms.includes("facebook")
                    ? platformActive
                    : platformInactive
                    }`}
                >
                  <div className="items-center gap-2">
                    <Facebook className="h-6 w-6 text-blue-500 ml-6 mb-2" />
                    Facebook
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => togglePlatform("instagram")}
                  className={`${platformBtnBase} cursor-pointer ${platforms.includes("instagram")
                    ? platformActive
                    : platformInactive
                    }`}
                >
                  <div className="items-center gap-2">
                    <Instagram className="h-6 w-6 text-red-400 ml-6 mb-2" />
                    Instagram
                  </div>
                </button>
              </div>
            </div>

            {/* Tone */}
            <div className="mb-6">
              <div className={label}>Tone</div>
              <div className="relative mt-2">
                <select
                  value={tone}
                  onChange={(e) =>
                    setTone(e.target.value as (typeof tones)[number])
                  }
                  className={`${inputBase} appearance-none pr-10`}
                >
                  {tones.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={onGenerate}
              className={primaryBtn}
              disabled={isPending}
            >
              <span className="inline-flex items-center justify-center gap-2 cursor-pointer">
                {isPending ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
                {isPending ? "Generating..." : "Generate Content"}
              </span>
            </button>
          </div>

          {/* Contact Information */}
          <div className={`${baseCard} p-6`}>
            <h2 className="text-xl font-extrabold text-[#65A30D]">
              Contact Information
            </h2>

            <label className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={includeContact}
                onChange={(e) => setIncludeContact(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-[#76A91F]"
              />
              Include contact information in posts
            </label>

            <div className="mt-4 space-y-4">
              <div>
                <div className="text-xs font-semibold text-gray-600">Name</div>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your name"
                  className={`${inputBase} mt-2 bg-white`}
                  disabled={!includeContact}
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-600">Phone</div>
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Phone number"
                  className={`${inputBase} mt-2 bg-white`}
                  disabled={!includeContact}
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-600">Email</div>
                <input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Email address"
                  className={`${inputBase} mt-2 bg-white`}
                  disabled={!includeContact}
                />
              </div>

              <button
                type="button"
                onClick={onAddContactToContent}
                className={addToContentBtn}
                disabled={!includeContact}
              >
                Add to Content
              </button>
            </div>
          </div>
        </div>

        {/* Right: Generated Content & Preview */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`${baseCard} p-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#65A30D]" />
                <h2 className="text-xl font-extrabold text-[#65A30D]">
                  Generated Content
                </h2>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <div className="relative">
                  <select
                    value={postType}
                    onChange={(e) =>
                      setPostType(e.target.value as (typeof postTypes)[number])
                    }
                    className="appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700
                             focus:outline-none focus:ring-2 focus:ring-[#7AAE2A]/25"
                  >
                    {postTypes.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>

                <button
                  type="button"
                  onClick={onCopy}
                  className={`${ghostIconBtn} cursor-pointer`}
                  title="Copy"
                >
                  <Copy className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={onGenerate}
                  className={regenerateBtn}
                  disabled={isPending}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
                  />
                  {isPending ? "Generating..." : "Regenerate"}
                </button>
              </div>
            </div>

            <div
              className={`${subtleBg} rounded-2xl border border-[#DCE9C7] p-4`}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write here..."
                className="min-h-[260px] w-full resize-none bg-transparent text-sm leading-6 text-gray-700 outline-none"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {charCount} characters
              </span>
              <span className="text-xs text-gray-400">
                Optimized for {platforms.join(", ") || "No platform selected"}
              </span>
            </div>

            <div className="mt-3 text-[11px] text-gray-500">
              <span className="font-semibold text-[#2E5A2E]">Selected:</span>{" "}
              {selectedListing?.yachtName ?? "No listing"} • {tone} • {postType}
            </div>
          </div>

          {/* Post Preview Section */}
          {(isPending || facebookContent) && (
            <div className={`${baseCard} p-6`}>
              <h2 className="text-xl font-bold text-[#65A30D] mb-5">
                Post Preview
              </h2>
              {isPending && (
                <div className="animate-pulse flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              )}

              {!isPending && facebookContent && (
                <div className="flex flex-col gap-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 shadow-sm">
                  {/* Account Info */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#1b2631] flex items-center justify-center overflow-hidden">
                      <img
                        src={userImage}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#65A30D]">
                        {userName}
                      </div>
                      <div className="text-xs text-gray-500">Just now</div>
                    </div>
                  </div>

                  {/* Image */}
                  {facebookContent.imageUrl && (
                    <div className="w-full overflow-hidden rounded-xl border border-gray-100">
                      <img
                        src={facebookContent.imageUrl}
                        alt="Generated Post Content"
                        className="w-full h-auto object-cover max-h-[500px]"
                      />
                    </div>
                  )}

                  {/* Message */}
                  <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed mt-1">
                    {content || facebookContent.message}
                  </div>

                  {/* Prompt */}
                  {facebookContent.imagePrompt && (
                    <div className="text-[11px] text-gray-400 italic mt-2 border-t border-gray-100 pt-3 flex flex-col gap-1">
                      <span className="font-semibold text-gray-500">
                        Image Description Generator Prompt:
                      </span>
                      {facebookContent.imagePrompt}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {facebookContent && (
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="flex-1 rounded-xl bg-[#76A91F] py-3.5 text-white font-bold shadow-[0_12px_22px_rgba(118,169,31,0.25)] hover:bg-[#6A9A1B] active:scale-[0.99] transition focus:outline-none focus:ring-2 focus:ring-[#76A91F]/30"
                onClick={() => onOpenScheduleModal("schedule")}
              >
                Schedule the day and time
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-[#76A91F] bg-[#F6FAF1] py-3.5 text-[#5A7E1F] font-bold hover:bg-[#EDF6E1] active:scale-[0.99] transition focus:outline-none focus:ring-2 focus:ring-[#7AAE2A]/25"
                onClick={() => onOpenScheduleModal("draft")}
              >
                Save as Draft
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#F9FAFB]">
              <h3 className="text-xl font-bold text-[#65A30D]">
                {modalMode === "schedule" ? "Schedule Post" : "Save Draft"}
              </h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6">
                <label className="text-sm font-semibold text-[#2E5A2E] mb-3 block">
                  Select Facebook Page
                </label>

                {isFetchingPages ? (
                  <div className="flex justify-center items-center py-8">
                    <RefreshCw className="w-6 h-6 text-[#65A30D] animate-spin" />
                  </div>
                ) : facebookPages.length > 0 ? (
                  <div className="space-y-3">
                    {facebookPages.map((page) => (
                      <label
                        key={page.pageId}
                        className={`
                          flex items-center p-4 border rounded-xl cursor-pointer transition-all
                          ${selectedPageId === page.pageId
                            ? "border-[#65A30D] bg-[#F0F6E7] ring-1 ring-[#65A30D]"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="fbPage"
                          value={page.pageId}
                          checked={selectedPageId === page.pageId}
                          onChange={(e) => setSelectedPageId(e.target.value)}
                          className="w-4 h-4 text-[#65A30D] border-gray-300 focus:ring-[#65A30D]"
                        />
                        <div className="ml-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Facebook className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {page.pageName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {page.pageId}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-500 text-sm">
                      No Facebook pages connected to this account.
                    </p>
                  </div>
                )}
              </div>

              {modalMode === "schedule" && (
                <div className="border-t border-gray-100 pt-6">
                  <label className="text-sm font-semibold text-[#2E5A2E] mb-3 block">
                    Schedule Time
                  </label>
                  <div className="grid grid-cols-2 gap-4">
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
                        />
                        <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={onSchedulePost}
                disabled={
                  !selectedPageId ||
                  (modalMode === "schedule" &&
                    (!scheduleDate || !scheduleTime)) ||
                  isScheduling
                }
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#76A91F] hover:bg-[#6A9A1B] shadow-[0_4px_10px_rgba(118,169,31,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#76A91F]/30 flex items-center gap-2"
              >
                {isScheduling && <RefreshCw className="w-4 h-4 animate-spin" />}
                {isScheduling
                  ? "Saving..."
                  : modalMode === "schedule"
                    ? "Schedule Post"
                    : "Save Draft"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
