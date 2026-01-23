// src/lib/services/authService.ts
import axiosInstance from "../instance/axios-instance";

// Forgot Password
export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/forget-password", {
      email,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch {
    return {
      success: false,
      message: "Request failed",
    };
  }
};

// Verify OTP
export const verifyOtp = async (payload: { otp: string; email: string }) => {
  try {
    const response = await axiosInstance.post("/auth/verify-code", payload);

    return { success: true, data: response.data };
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as { response: { data: { message?: string } } }).response?.data
            ?.message
        : "Verification failed";

    return {
      success: false,
      message: errorMessage || "Verification failed",
    };
  }
};

// Resend Forgot OTP
export const resendForgotOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/forget-password", {
      email,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as { response: { data: { message?: string } } }).response?.data
            ?.message
        : "Failed to resend OTP";

    return {
      success: false,
      message: errorMessage || "Failed to resend OTP",
    };
  }
};

// Reset Password
export const resetPassword = async (payload: {
  newPassword: string;
  email: string;
}) => {
  try {
    console.log("🚀 Sending Reset Password Payload:", payload);
    const response = await axiosInstance.post("/auth/reset-password", payload);

    return { success: true, data: response.data };
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as { response: { data: { message?: string } } }).response?.data
            ?.message
        : "Reset password failed";

    return {
      success: false,
      message: errorMessage || "Reset password failed",
    };
  }
};
