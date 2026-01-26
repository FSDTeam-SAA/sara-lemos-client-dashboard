"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ListingItem } from "@/lib/services/overViewService";

interface RecentOverviewProps {
  listings: ListingItem[];
}

export default function RecentOverview({ listings = [] }: RecentOverviewProps) {
  const statusBadge = (isActive: boolean) => {
    const color = isActive
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
    return (
      <Badge className={`${color} px-3 py-1 rounded-lg`}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-5 w-full">
      {/* Recent Listings */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Recent Listings
          </CardTitle>
          <Link
            href={"/dashboard/listings"}
            className="text-sm text-[#65A30D] cursor-pointer hover:underline"
          >
            View All
          </Link>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 text-left">Yacht Name</th>
                  <th className="py-2 text-left">Price</th>
                  <th className="py-2 text-left">Created At</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {listings.length > 0 ? (
                  listings.slice(0, 5).map((row) => (
                    <tr key={row._id} className="border-b last:border-none">
                      <td className="py-3 font-medium">{row.yachtName}</td>
                      <td className="text-gray-600">
                        {formatCurrency(row.Price)}
                      </td>
                      <td className="text-gray-600">
                        {formatDate(row.createdAt)}
                      </td>
                      <td>{statusBadge(row.isActive)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No recent listings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
