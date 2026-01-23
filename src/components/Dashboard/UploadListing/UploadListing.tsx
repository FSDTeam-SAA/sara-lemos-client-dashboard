"use client";

import { Upload } from "lucide-react";
import Link from "next/link";

export default function UploadListing() {
  return (
    <div className="flex px-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6  w-full  h-[250px] ">
        <Link href="/upload-listing/upload-listing-document">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-10 hover:bg-gray-50 ">
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#65A30D1A] mb-6">
              <Upload className="text-[#65A30D]" size={22} />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-[#65A30D] mb-3">
              Upload Document
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed max-w-3xl mb-10">
              Upload a PDF or Word document with yacht specifications. Our AI
              will automatically extract all the details.
            </p>

            {/* Badges */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-[#65A30D]">
                Recommended
              </span>
              <span className="text-sm font-medium text-[#65A30D] bg-[#65A30D1A] px-4 py-1.5 rounded-lg">
                AI-Powered
              </span>
            </div>
          </div>
        </Link>

        {/* ===== Manual Entry Card ===== */}
        <Link href="/upload-listing/upload-listing-manual">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-10   hover:bg-gray-50">
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#65A30D1A] mb-6">
              <Upload className="text-[#65A30D]" size={22} />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-[#65A30D] mb-3">
              Manual Entry
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed max-w-3xl mb-10">
              Fill out the yacht listing form manually with all the
              specifications and details.
            </p>

            {/* Badges */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-[#65A30D]">
                Traditional methodd
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
