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

export interface GenerateContentResponse {
  success: boolean;
  data: string;
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
