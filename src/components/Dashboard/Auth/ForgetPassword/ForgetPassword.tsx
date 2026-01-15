"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/lib/hooks/useAuth";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");

  const router = useRouter();

  const { loading, handleForgotPassword } = useAuth();

  const handleSendCode = async () => {
    const response = await handleForgotPassword(email);

    if (response.success && response.data?.data?.accessToken) {
      // Get the accessToken
      const accessToken = response.data.data.accessToken;
      router.push(`/verify-otp?token=${encodeURIComponent(accessToken)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f6] p-4">
      {" "}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg px-8 py-10">
        {" "}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0B3B36]">
            Reset Your Password{" "}
          </h1>
          <p className="text-[#343A40] mt-1 text-sm">
            Enter your email address and we’ll send you a code to reset your
            password.{" "}
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <Label>Email Address</Label>

            <Input
              type="email"
              className="mt-1 py-5"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-[#0B3B36] hover:bg-[#0B3B36] mt-4 text-white cursor-pointer"
            onClick={handleSendCode}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Code"}
          </Button>
        </div>
      </div>
    </div>
  );
}
