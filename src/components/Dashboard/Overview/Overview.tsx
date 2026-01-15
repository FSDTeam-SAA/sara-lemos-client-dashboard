import CardOverview from "./CardOverview";
import { Anchor, ChartLine, Clock4, TrendingUp } from "lucide-react";
import RecentOverview from "./RecentOverview";
import QuickActions from "./QuickActions";

export default function Overview() {
  return (
    <div className="p-5">
      <div className="space-y-8">
        <div className="stat-cards flex gap-4">
          <CardOverview
            title="Total Listings"
            numberInfo={100}
            icon={<Anchor />}
          />
          <CardOverview
            title="Content Generated"
            numberInfo={142}
            icon={<ChartLine />}
          />
          <CardOverview
            title="Time Saved"
            numberInfo={"47h"}
            icon={<Clock4 />}
          />
          <CardOverview
            title="Engagement Rate"
            numberInfo={"8.4%"}
            icon={<TrendingUp />}
          />
        </div>

        <div>
          <div className="col-span-8">
            <QuickActions />
          </div>
        </div>

        <div>
          <RecentOverview />
        </div>
      </div>
    </div>
  );
}
