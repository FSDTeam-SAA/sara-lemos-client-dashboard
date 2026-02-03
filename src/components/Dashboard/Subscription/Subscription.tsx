"use client";

import {
  useGetAllSubscriptionPlans,
  useGetUserIdByUserData,
} from "@/lib/hooks/useSocialAccounts";
import { SubscriptionPlan, UserProfile } from "@/lib/types/user";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { AskForHelpModal } from "../Overview/AskForHelpModal";

export default function Subscription() {
  const { data: session } = useSession();
  const userId = (session?.user as { id: string })?.id;
  const { data: userResponse, isLoading: userLoading } =
    useGetUserIdByUserData(userId);

  const { data: plansResponse, isLoading: plansLoading } =
    useGetAllSubscriptionPlans();

  const userData: UserProfile = userResponse?.data;
  const currentPlan = userData?.subscriptionPlanId;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const reorderedPlans = useMemo(() => {
    if (!plansResponse?.data || !currentPlan)
      return (plansResponse?.data as SubscriptionPlan[]) || [];

    const allPlans = [...plansResponse.data] as SubscriptionPlan[];
    const currentIndex = allPlans.findIndex(
      (p: SubscriptionPlan) => p._id === currentPlan._id,
    );

    if (currentIndex === -1) return allPlans;

    // Remove the current plan from its position
    const [planToCenter] = allPlans.splice(currentIndex, 1);

    // Calculate the total number of items that will be displayed
    // (API plans excluding current + current + static Enterprise card)
    const totalItems = allPlans.length + 2; // +1 for the one we removed, +1 for static Custom
    const targetIndex = Math.floor(totalItems / 2);

    // Insert it at the target index (capped by remaining plans length)
    allPlans.splice(Math.min(targetIndex, allPlans.length), 0, planToCenter);

    return allPlans;
  }, [plansResponse, currentPlan]);

  if (userLoading || plansLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh] mt-20">
        <div className="animate-pulse space-y-4 w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[500px] bg-gray-100 rounded-[32px]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentPlan) {
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
          <Link
            href="/subscription"
            className="px-6 py-2.5 bg-[#65A30D] text-white font-semibold rounded-lg shadow-md hover:bg-[#578d0b] transition-all cursor-pointer"
          >
            View Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-transparent p-4 pb-20">
      {/* Header */}
      <div className="text-center mb-16 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#65A30D] mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-500 text-lg">
          Select the perfect plan for your yacht brokerage business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl items-stretch">
        {reorderedPlans.map((plan: SubscriptionPlan) => {
          const isCurrent = plan._id === currentPlan._id;

          return (
            <div
              key={plan._id}
              className={`relative flex flex-col bg-white rounded-[32px] p-8 transition-all duration-300 ${
                isCurrent
                  ? "border-[2.5px] border-[#65A30D] shadow-2xl md:scale-105"
                  : "border border-gray-100 shadow-lg hover:shadow-xl translate-y-2 opacity-95"
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#65A30D] text-white px-6 py-1.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg whitespace-nowrap">
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
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-500 text-sm min-h-[40px]">
                  {isCurrent
                    ? "Ideal for growing brokerages"
                    : "Perfect for independent brokers"}
                </p>

                <div className="mt-6 mb-1">
                  <span className="text-5xl font-extrabold text-[#65A30D]">
                    ${plan.price}
                  </span>
                </div>
                <p className="text-gray-400 text-sm font-medium mb-4">
                  Per {plan.billingCycle}
                </p>

                {plan.allowedListings && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#65A30D15] text-[#65A30D] rounded-full text-sm font-semibold border border-[#65A30D20]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                    </svg>
                    {plan.allowedListings} Listings Allowed
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-10 grow">
                {plan.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="shrink-0 text-[#65A30D] mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-600 text-[15px] leading-tight">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!isCurrent) {
                    window.open(
                      "https://saralemos1978-website.vercel.app/#pricing",
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }
                }}
                className={`w-full font-semibold py-4 rounded-2xl transition-all shadow-sm cursor-pointer ${
                  isCurrent
                    ? "bg-[#65A30D] hover:bg-[#54870b] text-white"
                    : "bg-[#D9E9C3] hover:bg-[#c9dbb0] text-[#65A30D]"
                }`}
              >
                {isCurrent ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          );
        })}

        {/* Static Custom Plan */}
        <div className="relative flex flex-col bg-white rounded-[32px] p-8 transition-all duration-300 border border-gray-100 shadow-lg hover:shadow-xl translate-y-2 opacity-95">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
              Enterprise
            </h2>
            <p className="text-gray-500 text-sm min-h-[40px]">
              For large organizations
            </p>

            <div className="mt-6 mb-1">
              <span className="text-5xl font-extrabold text-[#65A30D]">
                Custom
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-4">contact us</p>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#65A30D15] text-[#65A30D] rounded-full text-sm font-semibold border border-[#65A30D20]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              Unlimited Listings
            </div>
          </div>

          <div className="space-y-4 mb-10 grow">
            {[
              "Unlimited listings",
              "White-label solution",
              "Dedicated account manager",
              "Custom AI training",
              "Advanced security features",
              "SLA guarantee",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <div className="shrink-0 text-[#65A30D] mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-600 text-[15px] leading-tight">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full font-semibold py-4 rounded-2xl transition-all shadow-sm cursor-pointer bg-[#D9E9C3] hover:bg-[#c9dbb0] text-[#65A30D]"
          >
            Contact Sales
          </button>
        </div>
      </div>

      <AskForHelpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Contact Sales"
        subtitle="Talk to our sales experts about custom plans"
        defaultIssue="marketing"
        hideIssueField={true}
      />
    </div>
  );
}
