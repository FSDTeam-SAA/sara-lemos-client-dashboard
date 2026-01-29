"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Copy,
  Facebook,
  Instagram,
  Sparkles,
  RefreshCw,
} from "lucide-react";

type Platform = "facebook" | "instagram";

const listings = [
  "Azimut Grande 35 Metri",
  "Sunseeker 90 Ocean",
  "Benetti Oasis 40M",
];
const tones = ["Professional", "Friendly", "Luxury", "Playful"] as const;
const postTypes = ["Caption", "Headline", "Primary Text", "Hashtags"] as const;

export default function PostGenerator() {
  const [listing, setListing] = useState(listings[0]);
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [tone, setTone] = useState<(typeof tones)[number]>("Professional");
  const [postType, setPostType] =
    useState<(typeof postTypes)[number]>("Caption");
  const [content, setContent] = useState("");

  const charCount = useMemo(() => content.length, [content]);

  const baseCard =
    "rounded-2xl border border-[#DCE9C7] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.06)]";

  const subtleBg = "bg-[#F6FAF1]";

  const label = "text-sm font-semibold text-[#2E5A2E]";
  const helper = "text-xs text-gray-500";

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
    "hover:bg-[#6A9A1B] active:scale-[0.99] transition focus:outline-none focus:ring-2 focus:ring-[#76A91F]/30";

  const ghostIconBtn =
    "inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 py-2 " +
    "text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7AAE2A]/25";

  const outlineBtn =
    "inline-flex items-center gap-2 rounded-xl border border-[#DCE9C7] bg-white px-4 py-2.5 text-sm font-semibold " +
    "text-[#2E5A2E] hover:bg-[#F6FAF1] focus:outline-none focus:ring-2 focus:ring-[#7AAE2A]/25";

  const regenerateBtn =
    "inline-flex items-center gap-2 rounded-xl border border-[#DCE9C7] bg-[#F6FAF1] px-4 py-2.5 text-sm font-semibold " +
    "text-[#5A7E1F] hover:bg-[#EDF6E1] focus:outline-none focus:ring-2 focus:ring-[#7AAE2A]/25";

  const onGenerate = () => {
    // demo content (তুমি চাইলে API call বসাবে)
    const demo =
      platform === "facebook"
        ? `Unveil Your Mediterranean Escape 🌊\n\nExperience the epitome of luxury with our exclusive yacht charters. Sail through stunning coastlines where every moment is crafted for elegance.\n\nBook Now!`
        : `🌊✨ Set sail into luxury!\nExplore the Mediterranean with premium yacht charters.\nBook your escape today! 🛥️🌅\n\n#LuxuryYacht #YachtCharter #Mediterranean`;

    setContent(demo);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || "");
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration */}
        <div className={`lg:col-span-4 ${baseCard} p-6`}>
          <h2 className="text-xl font-extrabold text-[#2E5A2E] mb-5">
            Configuration
          </h2>

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
                onClick={() => setPlatform("facebook")}
                className={`${pillBtn} ${
                  platform === "facebook" ? activePill : idlePill
                }`}
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </button>

              <button
                type="button"
                onClick={() => setPlatform("instagram")}
                className={`${pillBtn} ${
                  platform === "instagram" ? activePill : idlePill
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
          <button type="button" onClick={onGenerate} className={primaryBtn}>
            <span className="inline-flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate Content
            </span>
          </button>
        </div>

        {/* Right: Generated Content */}
        <div className={`lg:col-span-8 ${baseCard} p-6`}>
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#76A91F]" />
              <h2 className="text-xl font-extrabold text-[#2E5A2E]">
                Generated Content
              </h2>
            </div>

            <div className="flex items-center gap-2 justify-end">
              {/* Select post type */}
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

              {/* Copy */}
              <button
                type="button"
                onClick={onCopy}
                className={ghostIconBtn}
                title="Copy"
              >
                <Copy className="h-4 w-4" />
              </button>

              {/* Regenerate */}
              <button
                type="button"
                onClick={onGenerate}
                className={regenerateBtn}
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </button>
            </div>
          </div>

          {/* Textarea */}
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

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {charCount} characters
            </span>
            <span className="text-xs text-gray-400">
              Optimized for {platform === "facebook" ? "Facebook" : "Instagram"}
            </span>
          </div>

          {/* Small helper (optional) */}
          <div className="mt-3 text-[11px] text-gray-500">
            <span className="font-semibold text-[#2E5A2E]">Selected:</span>{" "}
            {listing} • {tone} • {postType}
          </div>
        </div>
      </div>
    </div>
  );
}
