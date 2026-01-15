"use client";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import useAuth from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { handleResetPassword, loading } = useAuth();
  const router = useRouter();

  // Handle Save
  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const res = await handleResetPassword(newPassword);
    if (res.success) {
      toast.success("Password reset successfully!");
      router.push("/login");
    } else {
      toast.error(res.message || "Something went wrong!");
    }
  };

  return (
    <div className="mx-auto container w-[500px]">
      <div className="bg-white rounded-2xl shadow-md p-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-[#0B3B36] mb-2">
            Create a New Password
          </h2>
          <p className="text-[#343A40] mb-6">
            Enter your email to recover your password
          </p>
        </div>

        {/* New Password */}
        <label className="block text-[#343A40] font-medium mb-1">
          New Password
        </label>
        <div className="relative mb-5">
          <input
            type={showPassword1 ? "text" : "password"}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-gray-500"
            placeholder="********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword1(!showPassword1)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword1 ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <label className="block text-[#343A40] font-medium mb-1">
          Confirm New Password
        </label>
        <div className="relative mb-8">
          <input
            type={showPassword2 ? "text" : "password"}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-gray-500"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword2(!showPassword2)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Save Button */}
        <Button
          className={`w-full bg-[#0B3B36] text-white py-6 rounded-md text-lg font-medium hover:bg-[#0B3B36] transition flex justify-center items-center gap-2 cursor-pointer ${
            loading ? "cursor-not-allowed opacity-70" : ""
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          {loading && <LoaderCircle />}
          {loading ? "Saving..." : "Change Password"}
        </Button>
      </div>
    </div>
  );
}
