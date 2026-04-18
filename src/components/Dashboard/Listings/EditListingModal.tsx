"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Listing } from "@/lib/services/listingService";
import { useUpdateListing } from "@/lib/hooks/useListing";
import { toast } from "sonner";
import axios from "axios";

type Unit = "ft" | "m";
type Construction = "" | "GRP" | "Steel" | "Aluminum" | "Wood" | "Composite";

type FormState = {
  yachtName: string;
  yachtType: string;
  builder: string;
  model: string;
  yearBuilt: string;
  lengthOverall: string;
  lengthUnit: Unit;
  beam: string;
  beamUnit: Unit;
  draft: string;
  draftUnit: Unit;
  location: string;
  price: string;
  guestCapacity: string;
  bathrooms: string;
  bedrooms: string;
  cabins: string;
  guests: string;
  crew: string;
  construction: Construction;
  grossTons: string;
  description: string;
  engineMake: string;
  engineModel: string;
  isActive: boolean;
  existingImages: string[];
  newImages: File[];
  newImagePreviews: { file: File; url: string }[];
};

type Errors = Partial<Record<keyof FormState, string>>;

const inputBase =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#65A30D]/60 focus:ring-2 focus:ring-[#65A30D]/15";
const labelBase = "text-[11px] font-medium text-gray-600";

function isPositiveNumber(v: string) {
  if (v.trim() === "") return false;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0;
}

function normalizeUnit(u: string | undefined): Unit {
  return (u || "").toLowerCase() === "m" ? "m" : "ft";
}

function pickConstruction(c: Listing["constructions"]): Construction {
  if (!c) return "";
  if (c.GRP) return "GRP";
  if (c.Steel) return "Steel";
  if (c.Aluminum) return "Aluminum";
  if (c.Wood) return "Wood";
  if (c.Composite) return "Composite";
  return "";
}

