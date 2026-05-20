"use client";

import { ArrowLeft, FileText, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useUpdateListing } from "@/lib/hooks/useListing";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { ExtractedYachtData } from "@/lib/types/listing";
import axios from "axios";

const constructionOptions = ["GRP", "Steel", "Aluminum", "Wood", "Composite"] as const;
const statusOptions = ["For Sale", "For Charter", "Sold", "Sale Pending"] as const;
const yachtTypeOptions = [
  "Motor Yacht",
  "Sailing Yacht",
  "Catamaran",
  "Sport Yacht",
  "Superyacht",
  "Other",
] as const;

type Errors = Partial<Record<string, string>>;

const inputBase =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#65A30D]/60 focus:ring-2 focus:ring-[#65A30D]/15";

const labelBase = "text-[11px] font-medium text-gray-600 block mb-1";

function isPositiveNumber(v: string) {
  if (v.trim() === "") return false;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0;
}

const parsePrice = (priceStr: string) => {
  if (!priceStr) return { currency: "$", value: "" };
  
  let currency: "$" | "€" = "$";
  if (priceStr.includes("€") || priceStr.toLowerCase().includes("eur")) {
    currency = "€";
  } else if (priceStr.includes("$") || priceStr.toLowerCase().includes("usd")) {
    currency = "$";
  }

  // Remove currency symbols, commas, and spaces
  const cleanNumStr = priceStr.replace(/[^\d.]/g, "");
  
  return { currency, value: cleanNumStr };
};

