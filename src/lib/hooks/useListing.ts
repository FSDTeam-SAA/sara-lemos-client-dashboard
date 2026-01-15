// src/lib/hooks/useListing.ts

import { useQuery } from "@tanstack/react-query";
import { getAllListing } from "../services/listingService";

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
