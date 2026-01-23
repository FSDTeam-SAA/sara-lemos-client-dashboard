import { Upload } from "lucide-react";
import Link from "next/link";

export default function ContentGenerator() {
  return (
    <div className="flex justify-center items-center text-center">
      <Link href="/content-generator/create-ad">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-10 hover:bg-gray-50 text-center ">
          <div className="flex justify-center">
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center border rounded-xl bg-[#65A30D1A] mb-6">
              <Upload className="text-[#65A30D]" size={22} />
            </div>
          </div>
          {/* Title */}
          <h2 className="text-xl font-semibold text-[#65A30D] mb-3">
            Create Ad
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed max-w-3xl mb-10">
            Generate high-converting Facebook and Instagram ads using AI.
            Provide a few details about your listing and let our AI craft
            compelling ad copy and visuals.
          </p>
        </div>
      </Link>
    </div>
  );
}
