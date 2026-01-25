"use client";

import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { useUploadListingManual } from "@/lib/hooks/useListing";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UploadListingDocument() {
  const { mutateAsync: uploadListingManual, isPending } =
    useUploadListingManual();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    const formData = new FormData();
    // FormData.append uses the original file object, preserving original name
    formData.append("pdf", selectedFile);
    try {
      const response = await uploadListingManual(formData);
      console.log("Upload successful:", response);

      // Show success toast
      toast.success("PDF extracted successfully! Redirecting to form...");

      // Store extracted data in sessionStorage for the manual form to pick up
      sessionStorage.setItem("pdfExtractedData", JSON.stringify(response));

      // Navigate to manual form
      setTimeout(() => {
        router.push("/upload-listing/upload-listing-manual");
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to extract PDF. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
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
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen px-6 py-6">
      {/* ===== Header ===== */}
      <div className="flex items-start gap-3 mb-6">
        <Link href="/upload-listing">
          <button className="mt-1 text-gray-500 hover:text-gray-700 transition cursor-pointer">
            <ArrowLeft size={18} />
          </button>
        </Link>

        <div>
          <h1 className="text-lg font-bold text-[#65A30D]">
            Upload Listing Document
          </h1>
          <p className="text-xs text-[#6C757D] mt-0.5">
            Upload a PDF or Word document containing yacht specifications
          </p>
        </div>
      </div>

      {/* ===== Upload Area Card ===== */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`transition-all duration-200 rounded-2xl border-2 border-dashed ${
          isDragging
            ? "border-[#65A30D] bg-[#65A30D0D]"
            : "border-gray-200 bg-white"
        } shadow-sm`}
      >
        <div className="px-6 py-10 md:px-12 md:py-14">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl ${isPending ? "bg-gray-100" : "bg-[#65A30D1A]"} flex items-center justify-center mb-5`}
            >
              {isPending ? (
                <div className="w-8 h-8 border-4 border-[#65A30D] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FileText className="text-[#65A30D]" size={28} />
              )}
            </div>

            {/* Text */}
            <h2 className="text-xl font-bold text-[#65A30D] mb-2">
              {isPending
                ? "Processing your file..."
                : file
                  ? file.name
                  : "Drop your file here"}
            </h2>
            <p className="text-xs text-[#6C757D] mb-6">
              {isPending
                ? "This may take a few moments"
                : file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                  : "or click to browse from your computer"}
            </p>

            {/* Hidden Input */}
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={isPending}
            />

            {/* Buttons */}
            <div className="flex gap-4">
              {!isPending && (
                <label
                  htmlFor="file-upload"
                  className="bg-[#65A30D] hover:bg-[#5a8f0c] text-white transition text-sm font-semibold px-8 py-2.5 rounded-lg cursor-pointer"
                >
                  {file ? "Change File" : "Select File"}
                </label>
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
    </div>
  );
}
