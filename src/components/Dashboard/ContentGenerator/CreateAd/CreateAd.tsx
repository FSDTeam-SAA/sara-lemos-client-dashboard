"use client";

import { useGetUserIdByUserData } from "@/lib/hooks/useSocialAccounts";
import { useSession } from "next-auth/react";
import {
  Facebook,
  Layout,
  ChevronRight,
  Building2,
  Instagram,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Page {
  pageId: string;
  pageName: string;
  pageAccessToken: string;
  instagramBusinessId: string | null;
  tasks: string[];
}

interface FacebookBusiness {
  businessId: string;
  businessName: string;
  adAccounts: {
    id: string;
    account_id: string;
    name: string;
    currency: string;
  }[];
  pages: Page[];
}

export default function CreateAd() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: userData, isLoading } = useGetUserIdByUserData(
    userId as string,
  );

  const facebookBusinesses: FacebookBusiness[] =
    userData?.data?.facebookBusinesses || [];

  if (isLoading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500 py-10 px-6 max-w-7xl mx-auto">
        <div className="relative">
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-5 w-96 opacity-60" />
        </div>
        <div className="grid gap-12">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-6">
              <Skeleton className="h-7 w-56" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-44 rounded-3xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (facebookBusinesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-12 bg-linear-to-b from-gray-50/50 to-white rounded-[2.5rem] border border-gray-100 shadow-xs animate-in fade-in zoom-in duration-700 max-w-2xl mx-auto my-12">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#65A30D] blur-2xl opacity-10 rounded-full animate-pulse" />
          <div className="relative w-24 h-24 bg-white rounded-3xl shadow-xl border border-gray-50 flex items-center justify-center">
            <Facebook className="text-[#65A30D]" size={40} strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Connect Your Presence
        </h3>
        <p className="text-gray-500 max-w-sm mb-10 leading-relaxed">
          It looks like you haven&apos;t connected any Facebook Business
          accounts yet. Hook them up in settings to start launching campaigns.
        </p>
        <Link href="/social-accounts">
          <button className="inline-flex items-center gap-2 bg-[#65A30D] hover:bg-[#4d7c0b] text-white px-8 py-4 rounded-2xl font-semibold transition-all hover:shadow-lg hover:shadow-[#65A30D]/20 active:scale-95">
            Connect Social Accounts
            <ChevronRight size={18} />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Decorative Header Background */}
      <div className="absolute top-0 inset-x-0 h-64 bg-linear-to-b from-[#65A30D]/5 to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-6 pt-12 m">
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#65A30D]/10 border border-[#65A30D]/10 text-[#65A30D] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#65A30D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#65A30D]"></span>
            </span>
            Step 1: Select Channel
          </div>
          <h1 className="text-4xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
            Your <span className="text-[#65A30D]">Business</span> Pages
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Choose the business entity you want to represent for this campaign.
            We&apos;ll use this to optimize your ad targets and assets.
          </p>
        </header>

        <div className="space-y-20">
          {facebookBusinesses.map((business) => (
            <section
              key={business.businessId}
              className="relative group/section"
            >
              <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 group-hover/section:border-[#65A30D]/50 transition-colors">
                    <Building2 className="text-[#65A30D]" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-none mb-2">
                      {business.businessName}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        Business Entity
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {business.businessId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {business.pages.map((page) => (
                  <button
                    key={page.pageId}
                    className="group relative flex flex-col p-8 bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-4xl shadow-xs hover:shadow-2xl hover:shadow-[#65A30D]/10 hover:border-[#65A30D]/40 transition-all duration-500 text-left overflow-hidden cursor-pointer active:scale-[0.98]"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-radial-at-tr from-[#65A30D]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative flex items-center justify-between mb-8">
                      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-linear-to-br from-[#65A30D] to-[#84CC16] shadow-xl shadow-[#65A30D]/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <Layout className="text-white" size={28} />
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#65A30D] transition-colors duration-300">
                        <ChevronRight
                          size={18}
                          className="text-gray-400 group-hover:text-white transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="relative mt-auto">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#65A30D] transition-colors line-clamp-1 mb-1">
                        {page.pageName}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-[10px] font-medium font-mono uppercase tracking-widest leading-none">
                          ID: {page.pageId}
                        </span>
                      </div>
                    </div>

                    {page.instagramBusinessId && (
                      <div className="relative mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
                            <Instagram className="text-white" size={10} />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest transition-colors group-hover:text-pink-600">
                          IG Connected
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
