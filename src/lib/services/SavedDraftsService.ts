// src/lib/services/SavedDraftsService.ts
import axiosInstance from "../instance/axios-instance";
import {
  FacebookPostResponse,
  SingleFacebookPostResponse,
} from "@/types/facebook";

// get saved drafts
export const getSavedDrafts = async (
  status: string,
): Promise<FacebookPostResponse> => {
  try {
    const url = `/facebookPost/?status=${status}`;
    const response = await axiosInstance.get<FacebookPostResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching saved drafts data:", error);
    throw error;
  }
};

// edit saved drafts
export const editSavedDrafts = async (
  id: string,
  data: FormData | Record<string, unknown>,
): Promise<FacebookPostResponse> => {
  try {
    const response = await axiosInstance.put<FacebookPostResponse>(
      `/facebookPost/${id}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error editing saved drafts data:", error);
    throw error;
  }
};

export const getSingleSavedDrafts = async (
  id: string,
): Promise<SingleFacebookPostResponse> => {
  try {
    const response = await axiosInstance.get<SingleFacebookPostResponse>(
      `/facebookPost/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching single saved drafts data:", error);
    throw error;
  }
};

// delete saved drafts
export const deleteSavedDrafts = async (
  id: string,
): Promise<FacebookPostResponse> => {
  try {
    const response = await axiosInstance.delete<FacebookPostResponse>(
      `/facebookPost/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting saved drafts data:", error);
    throw error;
  }
};
