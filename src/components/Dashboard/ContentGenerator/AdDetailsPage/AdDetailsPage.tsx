"use client";

import { useSearchParams } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  useCreateCampaign,
  useCreateAdSet,
  useGetAllCampaign,
} from "@/lib/hooks/useCampaign";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type Tab = "campaign" | "adSet" | "creative";

interface CampaignErrors {
  adAccountId?: string;
  pageId?: string;
  name?: string;
}

interface AdSetErrors {
  campaignId?: string;
  adSetName?: string;
  dailyBudget?: string;
  startDateTime?: string;
  locations?: string;
  ageMin?: string;
  ageMax?: string;
}

interface CreativeErrors {
  creativeName?: string;
  destinationUrl?: string;
}

export default function AdDetailsPage() {
  const searchParams = useSearchParams();
  const pageId = searchParams.get("pageId");
  const adAccountId = searchParams.get("adAccountId");
  const { mutateAsync: createCampaign } = useCreateCampaign();
  const { mutateAsync: createAdSet } = useCreateAdSet();

  // Get userId from session
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const { data: campaignData, isLoading: isCampaignsLoading } =
    useGetAllCampaign(userId, pageId || "");

  const [activeTab, setActiveTab] = useState<Tab>("campaign");

  // Campaign state
  const [name, setname] = useState("");
  const [objective, setObjective] = useState("OUTCOME_AWARENESS");
  const [campaignErrors, setCampaignErrors] = useState<CampaignErrors>({});

  // Ad Set state
  const [selectedCampaignId, setSelectedCampaignId] = useState(""); // Store campaign _id
  const [adSetName, setAdSetName] = useState("");
  const [dailyBudget, setDailyBudget] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [locations, setLocations] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [gender, setGender] = useState("All");
  const [adSetErrors, setAdSetErrors] = useState<AdSetErrors>({});

  // Creative state
  const [creativeName, setCreativeName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [adFormat, setAdFormat] = useState("");
  const [headline, setHeadline] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [creativeErrors, setCreativeErrors] = useState<CreativeErrors>({});

  const validateCampaign = (): boolean => {
    const errors: CampaignErrors = {};

    if (!adAccountId) {
      errors.adAccountId = "Ad Account ID is required";
    }

    if (!pageId) {
      errors.pageId = "Page ID is required";
    }

    if (!name.trim()) {
      errors.name = "Campaign Name is required";
    }

    setCampaignErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCampaign = async () => {
    if (!validateCampaign()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const campaignData = {
      adAccountId,
      pageId,
      name,
      objective,
    };

    try {
      const response = await createCampaign(campaignData);
      console.log("🚀 Campaign Data:", response);
      toast.success("Campaign created successfully!");
      // Navigate to Ad Set tab
      setActiveTab("adSet");
    } catch (error) {
      console.error("❌ Error creating Campaign:", error);
      toast.error("Failed to create campaign. Please try again.");
    }
  };

  const validateAdSet = (): boolean => {
    const errors: AdSetErrors = {};

    if (!selectedCampaignId) {
      errors.campaignId = "Please select a campaign";
    }

    if (!adSetName.trim()) {
      errors.adSetName = "Ad Set Name is required";
    }

    if (!dailyBudget || parseFloat(dailyBudget) <= 0) {
      errors.dailyBudget = "Daily Budget must be greater than 0";
    }

    if (!startDateTime) {
      errors.startDateTime = "Start Date & Time is required";
    }

    if (!locations.trim()) {
      errors.locations = "Locations is required";
    }

    if (!ageMin || parseInt(ageMin) < 13) {
      errors.ageMin = "Age Min must be at least 13";
    }

    if (!ageMax || parseInt(ageMax) > 65) {
      errors.ageMax = "Age Max must be 65 or less";
    }

    if (ageMin && ageMax && parseInt(ageMin) > parseInt(ageMax)) {
      errors.ageMax = "Age Max must be greater than Age Min";
    }

    setAdSetErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAdSet = async () => {
    if (!validateAdSet()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Map gender to numeric values: 1 = Male, 2 = Female, null = All
    const getGenderValue = (genderStr: string): number | null => {
      if (genderStr === "Male") return 1;
      if (genderStr === "Female") return 2;
      return null; // "All" or any other value
    };

    // Parse locations string into array (comma-separated)
    const locationsArray = locations
      .split(",")
      .map((loc) => loc.trim())
      .filter((loc) => loc.length > 0);

    const adSetData = {
      campaignId: selectedCampaignId,
      adAccountId: adAccountId,
      pageId: pageId,
      name: adSetName,
      dailyBudget: parseFloat(dailyBudget),
      startDate: startDateTime ? new Date(startDateTime).toISOString() : "",
      endDate: endDateTime ? new Date(endDateTime).toISOString() : null,
      targeting: {
        locations: locationsArray,
        ageMin: parseInt(ageMin),
        ageMax: parseInt(ageMax),
        gender: getGenderValue(gender),
      },
    };

    try {
      console.log("🚀 Submitting Ad Set Data:", adSetData);
      const response = await createAdSet(adSetData);
      console.log("✅ Ad Set Created Successfully:", response);
      toast.success("Ad Set created successfully!");
      // Navigate to Creative tab
      setActiveTab("creative");
    } catch (error) {
      console.error("❌ Error creating Ad Set:", error);
      toast.error("Failed to create Ad Set. Please try again.");
    }
  };

  const handleGenerateByAI = () => {
    if (!websiteUrl.trim()) {
      console.log("⚠️ Please enter a Website URL");
      return;
    }
    console.log("🤖 Generating content from URL:", websiteUrl);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      console.log("📷 Image uploaded:", file.name);
    }
  };

  const validateCreative = (): boolean => {
    const errors: CreativeErrors = {};

    if (!creativeName.trim()) {
      errors.creativeName = "Creative Name is required";
    }

    if (!destinationUrl.trim()) {
      errors.destinationUrl = "Destination URL is required";
    }

    setCreativeErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCreative = async () => {
    if (!validateCreative()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const creativeData = {
      creativeName,
      websiteUrl,
      uploadedImage: uploadedImage ? uploadedImage.name : null,
      adFormat,
      headline,
      primaryText,
      destinationUrl,
    };

    console.log("🎨 Add Creative Data:", creativeData);
    toast.success("Creative added successfully!");
  };

  const handlePublish = () => {
    if (!validateCreative()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const publishData = {
      creativeName,
      websiteUrl,
      uploadedImage: uploadedImage
        ? {
            name: uploadedImage.name,
            size: uploadedImage.size,
            type: uploadedImage.type,
          }
        : null,
      adFormat,
      headline,
      primaryText,
      destinationUrl,
    };
    console.log("🚀 Publish Data:", publishData);
    toast.success("Ad published successfully!");
    // Note: This is the final step, so no tab navigation needed
  };

  const tabs = [
    { id: "campaign" as Tab, label: "Campaign" },
    { id: "adSet" as Tab, label: "Ad Set" },
    { id: "creative" as Tab, label: "Creative" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/content-generator/create-ad"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#65A30D] transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Selection
        </Link>

        <header>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Ad <span className="text-[#65A30D]">Details</span>
          </h1>
          <p className="text-gray-500">
            Configure your campaign settings for the selected page and ad
            account.
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#65A30D] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "campaign" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Create Campaign
                </h2>

                {/* Ad Account ID - Read Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Account ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={adAccountId || ""}
                    readOnly
                    className={`w-full px-4 py-3 bg-gray-100 border rounded-lg text-gray-600 cursor-not-allowed ${
                      campaignErrors.adAccountId
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {campaignErrors.adAccountId && (
                    <p className="mt-1 text-sm text-red-500">
                      {campaignErrors.adAccountId}
                    </p>
                  )}
                </div>

                {/* Page ID - Read Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pageId || ""}
                    readOnly
                    className={`w-full px-4 py-3 bg-gray-100 border rounded-lg text-gray-600 cursor-not-allowed ${
                      campaignErrors.pageId
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {campaignErrors.pageId && (
                    <p className="mt-1 text-sm text-red-500">
                      {campaignErrors.pageId}
                    </p>
                  )}
                </div>

                {/* Campaign Name - User Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    placeholder="Enter campaign name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent ${
                      campaignErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {campaignErrors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {campaignErrors.name}
                    </p>
                  )}
                </div>

                {/* Objective - Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objective <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent cursor-pointer"
                  >
                    <option value="OUTCOME_AWARENESS">Awareness</option>
                    <option value="OUTCOME_LEADS">Leads</option>
                  </select>
                </div>

                {/* Create Campaign Button */}
                <div className="pt-4">
                  <button
                    onClick={handleCreateCampaign}
                    className="w-full bg-[#65A30D] hover:bg-[#4d7c0b] text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            )}

            {activeTab === "adSet" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Create Ad Set
                </h2>

                {/* Campaign - Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name <span className="text-red-500">*</span>
                  </label>
                  {isCampaignsLoading ? (
                    <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600">
                      Loading campaigns...
                    </div>
                  ) : (
                    <select
                      value={selectedCampaignId}
                      onChange={(e) => {
                        setSelectedCampaignId(e.target.value);
                        console.log("Selected Campaign ID:", e.target.value);
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent cursor-pointer ${
                        adSetErrors.campaignId
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a campaign</option>
                      {campaignData?.campaigns.map((campaign) => (
                        <option key={campaign._id} value={campaign._id}>
                          {campaign.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {adSetErrors.campaignId && (
                    <p className="mt-1 text-sm text-red-500">
                      {adSetErrors.campaignId}
                    </p>
                  )}
                </div>

                {/* Ad Set Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Set Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={adSetName}
                    onChange={(e) => setAdSetName(e.target.value)}
                    placeholder="Enter ad set name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent ${
                      adSetErrors.adSetName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {adSetErrors.adSetName && (
                    <p className="mt-1 text-sm text-red-500">
                      {adSetErrors.adSetName}
                    </p>
                  )}
                </div>

                {/* Daily Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Budget ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(e.target.value)}
                    placeholder="Enter daily budget"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent ${
                      adSetErrors.dailyBudget
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {adSetErrors.dailyBudget && (
                    <p className="mt-1 text-sm text-red-500">
                      {adSetErrors.dailyBudget}
                    </p>
                  )}
                </div>

                {/* Start Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent ${
                      adSetErrors.startDateTime
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {adSetErrors.startDateTime && (
                    <p className="mt-1 text-sm text-red-500">
                      {adSetErrors.startDateTime}
                    </p>
                  )}
                </div>

                {/* End Date & Time (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent"
                  />
                </div>

                {/* Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locations <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={locations}
                    onChange={(e) => setLocations(e.target.value)}
                    placeholder="e.g., United States, New York"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent ${
                      adSetErrors.locations
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {adSetErrors.locations && (
                    <p className="mt-1 text-sm text-red-500">
                      {adSetErrors.locations}
                    </p>
                  )}
                </div>

                {/* Age Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Min <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="13"
                      max="65"
                      value={ageMin}
                      onChange={(e) => setAgeMin(e.target.value)}
                      placeholder="13"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent ${
                        adSetErrors.ageMin
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {adSetErrors.ageMin && (
                      <p className="mt-1 text-sm text-red-500">
                        {adSetErrors.ageMin}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Max <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="13"
                      max="65"
                      value={ageMax}
                      onChange={(e) => setAgeMax(e.target.value)}
                      placeholder="65"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent ${
                        adSetErrors.ageMax
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {adSetErrors.ageMax && (
                      <p className="mt-1 text-sm text-red-500">
                        {adSetErrors.ageMax}
                      </p>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent cursor-pointer"
                  >
                    <option value="All">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Create Ad Set Button */}
                <div className="pt-4">
                  <button
                    onClick={handleCreateAdSet}
                    className="w-full bg-[#65A30D] hover:bg-[#4d7c0b] text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    Create Ad Set
                  </button>
                </div>
              </div>
            )}

            {activeTab === "creative" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Create Ad Creative
                </h2>

                {/* Creative Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creative Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={creativeName}
                    onChange={(e) => setCreativeName(e.target.value)}
                    placeholder="Enter creative name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent ${
                      creativeErrors.creativeName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {creativeErrors.creativeName && (
                    <p className="mt-1 text-sm text-red-500">
                      {creativeErrors.creativeName}
                    </p>
                  )}
                </div>

                {/* Website URL with AI Generation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generate by AI (for AI generation)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent"
                    />
                    <button
                      onClick={handleGenerateByAI}
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                      <Sparkles size={18} />
                      Generate by AI
                    </button>
                  </div>
                </div>

                {/* Upload Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#65A30D] file:text-white hover:file:bg-[#4d7c0b] file:cursor-pointer"
                  />
                  {uploadedImage && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {uploadedImage.name}
                    </p>
                  )}
                </div>

                {/* Ad Content Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Ad Content
                  </h3>

                  {/* Ad Format */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Format
                    </label>
                    <input
                      type="text"
                      value={adFormat}
                      onChange={(e) => setAdFormat(e.target.value)}
                      placeholder="e.g., Single Image, Carousel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent"
                    />
                  </div>

                  {/* Headline */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Enter headline"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent"
                    />
                  </div>

                  {/* Primary Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Text
                    </label>
                    <textarea
                      value={primaryText}
                      onChange={(e) => setPrimaryText(e.target.value)}
                      placeholder="Enter primary text"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Destination URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    placeholder="https://example.com/landing-page"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:border-transparent ${
                      creativeErrors.destinationUrl
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {creativeErrors.destinationUrl && (
                    <p className="mt-1 text-sm text-red-500">
                      {creativeErrors.destinationUrl}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex gap-4">
                  <button
                    onClick={handleAddCreative}
                    className="flex-1 bg-[#65A30D] hover:bg-[#4d7c0b] text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                  >
                    Add Creative
                  </button>
                  <button
                    onClick={handlePublish}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                  >
                    Publish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
