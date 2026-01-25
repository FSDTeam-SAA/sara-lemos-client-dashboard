"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AskForHelpModal } from "./AskForHelpModal";
import Link from "next/link";

export default function QuickActions() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg p-6">
        <div>
          <h2 className="text-2xl font-bold text-[#65A30D] mb-3">
            Quick Actions
          </h2>

          <div className="flex justify-between">
            <Link href="/listings">
              <div className="flex items-center gap-4 border border-[#CFE2B4] rounded-lg p-6 w-[420px]">
                <div className="bg-[#F0F6E7] p-3 rounded-full">
                  <Plus className="text-[#65A30D] size-6 font-bold" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0B3B36]">
                    Upload Listing
                  </h2>

                  <p className="text-sm text-[#0B3B36] my-2">
                    Add a new yacht listing
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/content-generator/create-ad">
              <div className="flex items-center gap-4 border border-[#CFE2B4] rounded-lg p-6 w-[420px]">
                <div className="bg-[#F0F6E7] p-3 rounded-full">
                  <Plus className="text-[#65A30D] size-6 font-bold" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0B3B36]">
                    Generate Content
                  </h2>

                  <p className="text-sm text-[#0B3B36] my-2">
                    Create AI-powered posts
                  </p>
                </div>
              </div>
            </Link>
            {/* <div className="flex items-center gap-4 border border-[#CFE2B4] rounded-lg p-6 w-[350px]">
              <div className="bg-[#F0F6E7] p-3 rounded-full">
                <Plus className="text-[#65A30D] size-6 font-bold" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0B3B36]">
                  Schedule Post
                </h2>

                <p className="text-sm text-[#0B3B36] my-2">
                  Plan your content calendar
                </p>
              </div>
            </div> */}
            <div
              className="flex items-center gap-4 border border-[#CFE2B4] rounded-lg p-6 w-[420px] cursor-pointer hover:border-[#65A30D] hover:bg-[#F0F6E7]/30 transition-all"
              onClick={() => setIsHelpModalOpen(true)}
            >
              <div className="bg-[#F0F6E7] p-3 rounded-full">
                <Plus className="text-[#65A30D] size-6 font-bold" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0B3B36]">
                  Ask For Help
                </h2>

                <p className="text-sm text-[#0B3B36] my-2">
                  Our yacht marketing experts are here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AskForHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </>
  );
}
