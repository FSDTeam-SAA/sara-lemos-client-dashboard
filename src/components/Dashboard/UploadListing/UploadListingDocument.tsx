"use client";

import { ArrowLeft, FileText, X, Sparkles } from "lucide-react";
import Link from "next/link";
// import { useUploadListingManual } from "@/lib/hooks/useListing";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { ExtractedYachtData } from "@/lib/types/listing";

export default function UploadListingDocument() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [partialData, setPartialData] = useState<Partial<ExtractedYachtData> | null>(null);

  const handleGenerate = async () => {
    if (!file) return;

    setIsExtracting(true);
    setProgressMessage("Starting extraction...");
    setPartialData(null);

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

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // SSE format is "event: name\ndata: json\n\n"
        const lines = chunk.split("\n");

        let currentEvent = "";

        lines.forEach((line) => {
          if (line.startsWith("event: ")) {
            currentEvent = line.replace("event: ", "").trim();
          } else if (line.startsWith("data: ")) {
            try {
              interface StreamData {
                message?: string;
                partialData?: Partial<ExtractedYachtData>;
                listing?: { _id: string };
              }
              const data = JSON.parse(line.replace("data: ", "").trim()) as StreamData;

              if (currentEvent === "status") {
                setProgressMessage(data.message || "Processing...");
              } else if (currentEvent === "chunk") {
                if (data.partialData) {
                  setPartialData(data.partialData);
                  toast.info("Updating data fields...", { duration: 1000 });
                }
              } else if (currentEvent === "final") {
                toast.success("Extraction complete! Redirecting...");
                // Store extracted data if needed, but tutorial says it auto-saves
                // Redirect to edit page using data.listing._id
                if (data.listing && data.listing._id) {
                  router.push(`/listings/edit/${data.listing._id}`);
                } else {
                  // Fallback to manual form if no listing ID
                  sessionStorage.setItem(
                    "pdfExtractedData",
                    JSON.stringify(data),
                  );
                  router.push("/upload-listing/upload-listing-manual");
                }
              } else if (currentEvent === "error") {
                toast.error(data.message || "An error occurred during extraction");
                setIsExtracting(false);
              }
            } catch (e) {
              console.error("Error parsing stream data:", e);
            }
          }
        });
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
    // Reset file input
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
                    className="bg-[#65A30D] hover:bg-[#5a8f0c] text-white transition text-sm font-semibold px-8 py-2.5 rounded-lg cursor-pointer text-center"
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
    </div>
  );
}
