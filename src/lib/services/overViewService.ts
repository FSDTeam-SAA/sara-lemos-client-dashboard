// src/lib/services/overViewService.ts
import axiosInstance from "../instance/axios-instance";
import { AskForHelpData } from "../hooks/useOverView";

// Overview Data Types
export interface ListingItem {
  _id: string;
  yachtName: string;
  Price: number;
  isActive: boolean;
  createdAt: string;
}

export interface CampaignItem {
  _id: string;
  name: string;
  objective: string;
  status: string;
  createdAt: string;
}

export interface OverviewCounts {
  listings: number;
  campaigns: number;
  contentGenerated: number;
  engagementRate: number;
}

export interface OverviewData {
  listings: ListingItem[];
  campaigns: CampaignItem[];
  counts: OverviewCounts;
}

export interface OverviewResponse {
  status: boolean;
  message: string;
  data: OverviewData;
}

// Get Overview Data
export const getOverviewData = async (
  userId: string,
): Promise<OverviewResponse> => {
  const response = await axiosInstance.get(`/dashboard/client/${userId}`);
  return response.data;
};

// post Ask For Help
export const postAskForHelp = async (
  data: AskForHelpData,
): Promise<unknown> => {
  const response = await axiosInstance.post("/contact", data);
  return response.data;
};
