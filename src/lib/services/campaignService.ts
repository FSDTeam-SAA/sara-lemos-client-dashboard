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

export interface GenerateAdPayload {
  tone: string;
  postType: string;
  platforms: string[];
  contactInfo: string;
  keywords: string[];
  cta: string;
}

export interface GenerateAdResponse {
  facebook: {
    headline: string | null;
    primaryText: string | null;
    imagePrompt: string;
    imageUrl: string | null;
  };
  instagram: {
    caption: string;
    imagePrompt: string;
    imageUrl: string | null;
  };
  meta: {
    tone: string;
    postType: string;
    cta: string;
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

// genarate ad
export const generateAd = async (data: GenerateAdPayload) => {
  try {
    const response = await axiosInstance.post("/ai/generate-ad", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
