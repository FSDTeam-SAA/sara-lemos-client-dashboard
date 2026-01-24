// src/lib/services/campaignService.ts
import axiosInstance from "../instance/axios-instance";

export interface CreateCampaignPayload {
  adAccountId: string | null;
  pageId: string | null;
  name: string;
  objective: string;
}

export interface Campaign {
  _id: string;
  name: string;
  [key: string]: unknown; // Allow other properties from the API
}

export interface GetAllCampaignResponse {
  pageId: string;
  pageName: string;
  campaigns: Campaign[];
}

export interface CreateAdSetPayload {
  campaignId: string;
  adAccountId: string | null;
  pageId: string | null;
  name: string;
  dailyBudget: number;
  startDate: string;
  endDate: string | null;
  targeting: {
    locations: string[];
    ageMin: number;
    ageMax: number;
    gender: number | null;
  };
}

// Create Campaign
export const createCampaign = async (data: CreateCampaignPayload) => {
  try {
    const response = await axiosInstance.post("/final/create-campaign", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// get all campaign
export const getAllCampaign = async (
  userId: string,
  pageId: string,
): Promise<GetAllCampaignResponse> => {
  try {
    const response = await axiosInstance.get(
      `/final/get?userId=${userId}&pageId=${pageId}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// create ad set
export const createAdSet = async (data: CreateAdSetPayload) => {
  try {
    const response = await axiosInstance.post("/final/create-adSet", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
