"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Handle Sign In
  const handleSignIn = async () => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      // If API returns "success: true"
      if (result?.ok) {
        const session = await getSession();
        if (session?.accessToken) {
          localStorage.setItem("accessToken", session.accessToken);
        }
        toast.success("Logged in successfully!");
        router.push("/");
      } else {
        toast.error(result?.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-4 sm:px-6 py-8 min-h-screen">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-24 -left-24 w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #0B3B36, transparent)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #1a6b62, transparent)" }}
        />
      </div>

      {/* Card */}
      <div
        className="w-full max-w-[440px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(11,59,54,0.1)",
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, #0B3B36, #1a6b62, #0B3B36)" }}
        />

        <div className="px-6 sm:px-10 py-8 sm:py-10">
          {/* Brand / Logo area */}
          <div className="flex flex-col items-center text-center mb-7 sm:mb-8">
            {/* Shield icon badge */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style={{ background: "linear-gradient(135deg, #0B3B36, #1a6b62)" }}
            >
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>

            <h1
              className="text-2xl sm:text-3xl font-bold leading-tight"
              style={{ color: "#0B3B36" }}
            >
              Welcome Back!
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm sm:text-[15px] leading-relaxed max-w-xs">
              Sign in to manage your microsite and account.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 sm:space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  type="email"
                  placeholder="hello@example.com"
                  className="pl-9 py-5 text-sm rounded-xl border-gray-200 focus:border-[#0B3B36] focus:ring-[#0B3B36]/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10 py-5 text-sm rounded-xl border-gray-200 focus:border-[#0B3B36] focus:ring-[#0B3B36]/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-0.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="border-gray-300" />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>

              <Link
                href="/forget-password"
                className="text-sm font-medium text-[#0B3B36] hover:text-[#1a6b62] hover:underline underline-offset-2 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              className="w-full py-5 sm:py-6 text-sm sm:text-[15px] font-semibold rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer mt-1"
              style={{
                background: isLoading
                  ? "#4a8a84"
                  : "linear-gradient(135deg, #0B3B36, #1a6b62)",
              }}
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Sign Up link */}
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="https://limepitch.com/register"
                className="font-semibold text-[#0B3B36] hover:text-[#1a6b62] hover:underline underline-offset-2 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom footer strip */}
        <div className="px-6 sm:px-10 py-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
}
