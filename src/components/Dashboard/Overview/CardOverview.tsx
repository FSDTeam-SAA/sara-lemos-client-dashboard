import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CardOverviewProps {
  title: string;
  numberInfo: string | number;
  icon: ReactNode;
}

const CardOverview: React.FC<CardOverviewProps> = ({
  title,
  numberInfo,
  icon,
}) => {
  return (
    <Card className="w-full rounded-xl shadow-sm p-4 sm:p-5">
      <CardContent className="p-0">
        {/* Number + Icon */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#65A30D] leading-none">
            {numberInfo}
          </div>

          <div className="bg-[#F0F6E7] text-[#65A30D] rounded-full p-3 sm:p-4 shrink-0 flex items-center justify-center">
            <span className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-7 sm:[&>svg]:h-7">
              {icon}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-[#343A40] font-semibold text-base sm:text-lg lg:text-2xl">
          {title}
        </h3>
      </CardContent>
    </Card>
  );
};

export default CardOverview;
