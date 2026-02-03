// src/lib/hooks/useSocialAccounts.ts

import { useQuery } from "@tanstack/react-query";
import {
  connectSocialAccounts,
  getAllSubscriptionPlans,
  getUserIdByUserData,
} from "../services/socialAccountsService";

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

// get user id by user data in social accounts
export function useGetUserIdByUserData(userId: string) {
  return useQuery({
    queryKey: ["userId", userId],
    queryFn: async () => {
      return getUserIdByUserData(userId);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

// Get all subscription plans
export function useGetAllSubscriptionPlans() {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      return getAllSubscriptionPlans();
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
