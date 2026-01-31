"use client";

import React, { useState } from "react";
import { useDeleteListing, useListing } from "@/lib/hooks/useListing";
import { type Listing } from "@/lib/services/listingService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import { ListingDetailModal } from "./ListingDetailModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Listings() {
  const { data, isLoading, error } = useListing();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutateAsync: deleteListing } = useDeleteListing();
  const router = useRouter();

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#65A30D]" />
          <p className="text-sm text-gray-500 animate-pulse">
            Loading listings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading listings</div>;
  }

  const listings: Listing[] = data?.listings || [];

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // delete listing
  const handleDeleteListing = (listingId: string) => {
    console.log(listingId);
    deleteListing(listingId);
    toast.success("Listing deleted successfully");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Yacht Listings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-3 text-left font-medium">Image</th>
                <th className="py-3 text-left font-medium">Yacht Name</th>
                <th className="py-3 text-left font-medium">Model</th>
                <th className="py-3 text-left font-medium">Type</th>
                <th className="py-3 text-left font-medium">Price</th>
                <th className="py-3 text-left font-medium">Location</th>
                <th className="py-3 text-left font-medium">Created</th>
                {/* <th className="py-3 text-left font-medium">Updated</th> */}
                <th className="py-3 text-left font-medium">Status</th>
                <th className="py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-4 text-center text-gray-500">
                    No listings found
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr
                    key={listing._id}
                    className="border-b last:border-none hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      {listing.images && listing.images.length > 0 ? (
                        <div className="h-12 w-16 relative overflow-hidden rounded-md border bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={listing.images[0]}
                            alt={listing.yachtName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="py-3 font-medium text-gray-900">
                      {listing.yachtName}
                    </td>
                    <td className="py-3">{listing.model}</td>
                    <td className="py-3">{listing.yachtType}</td>
                    <td className="py-3 font-medium">
                      {formatPrice(listing.Price)}
                    </td>
                    <td className="py-3">{listing.location}</td>
                    <td className="py-3 text-gray-500 text-xs">
                      {formatDate(listing.createdAt)}
                    </td>
                    {/* <td className="py-3 text-gray-500 text-xs">
                      {formatDate(listing.updatedAt)}
                    </td> */}
                    <td className="py-3">
                      <Badge
                        variant={listing.isActive ? "default" : "secondary"}
                        className={
                          listing.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      >
                        {listing.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => handleViewDetails(listing)}
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/content-generator")}
                        className="cursor-pointer"
                      >
                        <PencilLine className="w-4 h-4 text-[#65A30D]" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteListing(listing._id)}
                        className="cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      <ListingDetailModal
        isOpen={isModalOpen}
        listing={selectedListing}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
}