export default function UploadListingDocument() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [partialData, setPartialData] = useState<Partial<ExtractedYachtData> | null>(null);
  const partialDataRef = useRef<any>({});

  // Form states for pre-populated data
  const [extractedListing, setExtractedListing] = useState<any | null>(null);
  const [formState, setFormState] = useState<any | null>(null);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateListingMutation = useUpdateListing();

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (formState && formState.newImagePreviews) {
        formState.newImagePreviews.forEach((p: any) => URL.revokeObjectURL(p.url));
      }
    };
  }, [formState]);

  const initFormState = (listing: any) => {
    const pData = partialDataRef.current || {};

    const getVal = (field: string, subField?: string) => {
      if (subField) {
        return listing[field]?.[subField] ?? pData[field]?.[subField] ?? "";
      }
      return listing[field] ?? pData[field] ?? "";
    };

    // Determine construction
    let construction: "" | "GRP" | "Steel" | "Aluminum" | "Wood" | "Composite" = "";
    const constructions = listing.constructions || pData.constructions;
    if (constructions) {
      if (constructions.GRP === true || constructions.GRP === "true") construction = "GRP";
      else if (constructions.Steel === true || constructions.Steel === "true" || constructions.STEEL === true || constructions.STEEL === "true") construction = "Steel";
      else if (constructions.Aluminum === true || constructions.Aluminum === "true") construction = "Aluminum";
      else if (constructions.Wood === true || constructions.Wood === "true") construction = "Wood";
      else if (constructions.Composite === true || constructions.Composite === "true") construction = "Composite";
    }

    const priceRaw = listing.Price || listing.price || pData.Price || pData.price || "";
    const parsedPrice = parsePrice(String(priceRaw));

    const lenVal = getVal("lengthOverall", "value");
    const lenUnit = getVal("lengthOverall", "unit");
    const beamVal = getVal("beam", "value");
    const beamUnit = getVal("beam", "unit");
    const draftVal = getVal("draft", "value");
    const draftUnit = getVal("draft", "unit");

    const guestCap = getVal("guestCapacity");
    const bathRooms = listing.bathRooms ?? listing.bathrooms ?? pData.bathRooms ?? pData.bathrooms ?? "";
    const cabinsVal = getVal("cabins");

    return {
      yachtName: getVal("yachtName"),
      yachtType: getVal("yachtType"),
      builder: getVal("builder"),
      model: getVal("model"),
      yearBuilt: getVal("yearBuilt") ? String(getVal("yearBuilt")) : "",
      lengthOverall: lenVal ? String(lenVal) : "",
      lengthUnit: (String(lenUnit).toLowerCase() === "m" ? "m" : "ft") as "ft" | "m",
      beam: beamVal ? String(beamVal) : "",
      beamUnit: (String(beamUnit).toLowerCase() === "m" ? "m" : "ft") as "ft" | "m",
      draft: draftVal ? String(draftVal) : "",
      draftUnit: (String(draftUnit).toLowerCase() === "m" ? "m" : "ft") as "ft" | "m",
      location: getVal("location"),
      priceCurrency: parsedPrice.currency,
      price: parsedPrice.value,
      guestCapacity: guestCap ? String(guestCap) : "",
      bathrooms: bathRooms ? String(bathRooms) : "",
      cabins: cabinsVal ? String(cabinsVal) : "",
      guests: getVal("guests") ? String(getVal("guests")) : "",
      crew: getVal("crew") ? String(getVal("crew")) : "",
      construction: construction,
      status: (getVal("status") || "For Sale") as any,
      grossTons: getVal("grossTons") ? String(getVal("grossTons")) : "",
      vatPaid: !!getVal("vatPaid"),
      description: getVal("description"),
      engineMake: getVal("engineMake"),
      engineModel: getVal("engineModel"),
      existingImages: listing.images || [],
      newImages: [] as File[],
      newImagePreviews: [] as { file: File; url: string }[],
    };
  };

  const setField = (key: string, value: any) => {
    setFormState((prev: any) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleDeleteExistingImage = (urlToRemove: string) => {
    setFormState((prev: any) => {
      if (!prev) return prev;
      const updatedImages = prev.existingImages.filter((url: string) => url !== urlToRemove);
      
      // Update active preview URL if needed
      let nextActiveUrl = activePreviewUrl;
      if (activePreviewUrl === urlToRemove) {
        if (updatedImages.length > 0) {
          nextActiveUrl = updatedImages[0];
        } else if (prev.newImagePreviews.length > 0) {
          nextActiveUrl = prev.newImagePreviews[0].url;
        } else {
          nextActiveUrl = "";
        }
      }
      setActivePreviewUrl(nextActiveUrl);

      return {
        ...prev,
        existingImages: updatedImages
      };
    });
  };

  const handleDeleteNewImage = (idxToRemove: number) => {
    setFormState((prev: any) => {
      if (!prev) return prev;
      const previewToRemove = prev.newImagePreviews[idxToRemove];
      URL.revokeObjectURL(previewToRemove.url);

      const updatedFiles = prev.newImages.filter((_: any, idx: number) => idx !== idxToRemove);
      const updatedPreviews = prev.newImagePreviews.filter((_: any, idx: number) => idx !== idxToRemove);

      let nextActiveUrl = activePreviewUrl;
      if (activePreviewUrl === previewToRemove.url) {
        if (prev.existingImages.length > 0) {
          nextActiveUrl = prev.existingImages[0];
        } else if (updatedPreviews.length > 0) {
          nextActiveUrl = updatedPreviews[0].url;
        } else {
          nextActiveUrl = "";
        }
      }
      setActivePreviewUrl(nextActiveUrl);

      return {
        ...prev,
        newImages: updatedFiles,
        newImagePreviews: updatedPreviews
      };
    });
  };

  const handleAddNewImages = (files: File[]) => {
    const validFiles: File[] = [];
    const newPreviews: { file: File; url: string }[] = [];

    files.forEach((file) => {
      if (file.size <= 5 * 1024 * 1024) {
        validFiles.push(file);
        newPreviews.push({
          file,
          url: URL.createObjectURL(file),
        });
      }
    });

    setFormState((prev: any) => {
      if (!prev) return prev;
      const updatedFiles = [...prev.newImages, ...validFiles];
      const updatedPreviews = [...prev.newImagePreviews, ...newPreviews];
      
      let nextActiveUrl = activePreviewUrl;
      if (!nextActiveUrl) {
        if (prev.existingImages.length > 0) {
          nextActiveUrl = prev.existingImages[0];
        } else if (updatedPreviews.length > 0) {
          nextActiveUrl = updatedPreviews[0].url;
        }
      }
      setActivePreviewUrl(nextActiveUrl);

      return {
        ...prev,
        newImages: updatedFiles,
        newImagePreviews: updatedPreviews
      };
    });
  };

  const validate = (): Errors => {
    const e: Errors = {};
    const f = formState;
    if (!f) return e;

    if (!f.yachtName.trim()) e.yachtName = "Yacht name is required";
    if (!f.yachtType.trim()) e.yachtType = "Yacht type is required";
    if (!f.builder.trim()) e.builder = "Builder is required";
    if (!f.model.trim()) e.model = "Model is required";
    if (!f.location.trim()) e.location = "Location is required";
    if (!f.construction) e.construction = "Construction is required";
    if (!f.description.trim()) e.description = "Description is required";
    if (!f.engineMake.trim()) e.engineMake = "Engine make is required";
    if (!f.engineModel.trim()) e.engineModel = "Engine model is required";

    if (f.existingImages.length === 0 && f.newImages.length === 0) {
      e.newImages = "At least one image is required";
    }

    if (!f.yearBuilt.trim()) {
      e.yearBuilt = "Year built is required";
    } else {
      const y = Number(f.yearBuilt);
      const now = new Date().getFullYear();
      if (!Number.isInteger(y) || y < 1900 || y > now + 1) {
        e.yearBuilt = `Enter a valid year (1900 - ${now + 1})`;
      }
    }

    const numericFields: Array<{ key: string; label: string }> = [
      { key: "lengthOverall", label: "Length overall" },
      { key: "beam", label: "Beam" },
      { key: "draft", label: "Draft" },
      { key: "price", label: "Price" },
      { key: "guestCapacity", label: "Guest capacity" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "cabins", label: "Cabins" },
      { key: "guests", label: "Guests" },
      { key: "crew", label: "Crew" },
      { key: "grossTons", label: "Gross tons" },
    ];

    for (const nf of numericFields) {
      const v = String(f[nf.key] ?? "");
      if (!v.trim()) e[nf.key] = `${nf.label} is required`;
      else if (!isPositiveNumber(v)) e[nf.key] = `${nf.label} must be a number`;
    }

    return e;
  };

  const handleSave = async () => {
    if (!formState || !extractedListing) return;

    const e = validate();
    setErrors(e);
    if (Object.values(e).some(Boolean)) {
      toast.error("Please check all required fields");
      return;
    }

    const fd = new FormData();
    fd.append("yachtName", formState.yachtName);
    fd.append("builder", formState.builder);
    fd.append("yachtType", formState.yachtType);
    fd.append("model", formState.model);
    fd.append("location", formState.location);
    fd.append("guestCapacity", String(Number(formState.guestCapacity)));
    fd.append("Price", String(Number(formState.price)));
    fd.append("bathRooms", String(Number(formState.bathrooms)));
    fd.append("cabins", String(Number(formState.cabins)));
    fd.append("crew", String(Number(formState.crew)));
    fd.append("guests", String(Number(formState.guests)));

    fd.append(
      "constructions",
      JSON.stringify({
        GRP: formState.construction === "GRP",
        Steel: formState.construction === "Steel",
        Aluminum: formState.construction === "Aluminum",
        Wood: formState.construction === "Wood",
        Composite: formState.construction === "Composite",
      }),
    );

    fd.append("yearBuilt", String(Number(formState.yearBuilt)));

    fd.append(
      "lengthOverall",
      JSON.stringify({
        value: Number(formState.lengthOverall),
        unit: formState.lengthUnit,
      }),
    );
    fd.append(
      "beam",
      JSON.stringify({ value: Number(formState.beam), unit: formState.beamUnit }),
    );
    fd.append(
      "draft",
      JSON.stringify({ value: Number(formState.draft), unit: formState.draftUnit }),
    );

    fd.append("grossTons", String(Number(formState.grossTons)));
    fd.append("engineMake", formState.engineMake);
    fd.append("engineModel", formState.engineModel);
    fd.append("description", formState.description);
    fd.append("isActive", "true");

    fd.append("images", JSON.stringify(formState.existingImages));
    formState.newImages.forEach((file: File) => fd.append("images", file));

    setIsSubmitting(true);
    try {
      await updateListingMutation.mutateAsync({
        listingId: extractedListing._id,
        data: fd,
      });
      toast.success("Listing saved and updated successfully ✅");
      router.push("/listings");
    } catch (err) {
      console.error("❌ SUBMISSION FAILED:", err);
      let msg = "Request failed";
      if (axios.isAxiosError(err)) {
        msg = err?.response?.data?.message ?? err?.message ?? msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(`Submission Failed: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    setIsExtracting(true);
    setProgressMessage("Starting extraction...");
    setPartialData(null);
    setExtractedListing(null);
    setFormState(null);
    partialDataRef.current = {};

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const session = await getSession();
      const token = (session as { accessToken?: string })?.accessToken;

      if (!token) {
        toast.error("You must be logged in to perform this action.");
        setIsExtracting(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listing/extract-pdf`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get reader from response body");
      }

      let buffer = "";

      const processMessageBlock = (block: string) => {
        const lines = block.split("\n");
        let event = "";
        let dataStr = "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("event:")) {
            event = trimmed.substring(6).trim();
          } else if (trimmed.startsWith("data:")) {
            dataStr = trimmed.substring(5).trim();
          }
        }

        if (!dataStr) return;

        try {
          const data = JSON.parse(dataStr);
          console.log("Parsed SSE Event:", event, data);

          if (event === "status") {
            setProgressMessage(data.message || "Processing...");
          } else if (event === "chunk") {
            if (data.partialData) {
              setPartialData(data.partialData);
              partialDataRef.current = { ...partialDataRef.current, ...data.partialData };
              // Live update formState in real-time
              setFormState((prev: any) => {
                const initial = initFormState(data.partialData);
                if (!prev) return initial;
                const updated = { ...prev };
                Object.keys(initial).forEach((key) => {
                  const k = key as keyof typeof initial;
                  if (initial[k] !== "" && initial[k] !== undefined && k !== "existingImages" && k !== "newImages" && k !== "newImagePreviews") {
                    updated[k] = initial[k] as any;
                  }
                });
                return updated;
              });
            }
          } else if (event === "final") {
            toast.success("Extraction complete!");
            setIsExtracting(false);
            if (data.listing) {
              setExtractedListing(data.listing);
              const initial = initFormState(data.listing);
              setFormState(initial);
              if (data.listing.images && data.listing.images.length > 0) {
                setActivePreviewUrl(data.listing.images[0]);
              } else {
                setActivePreviewUrl("");
              }
            }
          } else if (event === "error") {
            toast.error(data.message || "An error occurred during extraction");
            setIsExtracting(false);
          }
        } catch (e) {
          console.error("Failed to parse SSE data string:", dataStr, e);
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          if (buffer.trim()) {
            processMessageBlock(buffer);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const normalized = buffer.replace(/\r\n/g, "\n");
        const parts = normalized.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (part.trim()) {
            processMessageBlock(part);
          }
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to extract PDF. Please try again.");
      setIsExtracting(false);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen px-6 py-6">
      {/* ===== Header ===== */}
      <div className="flex items-start gap-3 mb-6">
        <button
          onClick={() => {
            if (extractedListing) {
              setExtractedListing(null);
              setFormState(null);
              setFile(null);
            } else {
              router.push("/upload-listing");
            }
          }}
          className="mt-1 text-gray-500 hover:text-gray-700 transition cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#65A30D]">
            {extractedListing ? "Review Extracted Yacht" : "Upload Listing Document"}
          </h1>
          <p className="text-xs text-[#6C757D] mt-0.5">
            {extractedListing
              ? "Verify the extracted details, fill in missing information, and edit images"
              : "Upload a PDF or Word document containing yacht specifications"}
          </p>
        </div>
      </div>

      {extractedListing && formState ? (
        /* Render Populated Form */
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto container rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="p-6 space-y-6">
            
            {/* Top Section / Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelBase}>Yacht Name</label>
                <input
                  className={inputBase + (errors.yachtName ? " border-red-300" : "")}
                  placeholder="Azimut Grande 35 Metri"
                  value={formState.yachtName}
                  onChange={(e) => setField("yachtName", e.target.value)}
                />
                {errors.yachtName && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.yachtName}</p>
                )}
              </div>

              <div>
                <label className={labelBase}>Yacht Type</label>
                <select
                  className={inputBase + (errors.yachtType ? " border-red-300" : "")}
                  value={formState.yachtType}
                  onChange={(e) => setField("yachtType", e.target.value)}
                >
                  <option value="">Select yacht type</option>
                  {yachtTypeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.yachtType && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.yachtType}</p>
                )}
              </div>

              <div>
                <label className={labelBase}>Builder</label>
                <input
                  className={inputBase + (errors.builder ? " border-red-300" : "")}
                  placeholder="Yacht builder/manufacturer"
                  value={formState.builder}
                  onChange={(e) => setField("builder", e.target.value)}
                />
                {errors.builder && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.builder}</p>
                )}
              </div>

              <div>
                <label className={labelBase}>Model</label>
                <input
                  className={inputBase + (errors.model ? " border-red-300" : "")}
                  placeholder="Yacht model"
                  value={formState.model}
                  onChange={(e) => setField("model", e.target.value)}
                />
                {errors.model && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.model}</p>
                )}
              </div>
            </div>

            {/* Year / Length / Beam / Draft Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <label className={labelBase}>Year Built</label>
                <input
                  className={inputBase + (errors.yearBuilt ? " border-red-300" : "")}
                  placeholder="Year"
                  value={formState.yearBuilt}
                  onChange={(e) => setField("yearBuilt", e.target.value)}
                />
                {errors.yearBuilt && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.yearBuilt}</p>
                )}
              </div>

              <div className="md:col-span-4">
                <label className={labelBase}>Length Overall</label>
                <div className="flex gap-2">
                  <input
                    className={inputBase + (errors.lengthOverall ? " border-red-300" : "")}
                    placeholder="Length"
                    value={formState.lengthOverall}
                    onChange={(e) => setField("lengthOverall", e.target.value)}
                  />
                  <select
                    className={inputBase + " w-20"}
                    value={formState.lengthUnit}
                    onChange={(e) => setField("lengthUnit", e.target.value as "ft" | "m")}
                  >
                    <option value="ft">ft</option>
                    <option value="m">m</option>
                  </select>
                </div>
                {errors.lengthOverall && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.lengthOverall}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelBase}>Beam</label>
                <div className="flex gap-2">
                  <input
                    className={inputBase + (errors.beam ? " border-red-300" : "")}
                    placeholder="Beam"
                    value={formState.beam}
                    onChange={(e) => setField("beam", e.target.value)}
                  />
                  <select
                    className={inputBase + " w-20"}
                    value={formState.beamUnit}
                    onChange={(e) => setField("beamUnit", e.target.value as "ft" | "m")}
                  >
                    <option value="ft">ft</option>
                    <option value="m">m</option>
                  </select>
                </div>
                {errors.beam && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.beam}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelBase}>Draft</label>
                <div className="flex gap-2">
                  <input
                    className={inputBase + (errors.draft ? " border-red-300" : "")}
                    placeholder="Draft"
                    value={formState.draft}
                    onChange={(e) => setField("draft", e.target.value)}
                  />
                  <select
                    className={inputBase + " w-20"}
                    value={formState.draftUnit}
                    onChange={(e) => setField("draftUnit", e.target.value as "ft" | "m")}
                  >
                    <option value="ft">ft</option>
                    <option value="m">m</option>
                  </select>
                </div>
                {errors.draft && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.draft}</p>
                )}
              </div>
            </div>

            {/* Location + Price */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <label className={labelBase}>Location</label>
                <input
                  className={inputBase + (errors.location ? " border-red-300" : "")}
                  placeholder="Current location"
                  value={formState.location}
                  onChange={(e) => setField("location", e.target.value)}
                />
                {errors.location && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.location}</p>
                )}
              </div>

              <div className="md:col-span-6">
                <label className={labelBase}>Price</label>
                <div className="flex gap-2">
                  <select
                    className={inputBase + " w-24"}
                    value={formState.priceCurrency}
                    onChange={(e) => setField("priceCurrency", e.target.value as "$" | "€")}
                  >
                    <option value="$">$ Dollar</option>
                    <option value="€">€ Euro</option>
                  </select>
                  <input
                    className={inputBase + (errors.price ? " border-red-300" : "")}
                    placeholder="Enter price"
                    value={formState.price}
                    onChange={(e) => setField("price", e.target.value)}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Guest Capacity / Bathrooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelBase}>Guest Capacity</label>
                <input
                  className={inputBase + (errors.guestCapacity ? " border-red-300" : "")}
                  placeholder="e.g. 12 guests"
                  value={formState.guestCapacity}
                  onChange={(e) => setField("guestCapacity", e.target.value)}
                />
                {errors.guestCapacity && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.guestCapacity}</p>
                )}
              </div>

              <div>
                <label className={labelBase}>Bathrooms</label>
                <input
                  className={inputBase + (errors.bathrooms ? " border-red-300" : "")}
                  placeholder="Number of bathrooms"
                  value={formState.bathrooms}
                  onChange={(e) => setField("bathrooms", e.target.value)}
                />
                {errors.bathrooms && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.bathrooms}</p>
                )}
              </div>
            </div>

            {/* Cabins / Guests / Crew */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelBase}>Cabins</label>
                <input
                  className={inputBase + (errors.cabins ? " border-red-300" : "")}
                  placeholder="Number of cabins"
                  value={formState.cabins}
                  onChange={(e) => setField("cabins", e.target.value)}
                />
                {errors.cabins && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.cabins}</p>
                )}
              </div>

              <div>
                <label className={labelBase}>Guests</label>
                <input
                  className={inputBase + (errors.guests ? " border-red-300" : "")}
                  placeholder="Sleeping guests"
                  value={formState.guests}
                  onChange={(e) => setField("guests", e.target.value)}
                />
                {errors.guests && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.guests}</p>
                )}
              </div>

              <div>
                <label className={labelBase}>Crew Berth (s)</label>
                <input
                  className={inputBase + (errors.crew ? " border-red-300" : "")}
                  placeholder="Crew Berth (s)"
                  value={formState.crew}
                  onChange={(e) => setField("crew", e.target.value)}
                />
                {errors.crew && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.crew}</p>
                )}
              </div>
            </div>

            {/* Construction / Status / VAT */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5">
                <label className={labelBase}>Construction</label>
                <select
                  className={inputBase + (errors.construction ? " border-red-300" : "")}
                  value={formState.construction}
                  onChange={(e) => setField("construction", e.target.value as any)}
                >
                  <option value="">Select construction</option>
                  {constructionOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.construction && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.construction}</p>
                )}
              </div>

              <div className="md:col-span-4">
                <label className={labelBase}>Status</label>
                <select
                  className={inputBase + (errors.status ? " border-red-300" : "")}
                  value={formState.status}
                  onChange={(e) => setField("status", e.target.value as any)}
                >
                  <option value="">Select status</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.status}</p>
                )}
              </div>

              <div className="md:col-span-3 flex items-center gap-2 pb-2">
                <input
                  id="docVatPaid"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-[#65A30D] focus:ring-[#65A30D]/20"
                  checked={formState.vatPaid}
                  onChange={(e) => setField("vatPaid", e.target.checked)}
                />
                <label htmlFor="docVatPaid" className="text-xs text-gray-600 font-medium">
                  VAT/Tax Paid
                </label>
              </div>
            </div>

            {/* Gross Tons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelBase}>Gross Tons</label>
                <input
                  className={inputBase + (errors.grossTons ? " border-red-300" : "")}
                  placeholder="Gross tonnage"
                  value={formState.grossTons}
                  onChange={(e) => setField("grossTons", e.target.value)}
                />
                {errors.grossTons && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.grossTons}</p>
                )}
              </div>
            </div>

            {/* Yacht Images Section */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <label className={labelBase + " text-sm font-bold text-gray-900 mb-4"}>Yacht Images</label>
              
              {/* Large Main Image Preview */}
              {activePreviewUrl ? (
                <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePreviewUrl}
                    alt="Main yacht preview"
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  {/* Delete button for main image */}
                  <button
                    type="button"
                    onClick={() => {
                      const isExisting = formState.existingImages.includes(activePreviewUrl);
                      if (isExisting) {
                        handleDeleteExistingImage(activePreviewUrl);
                      } else {
                        const idx = formState.newImagePreviews.findIndex((p: any) => p.url === activePreviewUrl);
                        if (idx !== -1) {
                          handleDeleteNewImage(idx);
                        }
                      }
                    }}
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2 shadow-md transition duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <X size={14} />
                    Delete Active Image
                  </button>
                </div>
              ) : (
                <div className="w-full h-[350px] md:h-[450px] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50">
                  <div className="w-14 h-14 rounded-2xl bg-[#65A30D1A] flex items-center justify-center mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#65A30D]">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">No images remaining</p>
                  <p className="text-xs text-gray-500 mt-1">Please add at least one image</p>
                </div>
              )}

              {/* Thumbnails list */}
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                {/* Existing Images Thumbnails */}
                {formState.existingImages.map((url: string, idx: number) => {
                  const isActive = activePreviewUrl === url;
                  return (
                    <div 
                      key={`existing-${url}`} 
                      className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                        isActive ? "border-[#65A30D] shadow-sm scale-95" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setActivePreviewUrl(url)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Thumbnail ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteExistingImage(url);
                        }}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition"
                      >
                        <X size={10} strokeWidth={3} />
                      </button>
                    </div>
                  );
                })}

                {/* New Image Previews Thumbnails */}
                {formState.newImagePreviews.map((preview: any, idx: number) => {
                  const isActive = activePreviewUrl === preview.url;
                  return (
                    <div 
                      key={`new-${preview.url}`} 
                      className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                        isActive ? "border-[#65A30D] shadow-sm scale-95" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setActivePreviewUrl(preview.url)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview.url}
                        alt={`New Thumbnail ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNewImage(idx);
                        }}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition"
                      >
                        <X size={10} strokeWidth={3} />
                      </button>
                    </div>
                  );
                })}

                {/* Add More Images Input Button */}
                <label 
                  htmlFor="addMoreImagesInput" 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#65A30D]/50 bg-white hover:bg-[#65A30D]/[0.02] flex flex-col items-center justify-center cursor-pointer transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#65A30D]">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[10px] font-bold text-[#65A30D] mt-1.5">Add Images</span>
                </label>
                <input
                  id="addMoreImagesInput"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      handleAddNewImages(files);
                    }
                  }}
                />
              </div>
              {errors.newImages && (
                <p className="mt-1.5 text-xs text-red-500">{errors.newImages}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className={labelBase}>Description</label>
              <textarea
                className={inputBase + " min-h-[110px] resize-none" + (errors.description ? " border-red-300" : "")}
                placeholder="Detailed description of the yacht..."
                value={formState.description}
                onChange={(e) => setField("description", e.target.value)}
              />
              {errors.description && (
                <p className="mt-1 text-[11px] text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Engine Make / Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelBase}>Engine Make</label>
                <input
                  className={inputBase + (errors.engineMake ? " border-red-300" : "")}
                  placeholder="Engine manufacturer"
                  value={formState.engineMake}
                  onChange={(e) => setField("engineMake", e.target.value)}
                />
                {errors.engineMake && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.engineMake}</p>
                )}
              </div>
              <div>
                <label className={labelBase}>Engine Model</label>
                <input
                  className={inputBase + (errors.engineModel ? " border-red-300" : "")}
                  placeholder="Engine model"
                  value={formState.engineModel}
                  onChange={(e) => setField("engineModel", e.target.value)}
                />
                {errors.engineModel && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.engineModel}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setExtractedListing(null);
                  setFormState(null);
                  setFile(null);
                }}
                className="h-10 px-6 rounded-md border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="h-10 px-6 rounded-md bg-[#65A30D] text-white text-sm font-semibold hover:bg-[#5a8f0c] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Listing"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <>
          {/* ===== Upload Area Card ===== */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`transition-all duration-200 rounded-2xl border-2 border-dashed ${isDragging
                ? "border-[#65A30D] bg-[#65A30D0D]"
                : "border-gray-200 bg-white"
              } shadow-sm`}
          >
            <div className="px-6 py-10 md:px-12 md:py-14">
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl ${isExtracting ? "bg-gray-100" : "bg-[#65A30D1A]"} flex items-center justify-center mb-5`}
                >
                  {isExtracting ? (
                    <div className="w-8 h-8 border-4 border-[#65A30D] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FileText className="text-[#65A30D]" size={28} />
                  )}
                </div>

                {/* Text */}
                <h2 className="text-xl font-bold text-[#65A30D] mb-2">
                  {isExtracting
                    ? progressMessage || "Processing your file..."
                    : file
                      ? file.name
                      : "Drop your file here"}
                </h2>
                <p className="text-xs text-[#6C757D] mb-6">
                  {isExtracting
                    ? "This may take a few moments"
                    : file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : "or click to browse from your computer"}
                </p>
                {isExtracting && partialData && (
                  <div className="mb-6 p-4 rounded-xl bg-[#F6FAF1] border border-[#DCE9C7] max-w-sm w-full">
                    <p className="text-[10px] font-bold text-[#65A30D] uppercase tracking-wider mb-2">Extracted Preview</p>
                    <div className="text-left space-y-1">
                      {partialData.yachtName && <p className="text-xs text-gray-700"><strong>Name:</strong> {partialData.yachtName}</p>}
                      {partialData.builder && <p className="text-xs text-gray-700"><strong>Builder:</strong> {partialData.builder}</p>}
                      {partialData.price && <p className="text-xs text-gray-700"><strong>Price:</strong> {partialData.price}</p>}
                    </div>
                  </div>
                )}

                {/* Hidden Input */}
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={isExtracting}
                />

                {/* Buttons */}
                <div className="flex flex-col justify-center sm:flex-row gap-3 w-full max-w-md">
                  <div>
                    {!isExtracting && !file && (
                      <label
                        htmlFor="file-upload"
                        className="bg-[#65A30D] hover:bg-[#5a8f0c] text-white transition text-sm font-semibold px-8 py-2.5 rounded-lg cursor-pointer text-center block"
                      >
                        Select File
                      </label>
                    )}
                  </div>

                  {file && !isExtracting && (
                    <>
                      <button
                        onClick={handleGenerate}
                        className="flex-1 bg-[#65A30D] hover:bg-[#5a8f0c] text-white transition text-sm font-semibold px-6 py-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Sparkles size={16} />
                        Generate
                      </button>

                      <button
                        onClick={handleRemoveFile}
                        className="flex-1 sm:flex-initial bg-red-50 hover:bg-red-100 text-red-600 transition text-sm font-semibold px-6 py-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Remove
                      </button>
                    </>
                  )}
                </div>

                {/* Helper */}
                <p className="text-[11px] text-[#6C757D] mt-6">
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
            </div>
          </div>

          {/* ===== What Happens Next Card ===== */}
          <div className="mt-6 rounded-2xl border border-gray-200 shadow-sm bg-white">
            <div className="px-6 py-6">
              <h2 className="text-sm font-semibold text-[#65A30D] mb-4">
                What happens next?
              </h2>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-md bg-[#65A30D1A] flex items-center justify-center text-xs font-semibold text-[#65A30D]">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      AI Extraction
                    </h3>
                    <p className="text-xs text-[#6C757D] mt-1">
                      Our AI analyzes your document and extracts all yacht
                      specifications
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-md bg-[#65A30D1A] flex items-center justify-center text-xs font-semibold text-[#65A30D]">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Review &amp; Edit
                    </h3>
                    <p className="text-xs text-[#6C757D] mt-1">
                      Verify the extracted information and make any necessary
                      adjustments
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-md bg-[#65A30D1A] flex items-center justify-center text-xs font-semibold text-[#65A30D]">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Generate Content
                    </h3>
                    <p className="text-xs text-[#6C757D] mt-1">
                      Create AI-powered social media posts for your listing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

