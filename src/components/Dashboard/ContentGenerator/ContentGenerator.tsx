"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Copy,
  Facebook,
  Instagram,
  Sparkles,
  RefreshCw,
  Plus,
} from "lucide-react";
import { useGenerateContent } from "@/lib/hooks/useContentGenerator";
import { GenerateContentPayload } from "@/lib/services/contentGeneratorService";
import { toast } from "sonner";

type Platform = "facebook" | "instagram";

const listings = [
  "Azimut Grande 35 Metri",
  "Sunseeker 90 Ocean",
  "Benetti Oasis 40M",
];
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
  const [listing, setListing] = useState(listings[0]);
  const [platforms, setPlatforms] = useState<Platform[]>(["facebook"]);
  const [tone, setTone] = useState<(typeof tones)[number]>("Professional");
  const [postType, setPostType] =
    useState<(typeof postTypes)[number]>("Teaser");
  const [promptText, setPromptText] = useState("");
  const [content, setContent] = useState("");

  const { mutateAsync: handleGenerateContent, isPending } =
    useGenerateContent();

  // ✅ Contact states
  const [includeContact, setIncludeContact] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const charCount = useMemo(() => content.length, [content]);

  const baseCard =
    "rounded-2xl border border-[#DCE9C7] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.06)]";

  const subtleBg = "bg-[#F6FAF1]";

  const label = "text-sm font-semibold text-[#2E5A2E]";
  const inputBase =
    "w-full rounded-xl border border-[#DCE9C7] bg-[#F6FAF1] px-4 py-3 text-sm text-gray-700 outline-none " +
    "focus:border-[#7AAE2A] focus:ring-2 focus:ring-[#7AAE2A]/20";

  const pillBtn =
    "flex items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-semibold transition " +
    "focus:outline-none focus:ring-2 focus:ring-[#7AAE2A]/25";

  const activePill =
    "border-[#7AAE2A] bg-[#F6FAF1] text-[#2E5A2E] shadow-[inset_0_0_0_1px_rgba(122,174,42,0.25)]";
  const idlePill = "border-gray-200 bg-white text-gray-500 hover:bg-gray-50";

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
    // Validation
    if (!promptText.trim()) {
      toast.error("Please enter a prompt for generated content.");
      return;
    }

    if (platforms.length === 0) {
      toast.error("Please select at least one platform.");
      return;
    }

    // Construct dynamic payload
    const payload: GenerateContentPayload = {
      tone,
      postType: `${postType}: ${promptText}`,
      platforms,
    };

    if (includeContact && (contactPhone.trim() || contactEmail.trim())) {
      payload.contactInfo = {};
      if (contactPhone.trim()) payload.contactInfo.phone = contactPhone.trim();
      if (contactEmail.trim()) payload.contactInfo.email = contactEmail.trim();
    }

    try {
      const response = await handleGenerateContent(payload);
      if (response.success && response.data) {
        setContent(response.data);
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
    } catch {
      // ignore
    }
  };

  // ✅ Contact -> content এ append (স্ক্রিনশটের Add to Content এর মতো)
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
        {/* ✅ Left Sidebar (Configuration + Contact) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Configuration */}
          <div className={`${baseCard} p-6`}>
            <h2 className="text-xl font-extrabold text-[#65A30D] mb-5">
              Configuration
            </h2>

            {/* Generated Content Prompt */}
            <div className="mb-5">
              <div className={label}>Generated Content Prompt</div>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Enter prompt ..."
                className={`${inputBase} mt-2 min-h-[80px]`}
              />
            </div>

            {/* Listing */}
            <div className="mb-5">
              <div className={label}>Select Listing</div>
              <div className="relative mt-2">
                <select
                  value={listing}
                  onChange={(e) => setListing(e.target.value)}
                  className={`${inputBase} appearance-none pr-10`}
                >
                  {listings.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            {/* Platform */}
            <div className="mb-5">
              <div className={label}>Platform</div>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setPlatforms((prev) =>
                      prev.includes("facebook")
                        ? prev.filter((p) => p !== "facebook")
                        : [...prev, "facebook"],
                    )
                  }
                  className={`${pillBtn} ${
                    platforms.includes("facebook") ? activePill : idlePill
                  }`}
                >
                  <Facebook className="h-5 w-5" />
                  Facebook
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPlatforms((prev) =>
                      prev.includes("instagram")
                        ? prev.filter((p) => p !== "instagram")
                        : [...prev, "instagram"],
                    )
                  }
                  className={`${pillBtn} ${
                    platforms.includes("instagram") ? activePill : idlePill
                  }`}
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
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

          {/* ✅ Contact Information (Sidebar card) */}
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
                <Plus className="h-4 w-4 cursor-pointer" />
                Add to Content
              </button>
            </div>
          </div>
        </div>

        {/* Right: Generated Content */}
        <div className={`lg:col-span-8 ${baseCard} p-6`}>
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
            {listing} • {tone} • {postType}
          </div>
        </div>
      </div>
    </div>
  );
}
