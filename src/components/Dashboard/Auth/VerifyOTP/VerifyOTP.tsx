"use client";

import { useEffect, useState } from "react";
import useAuth from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const router = useRouter();

  const { handleVerifyOtp, handleResendOtp, loading } = useAuth();

  //  Timer
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // canResend value is derived from timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // derive canResend using another effect
  useEffect(() => {
    setCanResend(timer === 0);
  }, [timer]);

  // Input handler
  const handleChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5)
      document.getElementById(`otp-${index + 1}`)?.focus();
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpCode = otp.join("");

    const res = await handleVerifyOtp(otpCode);

    if (res?.success) {
      toast.success("OTP verified successfully!");

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      setTimeout(() => {
        router.push(`/reset-password?token=${encodeURIComponent(token || "")}`);
      }, 1000);
    } else {
      toast.error(res?.message || "Failed to verify OTP");
    }
  };

  //  Resend OTP
  const handleResend = async () => {
    if (!canResend) return;

    const res = await handleResendOtp();

    if (res?.success) {
      toast.success("OTP sent again successfully ✔");
    } else {
      toast.error("Failed to resend OTP");
    }

    setTimer(30);
    setCanResend(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6]">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-md p-10">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-[#0B3B36] mb-4">
            Verify Your Account
          </h2>
          <p className="text-[#343A40] mb-6">
            Enter the 6-digit code sent to your email to continue.
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex items-center gap-3 justify-center mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className={`w-14 h-14 text-2xl text-center border rounded-lg outline-none transition
                ${
                  digit
                    ? "border-red-600 text-red-600"
                    : "border-gray-300 text-gray-700"
                }`}
            />
          ))}
        </div>

        {/* Timer + Resend */}
        <div className="flex justify-between items-center text-sm text-[#343A40] mb-6">
          <div className="flex items-center gap-2">
            <span>⏱</span>
            <span>{String(timer).padStart(2, "0")} Second</span>
          </div>

          <div className="items-end">
            <span className="text-[#343A40] text-md mr-2 mb-1">
              Didn’t get a code?
            </span>

            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`font-medium ${
                canResend
                  ? "text-[#0B3B36] hover:underline cursor-pointer"
                  : "text-[#343A40] cursor-not-allowed"
              }`}
            >
              Resend
            </button>
          </div>
        </div>

        <button
          className={`w-full bg-[#0B3B36] text-white py-3 rounded-md text-lg font-medium transition
    ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0B3B36] cursor-pointer"}
  `}
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