interface EditListingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditListingModal({
  listing,
  isOpen,
  onClose,
}: EditListingModalProps) {
  const { mutateAsync: updateListing, isPending } = useUpdateListing();

  const [form, setForm] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const yachtTypeOptions = useMemo(
    () =>
      [
        "Motor Yacht",
        "Sailing Yacht",
        "Catamaran",
        "Sport Yacht",
        "Superyacht",
        "Other",
      ] as const,
    [],
  );

  const constructionOptions = useMemo(
    () => ["GRP", "Steel", "Aluminum", "Wood", "Composite"] as const,
    [],
  );

  useEffect(() => {
    if (!listing || !isOpen) return;
    setForm({
      yachtName: listing.yachtName ?? "",
      yachtType: listing.yachtType ?? "",
      builder: listing.builder ?? "",
      model: listing.model ?? "",
      yearBuilt: String(listing.yearBuilt ?? ""),
      lengthOverall: String(listing.lengthOverall?.value ?? ""),
      lengthUnit: normalizeUnit(listing.lengthOverall?.unit),
      beam: String(listing.beam?.value ?? ""),
      beamUnit: normalizeUnit(listing.beam?.unit),
      draft: String(listing.draft?.value ?? ""),
      draftUnit: normalizeUnit(listing.draft?.unit),
      location: listing.location ?? "",
      price: String(listing.Price ?? ""),
      guestCapacity: String(listing.guestCapacity ?? ""),
      bathrooms: String(listing.bathRooms ?? ""),
      bedrooms: String(listing.bedRooms ?? ""),
      cabins: String(listing.cabins ?? ""),
      guests: String(listing.guests ?? ""),
      crew: String(listing.crew ?? ""),
      construction: pickConstruction(listing.constructions),
      grossTons: String(listing.grossTons ?? ""),
      description: listing.description ?? "",
      engineMake: listing.engineMake ?? "",
      engineModel: listing.engineModel ?? "",
      isActive: !!listing.isActive,
      existingImages: listing.images ?? [],
      newImages: [],
      newImagePreviews: [],
    });
    setErrors({});
  }, [listing, isOpen]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (f: FormState): Errors => {
    const e: Errors = {};

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

    const numericFields: Array<{ key: keyof FormState; label: string }> = [
      { key: "lengthOverall", label: "Length overall" },
      { key: "beam", label: "Beam" },
      { key: "draft", label: "Draft" },
      { key: "price", label: "Price" },
      { key: "guestCapacity", label: "Guest capacity" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "bedrooms", label: "Bedrooms" },
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

  const handleClose = () => {
    if (form) {
      form.newImagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    }
    setForm(null);
    setErrors({});
    onClose();
  };

  const handleSave = async () => {
    if (!form || !listing) return;

    const e = validate(form);
    setErrors(e);
    if (Object.values(e).some(Boolean)) {
      toast.error("Please check all required fields");
      return;
    }

    const fd = new FormData();
    fd.append("yachtName", form.yachtName);
    fd.append("builder", form.builder);
    fd.append("yachtType", form.yachtType);
    fd.append("model", form.model);
    fd.append("location", form.location);
    fd.append("guestCapacity", String(Number(form.guestCapacity)));
    fd.append("Price", String(Number(form.price)));
    fd.append("bathRooms", String(Number(form.bathrooms)));
    fd.append("bedRooms", String(Number(form.bedrooms)));
    fd.append("cabins", String(Number(form.cabins)));
    fd.append("crew", String(Number(form.crew)));
    fd.append("guests", String(Number(form.guests)));

    fd.append(
      "constructions",
      JSON.stringify({
        GRP: form.construction === "GRP",
        Steel: form.construction === "Steel",
        Aluminum: form.construction === "Aluminum",
        Wood: form.construction === "Wood",
        Composite: form.construction === "Composite",
      }),
    );

    fd.append("yearBuilt", String(Number(form.yearBuilt)));

    fd.append(
      "lengthOverall",
      JSON.stringify({
        value: Number(form.lengthOverall),
        unit: form.lengthUnit,
      }),
    );
    fd.append(
      "beam",
      JSON.stringify({ value: Number(form.beam), unit: form.beamUnit }),
    );
    fd.append(
      "draft",
      JSON.stringify({ value: Number(form.draft), unit: form.draftUnit }),
    );

    fd.append("grossTons", String(Number(form.grossTons)));
    fd.append("engineMake", form.engineMake);
    fd.append("engineModel", form.engineModel);
    fd.append("description", form.description);
    fd.append("isActive", String(form.isActive));

    fd.append("images", JSON.stringify(form.existingImages));
    form.newImages.forEach((file) => fd.append("images", file));

    try {
      await updateListing({ listingId: listing._id, data: fd });
      toast.success("Listing updated successfully");
      handleClose();
    } catch (err) {
      let msg = "Update failed";
      if (axios.isAxiosError(err)) {
        msg = err?.response?.data?.message ?? err?.message ?? msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(
        `Update Failed: ${typeof msg === "string" ? msg : JSON.stringify(msg)}`,
      );
    }
  };

  if (!form) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-3xl" />
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-lg font-bold text-[#65A30D]">
            Edit Listing
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="px-6 pb-6 pt-2 space-y-4"
        >
          {/* Yacht Name / Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Yacht Name</label>
              <input
                className={
                  inputBase + (errors.yachtName ? " border-red-300" : "")
                }
                value={form.yachtName}
                onChange={(e) => setField("yachtName", e.target.value)}
              />
              {errors.yachtName && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.yachtName}
                </p>
              )}
            </div>

            <div>
              <label className={labelBase}>Yacht Type</label>
              <select
                className={
                  inputBase + (errors.yachtType ? " border-red-300" : "")
                }
                value={form.yachtType}
                onChange={(e) => setField("yachtType", e.target.value)}
              >
                <option value="">Select yacht type</option>
                {yachtTypeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.yachtType && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.yachtType}
                </p>
              )}
            </div>

            <div>
              <label className={labelBase}>Builder</label>
              <input
                className={
                  inputBase + (errors.builder ? " border-red-300" : "")
                }
                value={form.builder}
                onChange={(e) => setField("builder", e.target.value)}
              />
              {errors.builder && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.builder}
                </p>
              )}
            </div>

            <div>
              <label className={labelBase}>Model</label>
              <input
                className={inputBase + (errors.model ? " border-red-300" : "")}
                value={form.model}
                onChange={(e) => setField("model", e.target.value)}
              />
              {errors.model && (
                <p className="mt-1 text-[11px] text-red-500">{errors.model}</p>
              )}
            </div>
          </div>

          {/* Year / Length / Beam / Draft */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <label className={labelBase}>Year Built</label>
              <input
                className={
                  inputBase + (errors.yearBuilt ? " border-red-300" : "")
                }
                value={form.yearBuilt}
                onChange={(e) => setField("yearBuilt", e.target.value)}
              />
              {errors.yearBuilt && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.yearBuilt}
                </p>
              )}
            </div>

            <div className="md:col-span-3">
              <label className={labelBase}>Length Overall</label>
              <div className="flex gap-2">
                <input
                  className={
                    inputBase + (errors.lengthOverall ? " border-red-300" : "")
                  }
                  value={form.lengthOverall}
                  onChange={(e) => setField("lengthOverall", e.target.value)}
                />
                <select
                  className={inputBase + " w-20"}
                  value={form.lengthUnit}
                  onChange={(e) =>
                    setField("lengthUnit", e.target.value as Unit)
                  }
                >
                  <option value="ft">ft</option>
                  <option value="m">m</option>
                </select>
              </div>
              {errors.lengthOverall && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.lengthOverall}
                </p>
              )}
            </div>

            <div className="md:col-span-3">
              <label className={labelBase}>Beam</label>
              <div className="flex gap-2">
                <input
                  className={inputBase + (errors.beam ? " border-red-300" : "")}
                  value={form.beam}
                  onChange={(e) => setField("beam", e.target.value)}
                />
                <select
                  className={inputBase + " w-20"}
                  value={form.beamUnit}
                  onChange={(e) => setField("beamUnit", e.target.value as Unit)}
                >
                  <option value="ft">ft</option>
                  <option value="m">m</option>
                </select>
              </div>
              {errors.beam && (
                <p className="mt-1 text-[11px] text-red-500">{errors.beam}</p>
              )}
            </div>

            <div className="md:col-span-3">
              <label className={labelBase}>Draft</label>
              <div className="flex gap-2">
                <input
                  className={
                    inputBase + (errors.draft ? " border-red-300" : "")
                  }
                  value={form.draft}
                  onChange={(e) => setField("draft", e.target.value)}
                />
                <select
                  className={inputBase + " w-20"}
                  value={form.draftUnit}
                  onChange={(e) =>
                    setField("draftUnit", e.target.value as Unit)
                  }
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

          {/* Location / Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Location</label>
              <input
                className={
                  inputBase + (errors.location ? " border-red-300" : "")
                }
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
              />
              {errors.location && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              <label className={labelBase}>Price (USD)</label>
              <input
                className={inputBase + (errors.price ? " border-red-300" : "")}
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
              />
              {errors.price && (
                <p className="mt-1 text-[11px] text-red-500">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Guest Capacity / Bedrooms / Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelBase}>Guest Capacity</label>
              <input
                className={
                  inputBase + (errors.guestCapacity ? " border-red-300" : "")
                }
                value={form.guestCapacity}
                onChange={(e) => setField("guestCapacity", e.target.value)}
              />
              {errors.guestCapacity && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.guestCapacity}
                </p>
              )}
            </div>
            <div>
              <label className={labelBase}>Bedrooms</label>
              <input
                className={
                  inputBase + (errors.bedrooms ? " border-red-300" : "")
                }
                value={form.bedrooms}
                onChange={(e) => setField("bedrooms", e.target.value)}
              />
              {errors.bedrooms && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.bedrooms}
                </p>
              )}
            </div>
            <div>
              <label className={labelBase}>Bathrooms</label>
              <input
                className={
                  inputBase + (errors.bathrooms ? " border-red-300" : "")
                }
                value={form.bathrooms}
                onChange={(e) => setField("bathrooms", e.target.value)}
              />
              {errors.bathrooms && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.bathrooms}
                </p>
              )}
            </div>
          </div>

          {/* Cabins / Guests / Crew */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelBase}>Cabins</label>
              <input
                className={inputBase + (errors.cabins ? " border-red-300" : "")}
                value={form.cabins}
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
                value={form.guests}
                onChange={(e) => setField("guests", e.target.value)}
              />
              {errors.guests && (
                <p className="mt-1 text-[11px] text-red-500">{errors.guests}</p>
              )}
            </div>
            <div>
              <label className={labelBase}>Crew Berth(s)</label>
              <input
                className={inputBase + (errors.crew ? " border-red-300" : "")}
                value={form.crew}
                onChange={(e) => setField("crew", e.target.value)}
              />
              {errors.crew && (
                <p className="mt-1 text-[11px] text-red-500">{errors.crew}</p>
              )}
            </div>
          </div>

          {/* Construction / Status / GrossTons */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <label className={labelBase}>Construction</label>
              <select
                className={
                  inputBase + (errors.construction ? " border-red-300" : "")
                }
                value={form.construction}
                onChange={(e) =>
                  setField("construction", e.target.value as Construction)
                }
              >
                <option value="">Select construction</option>
                {constructionOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.construction && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.construction}
                </p>
              )}
            </div>

            <div className="md:col-span-4">
              <label className={labelBase}>Gross Tons</label>
              <input
                className={
                  inputBase + (errors.grossTons ? " border-red-300" : "")
                }
                value={form.grossTons}
                onChange={(e) => setField("grossTons", e.target.value)}
              />
              {errors.grossTons && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.grossTons}
                </p>
              )}
            </div>

            <div className="md:col-span-3 flex items-center gap-2 mt-5">
              <input
                id="editIsActive"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#65A30D] focus:ring-[#65A30D]/20"
                checked={form.isActive}
                onChange={(e) => setField("isActive", e.target.checked)}
              />
              <label htmlFor="editIsActive" className="text-xs text-gray-600">
                Active
              </label>
            </div>
          </div>

          {/* Engine Make / Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Engine Make</label>
              <input
                className={
                  inputBase + (errors.engineMake ? " border-red-300" : "")
                }
                value={form.engineMake}
                onChange={(e) => setField("engineMake", e.target.value)}
              />
              {errors.engineMake && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.engineMake}
                </p>
              )}
            </div>
            <div>
              <label className={labelBase}>Engine Model</label>
              <input
                className={
                  inputBase + (errors.engineModel ? " border-red-300" : "")
                }
                value={form.engineModel}
                onChange={(e) => setField("engineModel", e.target.value)}
              />
              {errors.engineModel && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.engineModel}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelBase}>Description</label>
            <textarea
              className={
                inputBase +
                " min-h-[110px] resize-none" +
                (errors.description ? " border-red-300" : "")
              }
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
            {errors.description && (
              <p className="mt-1 text-[11px] text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className={labelBase}>Images</label>

            {(form.existingImages.length > 0 ||
              form.newImagePreviews.length > 0) && (
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                {form.existingImages.map((url, idx) => (
                  <div key={url} className="relative group aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`listing ${idx}`}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setField(
                          "existingImages",
                          form.existingImages.filter((_, i) => i !== idx),
                        )
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm cursor-pointer"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {form.newImagePreviews.map((preview, idx) => (
                  <div key={preview.url} className="relative group aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview.url}
                      alt={`new ${idx}`}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(preview.url);
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                newImages: prev.newImages.filter(
                                  (_, i) => i !== idx,
                                ),
                                newImagePreviews: prev.newImagePreviews.filter(
                                  (_, i) => i !== idx,
                                ),
                              }
                            : prev,
                        );
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm cursor-pointer"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label
              htmlFor="editImages"
              className="mt-3 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 hover:border-[#65A30D]/50 bg-white p-6 text-center transition"
            >
              <span className="text-sm font-semibold text-[#65A30D]">
                + Add more images
              </span>
            </label>

            <input
              id="editImages"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;

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

                if (validFiles.length < files.length) {
                  setErrors((prev) => ({
                    ...prev,
                    newImages: "Some images were over 5MB and skipped",
                  }));
                } else {
                  setErrors((prev) => ({ ...prev, newImages: "" }));
                }

                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        newImages: [...prev.newImages, ...validFiles],
                        newImagePreviews: [
                          ...prev.newImagePreviews,
                          ...newPreviews,
                        ],
                      }
                    : prev,
                );

                e.target.value = "";
              }}
            />

            {errors.newImages && (
              <p className="mt-1 text-[11px] text-red-500">
                {errors.newImages}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="h-10 min-w-[110px] rounded-md border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="h-10 min-w-[110px] rounded-md bg-[#65A30D] text-white text-sm font-semibold hover:bg-[#5a8f0c] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
