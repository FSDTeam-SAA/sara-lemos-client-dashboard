"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, X as XIcon } from "lucide-react";
import { useGenerateAd } from "@/lib/hooks/useCampaign";
import { GenerateAdResponse } from "@/lib/services/campaignService";

interface GenerateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: GenerateAdResponse) => void;
}

interface ContentFormData {
  listing: string;
  platforms: string[];
  tone: string;
  postType: string;
  email: string;
  phone: string;
  keywords: string[];
  cta: string;
}

const LISTINGS = [
  "Azimut Grande 35 Metri",
  "Sunseeker 88 Yacht",
  "Princess 30M",
];

const PLATFORMS = ["Facebook", "Instagram"];

const TONES = [
  "Professional",
  "Luxury & Exclusive",
  "Casual & Friendly",
  "Exciting & Energetic",
];

const POST_TYPES = [
  "Teaser",
  "Launch",
  "Explore",
  "Lifestyle",
  "Market",
  "Sold",
];

export function GenerateContentModal({
  isOpen,
  onClose,
  onGenerate,
}: GenerateContentModalProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    listing: LISTINGS[0],
    platforms: [],
    tone: TONES[0],
    postType: POST_TYPES[0],
    email: "",
    phone: "",
    keywords: [],
    cta: "",
  });

  const [keywordInput, setKeywordInput] = useState("");

  const { mutateAsync: generateAd } = useGenerateAd();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePlatform = (platform: string) => {
    setFormData((prev) => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms };
    });
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!formData.keywords.includes(keywordInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          keywords: [...prev.keywords, keywordInput.trim()],
        }));
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const outputData = {
      tone: formData.tone.toLowerCase().includes("luxury")
        ? "luxury"
        : formData.tone.toLowerCase(), // Mapping logic or just raw string
      postType: formData.postType, // Using selected value
      platforms: formData.platforms.map((p) => p.toLowerCase()),
      contactInfo: `Email: ${formData.email} | Phone: ${formData.phone}`,
      keywords: formData.keywords,
      cta: formData.cta,
    };

    try {
      const response = await generateAd(outputData);

      if (response?.data) {
        const { facebook, instagram, meta } = response.data;

        // Structured Debug Snapshot
        console.log("✅ Ad Copy Snapshot", {
          facebook: {
            imagePrompt: facebook?.imagePrompt,
            imageUrl: facebook?.imageUrl,
          },
          instagram: {
            caption: instagram?.caption,
            imagePrompt: instagram?.imagePrompt,
            imageUrl: instagram?.imageUrl,
          },
          meta: {
            tone: meta?.tone,
            postType: meta?.postType,
            cta: meta?.cta,
          },
        });

        // Warnings for missing critical fields
        if (!facebook?.headline) console.warn("⚠️ Missing Facebook Headline");
        if (!facebook?.primaryText)
          console.warn("⚠️ Missing Facebook Primary Text");

        // Pass data back to parent
        onGenerate(response.data);
      }

      onClose();
    } catch (error) {
      console.error("Failed to generate ad:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none bg-transparent shadow-2xl">
        <div className="bg-white rounded-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-linear-to-r from-[#65A30D] to-[#4d7c0f] p-6 sticky top-0 z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Generated Content
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Configure your AI content generation settings
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* 1. Select Listing */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                1. Select Listing
              </label>
              <select
                name="listing"
                value={formData.listing}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#65A30D] focus:ring-2 focus:ring-[#65A30D]/20 outline-none transition-all cursor-pointer"
              >
                {LISTINGS.map((listing) => (
                  <option key={listing} value={listing}>
                    {listing}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Platform */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                2. Platform
              </label>
              <div className="flex gap-4">
                {PLATFORMS.map((platform) => (
                  <button
                    type="button"
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-all ${
                      formData.platforms.includes(platform)
                        ? "border-[#65A30D] bg-[#F0F6E7] text-[#65A30D]"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    } cursor-pointer`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Tone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                3. Tone
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {TONES.map((tone) => (
                  <label
                    key={tone}
                    className={`flex items-center justify-center py-3 px-2 rounded-lg border cursor-pointer transition-all text-sm font-medium ${
                      formData.tone === tone
                        ? "border-[#65A30D] bg-[#F0F6E7] text-[#65A30D]"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={tone}
                      checked={formData.tone === tone}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    {tone}
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Select Post Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                4. Select Post Type
              </label>
              <select
                name="postType"
                value={formData.postType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#65A30D] focus:ring-2 focus:ring-[#65A30D]/20 outline-none transition-all cursor-pointer"
              >
                {POST_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Contact Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                5. Contact Information
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#65A30D] focus:ring-2 focus:ring-[#65A30D]/20 outline-none transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#65A30D] focus:ring-2 focus:ring-[#65A30D]/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Keywords{" "}
                <span className="text-gray-400 font-normal ml-1">
                  (Press Enter to add)
                </span>
              </label>
              <div className="border border-gray-200 rounded-lg p-2 focus-within:border-[#65A30D] focus-within:ring-2 focus-within:ring-[#65A30D]/20 transition-all flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-[#F0F6E7] text-[#65A30D] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="hover:bg-[#65A30D]/10 rounded-full p-0.5 transition-colors cursor-pointer"
                    >
                      <XIcon size={14} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  placeholder={
                    formData.keywords.length === 0 ? "Add keywords..." : ""
                  }
                  className="flex-1 outline-none min-w-[120px] px-2 py-1"
                />
              </div>
            </div>

            {/* Call to Action */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Call to Action (CTA)
              </label>
              <input
                type="text"
                name="cta"
                placeholder="e.g., Book Your Dream Yacht Today"
                value={formData.cta}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#65A30D] focus:ring-2 focus:ring-[#65A30D]/20 outline-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-[#65A30D] text-white font-semibold hover:bg-[#54870b] shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer"
              >
                Generate Content
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
