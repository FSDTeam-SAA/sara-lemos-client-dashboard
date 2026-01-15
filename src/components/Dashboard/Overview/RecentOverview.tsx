"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function RecentOverview() {
  const recentOrders = [
    {
      invoice: "#12345",
      item: "Product Name",
      amount: "100 kg",
      price: "$500.00",
      status: "Paid",
    },
    {
      invoice: "#12345",
      item: "Product Name",
      amount: "100 kg",
      price: "$500.00",
      status: "Unpaid",
    },
    {
      invoice: "#12345",
      item: "Service Name",
      amount: "100 pieces",
      price: "$500.00",
      status: "Paid",
    },
    {
      invoice: "#12345",
      item: "Product Name",
      amount: "100 kg",
      price: "$500.00",
      status: "Paid",
    },
    {
      invoice: "#12345",
      item: "Service Name",
      amount: "100 pieces",
      price: "$500.00",
      status: "Unpaid",
    },
  ];

  const statusBadge = (status: string) => {
    const color =
      status === "Paid" || status === "In Stock"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
    return <Badge className={`${color} px-3 py-1 rounded-lg`}>{status}</Badge>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-5 w-full">
      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Recent Listings
          </CardTitle>
          <Link href={"/"} className="text-sm text-[#65A30D] cursor-pointer">
            {" "}
            View All{" "}
          </Link>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 text-left">INVOICE</th>
                <th className="py-2 text-left">Item</th>
                <th className="py-2 text-left">Product Amount</th>
                <th className="py-2 text-left">Total Price</th>
                <th className="py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((row, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-3">{row.invoice}</td>
                  <td>{row.item}</td>
                  <td>{row.amount}</td>
                  <td>{row.price}</td>
                  <td>{statusBadge(row.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
