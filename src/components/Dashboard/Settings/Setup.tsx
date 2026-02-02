"use client";

import { Key, User } from "lucide-react";
import Link from "next/link";

export default function Setup() {
  return (
    <div className="mx-auto container p-6 space-y-4 ">
      {/* Profile */}
      <Link href="/settings/profile">
        <div className="flex items-center gap-3 rounded-lg hover:bg-[#FCFBF8] bg-white px-5 py-4 shadow-sm border border-gray-200 cursor-pointer">
          <User className="h-5 w-5 text-lime-600" />
          <span className="text-sm font-medium text-gray-800 text-[#1D1D1D]">
            Profile
          </span>
        </div>
      </Link>

      {/* Password */}
      <Link href="/settings/change-password">
        <div className="flex items-center gap-3 rounded-lg hover:bg-[#FCFBF8] bg-white px-5 py-4 shadow-sm border border-gray-200 cursor-pointer my-3">
          <Key className="h-5 w-5 text-lime-600" />
          <span className="text-sm font-medium text-gray-800">Password</span>
        </div>
      </Link>
    </div>
  );
}
