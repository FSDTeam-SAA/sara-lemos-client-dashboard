// src/lib/services/socialAccountsService.ts
import axiosInstance from "../instance/axios-instance";

// Social Accounts Connect
export const connectSocialAccounts = async () => {
  try {
    const response = await axiosInstance.get("/connect/connect-user");
    return response.data.url;
  } catch (error) {
    throw error;
  }
};
