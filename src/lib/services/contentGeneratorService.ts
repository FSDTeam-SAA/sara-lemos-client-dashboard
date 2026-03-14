// src/lib/services/contentGeneratorService.ts

import axiosInstance from "../instance/axios-instance";

export interface GenerateContentPayload {
  tone: string;
  postType: string;
  platforms: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

export interface FacebookContent {
  message: string;
  imagePrompt: string;
  imageUrl: string | null;
}

export interface InstagramContent {
  message: string;
  imagePrompt: string;
  imageUrl: string | null;
}

export interface MetaContent {
  tone: string;
  postType: string;
  cta: string;
}

export interface GenerateContentResponse {
  success: boolean;
  data: {
    facebook: FacebookContent;
    instagram: InstagramContent;
    meta: MetaContent;
  };
  message?: string;
}

// Generate Content
export const generateContent = async (
  data: GenerateContentPayload,
): Promise<GenerateContentResponse> => {
  const response = await axiosInstance.post<GenerateContentResponse>(
    "/ai/generate-ad",
    data,
  );
  return response.data;
};

export interface FinalizeFacebookPostPayload {
  status: string;
  pageId: string;
  postType: string;
  content: {
    message: string;
    hashtags: string[];
  };
  platforms: string[];
  mediaUrls: string[];
  scheduledTime?: string;
}

export const finalizeFacebookPost = async (
  data: FinalizeFacebookPostPayload,
) => {
  const response = await axiosInstance.post("/facebookPost/finalize", data);
  return response.data;
};
