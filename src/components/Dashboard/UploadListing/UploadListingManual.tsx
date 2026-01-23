"use client";

import axiosInstance from "@/lib/instance/axios-instance";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

type FormState = {
  yachtName: string;
  yachtType: string;
  builder: string;
  model: string;

  yearBuilt: string;
  lengthOverall: string;
  lengthUnit: "ft" | "m";
  beam: string;
  beamUnit: "ft" | "m";
  draft: string;
  draftUnit: "ft" | "m";

  location: string;

  priceCurrency: "$" | "€";
  price: string;

  guestCapacity: string;
  bedrooms: string;
  bathrooms: string;

  cabins: string;
  guests: string;
  crew: string;

  construction: "" | "GRP" | "Steel" | "Aluminum" | "Wood" | "Composite";
  status: "" | "For Sale" | "For Charter" | "Sold" | "Sale Pending";

  grossTons: string;
  vatPaid: boolean;

  images: File[];
  imagePreviews: { file: File; url: string }[];

  description: string;

  engineMake: string;
  engineModel: string;
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

/** ✅ Prevent "Cannot convert object to primitive value" in alerts/logs */
function safeToString(value: unknown) {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export default function UploadListingManual() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({
    yachtName: "",
    yachtType: "",
    builder: "",
    model: "",

    yearBuilt: "",
    lengthOverall: "",
    lengthUnit: "ft",
    beam: "",
    beamUnit: "ft",
    draft: "",
    draftUnit: "ft",

    location: "",

    priceCurrency: "$",
    price: "",

    guestCapacity: "",
    bedrooms: "",
    bathrooms: "",

    cabins: "",
    guests: "",
    crew: "",

    construction: "",
    status: "",

    grossTons: "",
    vatPaid: false,

    images: [],
    imagePreviews: [],

    description: "",

    engineMake: "",
    engineModel: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const constructionOptions = useMemo(
    () => ["GRP", "Steel", "Aluminum", "Wood", "Composite"] as const,
    [],
  );

  const statusOptions = useMemo(
    () => ["For Sale", "For Charter", "Sold", "Sale Pending"] as const,
    [],
  );

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

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): Errors => {
    const e: Errors = {};

    if (!form.yachtName.trim()) e.yachtName = "Yacht name is required";
    if (!form.yachtType.trim()) e.yachtType = "Yacht type is required";
    if (!form.builder.trim()) e.builder = "Builder is required";
    if (!form.model.trim()) e.model = "Model is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.construction) e.construction = "Construction is required";
    if (!form.status) e.status = "Status is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.engineMake.trim()) e.engineMake = "Engine make is required";
    if (!form.engineModel.trim()) e.engineModel = "Engine model is required";

    if (form.images.length === 0) e.images = "At least one image is required";

    if (!form.yearBuilt.trim()) {
      e.yearBuilt = "Year built is required";
    } else {
      const y = Number(form.yearBuilt);
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
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "cabins", label: "Cabins" },
      { key: "guests", label: "Guests" },
      { key: "crew", label: "Crew" },
      { key: "grossTons", label: "Gross tons" },
    ];

    for (const f of numericFields) {
      const v = String(form[f.key] ?? "");
      if (!v.trim()) e[f.key] = `${f.label} is required`;
      else if (!isPositiveNumber(v)) e[f.key] = `${f.label} must be a number`;
    }

    return e;
  };

  /** ✅ Optional: log FormData entries for debugging */
  const logFormData = (fd: FormData) => {
    // NOTE: Avoid logging big files in prod
    for (const [k, v] of fd.entries()) {
      if (v instanceof File) {
        console.log(
          `${k}: [File] name=${v.name} size=${v.size} type=${v.type}`,
        );
      } else {
        console.log(`${k}: ${v}`);
      }
    }
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const e = validate();
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    const fd = new FormData();
    // Basic fields
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

    // constructions (JSON string as per screenshot)
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

    // lengthOverall (JSON string)
    fd.append(
      "lengthOverall",
      JSON.stringify({
        value: Number(form.lengthOverall),
        unit: form.lengthUnit,
      }),
    );

    // beam (JSON string)
    fd.append(
      "beam",
      JSON.stringify({
        value: Number(form.beam),
        unit: form.beamUnit,
      }),
    );

    // draft (JSON string)
    fd.append(
      "draft",
      JSON.stringify({
        value: Number(form.draft),
        unit: form.draftUnit,
      }),
    );

    fd.append("grossTons", String(Number(form.grossTons)));
    fd.append("engineMake", form.engineMake);
    fd.append("engineModel", form.engineModel);

    // images array
    form.images.forEach((file) => fd.append("images", file));

    fd.append("description", form.description);
    fd.append("isActive", "true");

    setIsSubmitting(true);
    try {
      // ✅ Axios will set the correct boundary automatically when Content-Type is OMITTED
      const res = await axiosInstance.post("/listing/create", fd);
      console.log("🚀 SUCCESS:", res.data);
      alert("Submitted Successfully ✅");
      onCancel();
    } catch (err) {
      console.error("❌ SUBMISSION FAILED:", err);

      // ✅ SAFE: message can be object (validation errors), stringify it
      let msg = "Request failed";
      if (axios.isAxiosError(err)) {
        msg = err?.response?.data?.message ?? err?.message ?? msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      alert(`Submission Failed: ${safeToString(msg)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearPreviewUrls = () => {
    form.imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
  };

  const onCancel = () => {
    clearPreviewUrls();

    setForm((p) => ({
      ...p,
      yachtName: "",
      yachtType: "",
      builder: "",
      model: "",
      yearBuilt: "",
      lengthOverall: "",
      lengthUnit: "ft",
      beam: "",
      beamUnit: "ft",
      draft: "",
      draftUnit: "ft",
      location: "",
      priceCurrency: "$",
      price: "",
      guestCapacity: "",
      bedrooms: "",
      bathrooms: "",
      cabins: "",
      guests: "",
      crew: "",
      construction: "",
      status: "",
      grossTons: "",
      vatPaid: false,
      images: [],
      imagePreviews: [],
      description: "",
      engineMake: "",
      engineModel: "",
    }));

    setErrors({});
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* ===== Header ===== */}
      <div className="flex items-start gap-3 mb-6">
        <Link href="/upload-listing">
          <button className="mt-1 text-gray-500 hover:text-gray-700 transition cursor-pointer">
            <ArrowLeft size={18} />
          </button>
        </Link>

        <div>
          <h1 className="text-lg font-bold text-[#65A30D]">Manual Entry</h1>
          <p className="text-xs text-[#6C757D] mt-0.5">
            Fill out the yacht form here
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="mx-auto container rounded-lg border border-gray-200"
      >
        <div className="p-4 md:p-6">
          {/* ===== Top 2 Columns ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Yacht Name</label>
              <input
                className={
                  inputBase + (errors.yachtName ? " border-red-300" : "")
                }
                placeholder="Azimut Grande 35 Metri"
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
                placeholder="Yacht builder/manufacturer"
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
                placeholder="Yacht model"
                value={form.model}
                onChange={(e) => setField("model", e.target.value)}
              />
              {errors.model && (
                <p className="mt-1 text-[11px] text-red-500">{errors.model}</p>
              )}
            </div>
          </div>

          {/* ===== Year / Length / Beam / Draft Row ===== */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className={labelBase}>Year Built</label>
              <input
                className={
                  inputBase + (errors.yearBuilt ? " border-red-300" : "")
                }
                placeholder="Year"
                value={form.yearBuilt}
                onChange={(e) => setField("yearBuilt", e.target.value)}
              />
              {errors.yearBuilt && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.yearBuilt}
                </p>
              )}
            </div>

            <div className="md:col-span-4">
              <label className={labelBase}>Length Overall</label>
              <div className="flex gap-2">
                <input
                  className={
                    inputBase + (errors.lengthOverall ? " border-red-300" : "")
                  }
                  placeholder="Length"
                  value={form.lengthOverall}
                  onChange={(e) => setField("lengthOverall", e.target.value)}
                />
                <select
                  className={inputBase + " w-20"}
                  value={form.lengthUnit}
                  onChange={(e) =>
                    setField("lengthUnit", e.target.value as "ft" | "m")
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

            <div className="md:col-span-2">
              <label className={labelBase}>Beam</label>
              <div className="flex gap-2">
                <input
                  className={inputBase + (errors.beam ? " border-red-300" : "")}
                  placeholder="Beam"
                  value={form.beam}
                  onChange={(e) => setField("beam", e.target.value)}
                />
                <select
                  className={inputBase + " w-20"}
                  value={form.beamUnit}
                  onChange={(e) =>
                    setField("beamUnit", e.target.value as "ft" | "m")
                  }
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
                  className={
                    inputBase + (errors.draft ? " border-red-300" : "")
                  }
                  placeholder="Draft"
                  value={form.draft}
                  onChange={(e) => setField("draft", e.target.value)}
                />
                <select
                  className={inputBase + " w-20"}
                  value={form.draftUnit}
                  onChange={(e) =>
                    setField("draftUnit", e.target.value as "ft" | "m")
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

          {/* ===== Location + Price ===== */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className={labelBase}>Location</label>
              <input
                className={
                  inputBase + (errors.location ? " border-red-300" : "")
                }
                placeholder="Current location"
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
              />
              {errors.location && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.location}
                </p>
              )}
            </div>

            <div className="md:col-span-6">
              <label className={labelBase}>Price</label>
              <div className="flex gap-2">
                <select
                  className={inputBase + " w-24"}
                  value={form.priceCurrency}
                  onChange={(e) =>
                    setField("priceCurrency", e.target.value as "$" | "€")
                  }
                >
                  <option value="$">$ Dollar</option>
                  <option value="€">€ Euro</option>
                </select>
                <input
                  className={
                    inputBase + (errors.price ? " border-red-300" : "")
                  }
                  placeholder="Enter price"
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-[11px] text-red-500">{errors.price}</p>
              )}
            </div>
          </div>

          {/* ===== Guest Capacity / Bedrooms / Bathrooms ===== */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                key: "guestCapacity" as const,
                label: "Guest Capacity",
                placeholder: "e.g. 12 guests",
              },
              {
                key: "bedrooms" as const,
                label: "Bedrooms",
                placeholder: "Number of bedrooms",
              },
              {
                key: "bathrooms" as const,
                label: "Bathrooms",
                placeholder: "Number of bathrooms",
              },
            ].map((f) => (
              <div key={f.key}>
                <label className={labelBase}>{f.label}</label>
                <input
                  className={
                    inputBase + (errors[f.key] ? " border-red-300" : "")
                  }
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
                {errors[f.key] && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors[f.key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ===== Cabins / Guests / Crew ===== */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                key: "cabins" as const,
                label: "Cabins",
                placeholder: "Number of cabins",
              },
              {
                key: "guests" as const,
                label: "Guests",
                placeholder: "Sleeping guests",
              },
              {
                key: "crew" as const,
                label: "Crew",
                placeholder: "Crew members",
              },
            ].map((f) => (
              <div key={f.key}>
                <label className={labelBase}>{f.label}</label>
                <input
                  className={
                    inputBase + (errors[f.key] ? " border-red-300" : "")
                  }
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
                {errors[f.key] && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors[f.key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ===== Construction / Status / VAT ===== */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6">
              <label className={labelBase}>Construction</label>
              <select
                className={
                  inputBase + (errors.construction ? " border-red-300" : "")
                }
                value={form.construction}
                onChange={(e) =>
                  setField(
                    "construction",
                    e.target.value as FormState["construction"],
                  )
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

            <div className="md:col-span-6">
              <label className={labelBase}>Status</label>
              <select
                className={inputBase + (errors.status ? " border-red-300" : "")}
                value={form.status}
                onChange={(e) =>
                  setField("status", e.target.value as FormState["status"])
                }
              >
                <option value="">Select status</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-[11px] text-red-500">{errors.status}</p>
              )}
            </div>

            <div className="md:col-span-6 flex items-center gap-2 mt-1">
              <input
                id="vatPaid"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#65A30D] focus:ring-[#65A30D]/20"
                checked={form.vatPaid}
                onChange={(e) => setField("vatPaid", e.target.checked)}
              />
              <label htmlFor="vatPaid" className="text-xs text-gray-600">
                VAT/Tax Paid
              </label>
            </div>
          </div>

          {/* ===== Gross Tons ===== */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className={labelBase}>Gross Tons</label>
              <input
                className={
                  inputBase + (errors.grossTons ? " border-red-300" : "")
                }
                placeholder="Gross tonnage"
                value={form.grossTons}
                onChange={(e) => setField("grossTons", e.target.value)}
              />
              {errors.grossTons && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.grossTons}
                </p>
              )}
            </div>
          </div>

          {/* ✅ ===== Cover Image Upload ===== */}
          <div className="mt-4">
            <label className={labelBase}>Images</label>

            <label
              htmlFor="coverImage"
              className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-10 text-center transition
                ${errors.images ? "border-red-300" : "border-gray-200"}
                hover:border-[#65A30D]/50 hover:bg-[#65A30D]/[0.03]
              `}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#65A30D1A] flex items-center justify-center mb-4">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#65A30D]"
                >
                  <path
                    d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="text-sm font-semibold text-[#65A30D]">
                Click to upload image
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, JPEG (Max 5MB)
              </p>

              <span className="mt-4 inline-flex items-center justify-center rounded-md bg-[#65A30D] px-6 py-2 text-sm font-semibold text-white hover:bg-[#5a8f0c] transition">
                Select Images
              </span>

              {form.images.length > 0 && (
                <p className="mt-4 text-xs text-gray-500">
                  <span className="font-medium">{form.images.length}</span>{" "}
                  images selected
                </p>
              )}
            </label>

            {form.imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {form.imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview.url}
                      alt={`preview ${idx}`}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(preview.url);
                        const newFiles = form.images.filter(
                          (_, i) => i !== idx,
                        );
                        const newPreviews = form.imagePreviews.filter(
                          (_, i) => i !== idx,
                        );
                        setForm((prev) => ({
                          ...prev,
                          images: newFiles,
                          imagePreviews: newPreviews,
                        }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm"
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

            <input
              id="coverImage"
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
                    images: "Some images were over 5MB and skipped",
                  }));
                } else {
                  setErrors((prev) => ({ ...prev, images: "" }));
                }

                setForm((prev) => ({
                  ...prev,
                  images: [...prev.images, ...validFiles],
                  imagePreviews: [...prev.imagePreviews, ...newPreviews],
                }));
              }}
            />

            {errors.images && (
              <p className="mt-1 text-[11px] text-red-500">{errors.images}</p>
            )}
          </div>

          {/* ===== Description ===== */}
          <div className="mt-4">
            <label className={labelBase}>Description</label>
            <textarea
              className={
                inputBase +
                " min-h-[110px] resize-none" +
                (errors.description ? " border-red-300" : "")
              }
              placeholder="Detailed description of the yacht..."
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
            {errors.description && (
              <p className="mt-1 text-[11px] text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          {/* ===== Engine Make / Model ===== */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Engine Make</label>
              <input
                className={
                  inputBase + (errors.engineMake ? " border-red-300" : "")
                }
                placeholder="Engine manufacturer"
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
                placeholder="Engine model"
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

          {/* ===== Buttons ===== */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-10 min-w-[110px] rounded-md border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 min-w-[110px] rounded-md bg-[#65A30D] text-white text-sm font-semibold hover:bg-[#5a8f0c] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
