"use client";

import { useState } from "react";
import { Clock, PhoneCall, Plus, Zap } from "lucide-react";
import { AskForHelpModal } from "./AskForHelpModal";
import Link from "next/link";

export default function QuickActions() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const cardBase =
    "group flex h-full w-full items-start gap-4 rounded-xl border border-[#CFE2B4] bg-white p-5 sm:p-6 transition-all " +
    "hover:border-[#65A30D] hover:bg-[#F0F6E7]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#65A30D]/50";

  const iconWrap =
    "shrink-0 rounded-full bg-[#F0F6E7] p-3 transition-transform group-hover:scale-[1.03]";

  const title =
    "text-lg sm:text-xl lg:text-2xl font-bold text-[#0B3B36] leading-snug";

  const desc = "mt-1 text-xs sm:text-sm text-[#0B3B36]/80";

  return (
    <>
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#65A30D] mb-4">
          Quick Actions
        </h2>

        {/* ✅ Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* ✅ Card 1 */}
          <Link href="/listings" className="block h-full">
            <div className={cardBase}>
              <div className={iconWrap}>
                <Plus className="text-[#65A30D] size-5 sm:size-6" />
              </div>

              <div className="min-w-0">
                <h3 className={title}>Upload Listing</h3>
                <p className={desc}>Add a new yacht listing</p>
              </div>
            </div>
          </Link>

          {/* ✅ Card 2 */}
          <Link href="/content-generator/create-ad" className="block h-full">
            <div className={cardBase}>
              <div className="shrink-0 rounded-full bg-[#3B82F61A] p-3 transition-transform group-hover:scale-[1.03]">
                <Zap className="text-[#3B82F6] size-5 sm:size-6" />
              </div>

              <div className="min-w-0">
                <h3 className={title}>Generate Content</h3>
                <p className={desc}>Create AI-powered posts</p>
              </div>
            </div>
          </Link>

          {/* ✅ Card 3 */}
          <button
            type="button"
            className={`${cardBase} text-left cursor-pointer`}
            onClick={() => setIsHelpModalOpen(true)}
          >
            <div className="bg-[#610BF51A] rounded-xl p-3 sm:p-4 shrink-0 flex items-center justify-center">
              <PhoneCall className="text-[#610BF5] size-5 sm:size-6" />
            </div>

            <div className="min-w-0">
              <h3 className={title}>Ask For Help</h3>
              <p className={desc}>Our yacht marketing experts are here</p>
            </div>
          </button>
        </div>
      </div>

      <AskForHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </>
  );
}
