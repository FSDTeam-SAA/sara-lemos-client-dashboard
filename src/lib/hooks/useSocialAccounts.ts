// src/lib/hooks/useSocialAccounts.ts

import { useQuery } from "@tanstack/react-query";
import { connectSocialAccounts } from "../services/socialAccountsService";

// Get Social Accounts
export function useGetSocialAccounts() {
  return useQuery({
    queryKey: ["social-accounts"],
    queryFn: async () => {
      return connectSocialAccounts();
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
