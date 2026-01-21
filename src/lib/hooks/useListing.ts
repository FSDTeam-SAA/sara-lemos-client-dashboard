// src/lib/hooks/useListing.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllListing,
  ListingsResponse,
  uploadListingManual,
} from "../services/listingService";

export function useListing() {
  return useQuery({
    queryKey: ["listing"],
    queryFn: async () => {
      return getAllListing();
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

// Upload Listing Manual
export function useUploadListingManual() {
  return useMutation<ListingsResponse, Error, FormData>({
    mutationFn: (data) => uploadListingManual(data),
  });
}
