"use client";

import CardOverview from "./CardOverview";
import { Anchor, ChartLine, Clock4, TrendingUp, Zap } from "lucide-react";
import RecentOverview from "./RecentOverview";
import QuickActions from "./QuickActions";
import { useSession } from "next-auth/react";
import { useGetOverview } from "@/lib/hooks/useOverView";

export default function Overview() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id;

  const { data: overviewResponse, isLoading } = useGetOverview(userId);

  const overviewData = overviewResponse?.data;
  const counts = overviewData?.counts;
  const listings = overviewData?.listings || [];

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-gray-200 rounded-full mb-4" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 lg:space-y-8">
        {/* ✅ Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <CardOverview
            title="Total Listings"
            numberInfo={counts?.listings || 0}
            icon={<Anchor />}
          />

          <CardOverview
            title="Total Campaigns"
            numberInfo={counts?.campaigns || 0}
            icon={<Zap />}
          />

          <CardOverview
            title="Content Generated"
            numberInfo={counts?.contentGenerated || 0}
            icon={<Clock4 />}
          />

          <CardOverview
            title="Engagement Rate"
            numberInfo={`${counts?.engagementRate ?? 0}%`}
            icon={<TrendingUp />}
          />
        </div>

        {/* ✅ Quick Actions */}
        <QuickActions />

        {/* ✅ Recent Overview */}
        <RecentOverview listings={listings} />
      </div>
    </div>
  );
}
