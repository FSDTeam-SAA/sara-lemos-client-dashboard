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

// get user id by user data in social accounts
export const getUserIdByUserData = async (userId: string) => {
  // console.log(userId);
  try {
    const response = await axiosInstance.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// get all subscription plans
export const getAllSubscriptionPlans = async () => {
  try {
    const response = await axiosInstance.get("/subscription/get-all");
    return response.data;
  } catch (error) {
    throw error;
  }
};
