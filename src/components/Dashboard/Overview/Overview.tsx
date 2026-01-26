"use client";

import CardOverview from "./CardOverview";
import { Anchor, ChartLine, Clock4, TrendingUp } from "lucide-react";
import RecentOverview from "./RecentOverview";
import QuickActions from "./QuickActions";
import { useSession } from "next-auth/react";
import { useGetOverview } from "@/lib/hooks/useOverView";

export default function Overview() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id;
  const { data: overviewResponse, isLoading } = useGetOverview(userId);

  console.log("🚀 Overview Response:", overviewResponse);

  const overviewData = overviewResponse?.data;
  const counts = overviewData?.counts;
  const listings = overviewData?.listings || [];

  if (isLoading) {
    return (
      <div className="p-5 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="space-y-8">
        <div className="stat-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardOverview
            title="Total Listings"
            numberInfo={counts?.listings || 0}
            icon={<Anchor />}
          />
          {/* Using Campaign count as 'Content Generated' placeholder or actual campaigns */}
          <CardOverview
            title="Total Campaigns"
            numberInfo={counts?.campaigns || 0}
            icon={<ChartLine />}
          />
          <CardOverview
            title="Content Generated"
            numberInfo={counts?.contentGenerated || 0}
            icon={<Clock4 />}
          />
          <CardOverview
            title="Engagement Rate"
            // numberInfo={`${(counts?.engagementRate ? counts.engagementRate * 100 : 0).toFixed(0)}%`}
            numberInfo={`${counts?.engagementRate}%`}
            icon={<TrendingUp />}
          />
        </div>

        <div>
          {/* Quick Actions */}
          <div className="col-span-8">
            <QuickActions />
          </div>
        </div>

        <div>
          <RecentOverview listings={listings} />
        </div>
      </div>
    </div>
  );
}
