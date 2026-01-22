// src/lib/hooks/useAuth.ts

// src/lib/hooks/useAuth.ts
"use client";

import { useState } from "react";
import {
  forgotPassword,
  resendForgotOtp,
  resetPassword,
  verifyOtp,
} from "../services/authService";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    const res = await forgotPassword(email);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

  // Handle OTP verification
  const handleVerifyOtp = async (otp: string, email: string) => {
    setLoading(true);
    setError(null);

    const res = await verifyOtp({ otp, email });

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

  //  NEW — Resend OTP
  const handleResendOtp = async (email: string) => {
    setLoading(true);
    setError(null);

    const res = await resendForgotOtp(email);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

  // Reset Password hook
  const handleResetPassword = async (newPassword: string, email: string) => {
    setLoading(true);
    setError(null);

    const res = await resetPassword({ newPassword, email });

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

  return {
    loading,
    result,
    error,
    handleVerifyOtp,
    handleForgotPassword,
    handleResendOtp,
    handleResetPassword,
  };
}
