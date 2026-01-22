"use client";
import React, { useState } from "react";
import {
  ShieldCheck,
  Facebook,
  Instagram,
  CheckCircle2,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { connectSocialAccounts } from "@/lib/services/socialAccountsService";

interface SocialData {
  pageName?: string;
  username?: string;
  type?: string;
  followers?: string;
  permissions?: string[];
}

interface SocialStatus {
  isConnected: boolean;
  isLoading: boolean;
  data: SocialData | null;
}

export default function SocialAccounts() {
  const [facebookStatus, setFacebookStatus] = useState<SocialStatus>({
    isConnected: false,
    isLoading: false,
    data: null,
  });

  const [instagramStatus, setInstagramStatus] = useState<SocialStatus>({
    isConnected: false,
    isLoading: false,
    data: null,
  });

  const handleConnectFacebook = async () => {
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      toast.error("Popup blocked! Please allow popups for this site.");
      return;
    }

    setFacebookStatus((prev) => ({ ...prev, isLoading: true }));

    try {
      const res = await connectSocialAccounts();
      const fbUrl = res?.data?.url;

      console.log("🚀 ~ handleConnectFacebook ~ fbUrl:", fbUrl);

      if (!fbUrl) {
        newWindow.close();
        throw new Error(
          res?.data?.message || "Facebook redirect URL not found",
        );
      }

      // ✅ Redirect the already opened tab
      newWindow.location.assign(fbUrl);
      setFacebookStatus((prev) => ({ ...prev, isLoading: false }));
    } catch (error: unknown) {
      if (newWindow) newWindow.close();
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response: { data: { message?: string } } }).response
              ?.data?.message
          : error instanceof Error
            ? error.message
            : "Failed to connect Facebook";

      toast.error(msg);
      setFacebookStatus((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDisconnectFacebook = () => {
    setFacebookStatus({ isConnected: false, isLoading: false, data: null });
  };

  const handleConnectInstagram = async () => {
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      toast.error("Popup blocked! Please allow popups for this site.");
      return;
    }

    setInstagramStatus((prev) => ({ ...prev, isLoading: true }));

    try {
      const res = await connectSocialAccounts();
      const igUrl = res?.data?.url;

      console.log("🚀 ~ handleConnectInstagram ~ igUrl:", igUrl);

      if (!igUrl) {
        newWindow.close();
        throw new Error(
          res?.data?.message || "Instagram redirect URL not found",
        );
      }

      // ✅ Redirect the already opened tab
      newWindow.location.assign(igUrl);
      setInstagramStatus((prev) => ({ ...prev, isLoading: false }));
    } catch (error: unknown) {
      if (newWindow) newWindow.close();
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response: { data: { message?: string } } }).response
              ?.data?.message
          : error instanceof Error
            ? error.message
            : "Failed to connect Instagram";

      toast.error(msg);
      setInstagramStatus((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDisconnectInstagram = () => {
    setInstagramStatus({ isConnected: false, isLoading: false, data: null });
  };

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 py-8">
      <div className="w-full   space-y-6">
        {/* ===== Header ===== */}
        <div>
          <h1 className="text-2xl font-semibold text-[#65A30D]">
            Social Media Accounts
          </h1>
          <p className="text-sm text-gray-600">
            Connect and manage your social media accounts
          </p>
        </div>

        {/* ===== Secure Connection ===== */}
        <div className="flex gap-3 rounded-xl border border-[#65A30D]/40 bg-[#F7FCEB] p-4">
          <div className="h-9 w-9 rounded-lg border border-[#65A30D]/30 bg-white flex items-center justify-center">
            <ShieldCheck className="text-[#65A30D]" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-[#65A30D]">Secure Connection</h3>
            <p className="text-sm text-gray-600 mt-1">
              We use OAuth 2.0 for secure authentication. We never store your
              passwords and only request minimum permissions.
            </p>
          </div>
        </div>

        {/* ===== Facebook Card ===== */}
        <div className="rounded-xl border border-[#65A30D]/40 p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Facebook className="text-[#1877F2]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#65A30D]">
                  Facebook
                </h2>
                <p className="text-sm text-gray-600">
                  Connect your Facebook page to publish yacht listings and
                  marketing content
                </p>
              </div>
            </div>

            {facebookStatus.isConnected && (
              <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                <CheckCircle2 size={14} />
                Connected
              </span>
            )}
          </div>

          {!facebookStatus.isConnected ? (
            <div className="pt-2">
              <button
                onClick={handleConnectFacebook}
                disabled={facebookStatus.isLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
              >
                <Link2 size={16} />
                {facebookStatus.isLoading
                  ? "Connecting..."
                  : "Connect Facebook"}
              </button>
            </div>
          ) : (
            /* Connected Page */
            <div className="rounded-xl border border-[#65A30D]/30 bg-[#FAFDF2] p-4 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">
                    {facebookStatus.data?.pageName || "YachtBroker Marketing"}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {facebookStatus.data?.type || "Page"} ·{" "}
                    {facebookStatus.data?.followers || "2.4k"} followers
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Connected{" "}
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <button
                  onClick={handleDisconnectFacebook}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  Disconnect
                </button>
              </div>

              {/* Permissions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(
                  facebookStatus.data?.permissions || [
                    "pages_manage_posts",
                    "pages_read_engagement",
                    "publish_to_groups",
                  ]
                ).map((item: string) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#65A30D]/40 bg-[#F7FCEB] px-3 py-1 text-xs text-[#65A30D]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== Instagram Card ===== */}
        <div className="rounded-xl border border-[#65A30D]/40 p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center">
                <Instagram className="text-pink-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#65A30D]">
                  Instagram
                </h2>
                <p className="text-sm text-gray-600">
                  Connect your Instagram business account to share yacht content
                </p>
              </div>
            </div>

            {instagramStatus.isConnected && (
              <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                <CheckCircle2 size={14} />
                Connected
              </span>
            )}
          </div>

          {!instagramStatus.isConnected ? (
            <div className="pt-2">
              <button
                onClick={handleConnectInstagram}
                disabled={instagramStatus.isLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#65A30D] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
              >
                <Link2 size={16} />
                {instagramStatus.isLoading
                  ? "Connecting..."
                  : "Connect Instagram"}
              </button>
              <p className="mt-2 text-xs text-gray-400">
                Requires a Facebook Business account and Instagram Business
                profile
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#65A30D]/30 bg-[#FAFDF2] p-4 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">
                    {instagramStatus.data?.username || "@yacht_broker_official"}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {instagramStatus.data?.type || "Business Account"} ·{" "}
                    {instagramStatus.data?.followers || "1.2k"} followers
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Connected{" "}
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <button
                  onClick={handleDisconnectInstagram}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== Help Box ===== */}
        <div className="rounded-xl border border-[#65A30D]/40 bg-[#F7FCEB] p-5 space-y-2">
          <h3 className="font-semibold text-[#65A30D]">Need Help?</h3>
          <p className="text-sm text-gray-600">
            <strong>Connection Issues:</strong> Make sure you&apos;re logged
            into the correct account and have admin access to your pages.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Permissions:</strong> You can revoke access anytime from
            Facebook or Instagram settings.
          </p>
        </div>
      </div>
    </div>
  );
}
