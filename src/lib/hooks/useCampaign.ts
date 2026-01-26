// src/lib/hooks/useCampaign.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAdSet,
  createCampaign,
  CreateCampaignPayload,
  CreateAdSetPayload,
  getAllCampaign,
  generateAd,
  GenerateAdPayload,
} from "../services/campaignService";

// Create Campaign
export function useCreateCampaign() {
  return useMutation({
    mutationFn: (data: CreateCampaignPayload) => createCampaign(data),
  });
}

// Get All Campaign
export function useGetAllCampaign(userId: string, pageId: string) {
  return useQuery({
    queryKey: ["campaigns", userId, pageId],
    queryFn: () => getAllCampaign(userId, pageId),
    enabled: !!userId && !!pageId, // Only fetch when both params are available
  });
}

// create ad set
export function useCreateAdSet() {
  return useMutation({
    mutationFn: (data: CreateAdSetPayload) => createAdSet(data),
  });
}

// generate ad
export function useGenerateAd() {
  return useMutation({
    mutationFn: (data: GenerateAdPayload) => generateAd(data),
  });
}
