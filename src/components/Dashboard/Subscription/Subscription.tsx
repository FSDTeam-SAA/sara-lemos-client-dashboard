"use client";
import { useGetUserIdByUserData } from "@/lib/hooks/useSocialAccounts";
import { useSession } from "next-auth/react";
import React from "react";

export default function Subscription() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id;
  const { data: userResponse, isLoading } = useGetUserIdByUserData(
    userId as string,
  );

  const userData = userResponse?.data;
  const plan = userData?.subscriptionPlanId;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="max-w-xl text-center space-y-4 bg-white p-10 rounded-2xl border border-gray-100 shadow-xs">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            No Active Subscription
          </h2>
          <p className="text-gray-600">
            You currently do not have an active subscription plan. Upgrade now
            to unlock premium features.
          </p>
          <button className="px-6 py-2.5 bg-[#65A30D] text-white font-semibold rounded-lg shadow-md hover:bg-[#578d0b] transition-all cursor-pointer">
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-transparent p-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B3B36] mb-2">
          Your Current Subscription
        </h1>
        <p className="text-gray-500">Manage your billing and plan details</p>
      </div>
      <div className="relative w-full max-w-sm bg-[#F9F9F7]  rounded-4xl border-2 border-[#65A30D] p-8 shadow-xl">
        {/* Most Popular Badge */}
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#65A30D] text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2 shadow-md whitespace-nowrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6.97 14.12a5.626 5.626 0 01-1.632-.611l-.733 2.565a.75.75 0 001.441.413l.733-1.564a.75.75 0 01.191.197l.197.191-1.564.733a.75.75 0 00.413 1.441l2.565-.733a5.626 5.626 0 01-.611-1.632zM12 17.25a.75.75 0 01.75-.75 4.5 4.5 0 002.66-1.072l1.63 1.631a.75.75 0 11-1.06 1.06l-1.631-1.63A4.5 4.5 0 0012.75 18a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          Most Popular
        </div>

        {/* Header content */}
        <div className="text-center mt-4 mb-6">
          <h2 className="text-2xl font-bold text-[#333] mb-1">{plan.name}</h2>
          <p className="text-gray-500 text-sm">Ideal for growing brokerages</p>

          <div className="mt-6 mb-2">
            <span className="text-5xl font-bold text-[#65A30D]">
              ${plan.price}
            </span>
          </div>
          <p className="text-gray-500 text-sm">Per {plan.billingCycle}</p>
        </div>

        {/* Features List */}
        <div className="space-y-4 mb-8">
          {plan.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div className="shrink-0 text-[#65A30D]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <span className="text-gray-600 text-[15px]">{feature}</span>
            </div>
          ))}
        </div>

        {/* Button */}
        <button className="w-full bg-[#65A30D] hover:bg-[#54870b] text-white font-medium py-3.5 rounded-2xl transition-all shadow-sm cursor-pointer">
          Current Plan
        </button>
      </div>
    </div>
  );
}
