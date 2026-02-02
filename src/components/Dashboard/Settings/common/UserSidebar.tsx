"use client";

import { useGetProfile, useUploadAvatar } from "@/lib/hooks/profile";

import { Pencil } from "lucide-react";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { UserProfile } from "@/lib/types/profile";

const UserSidebar = () => {
  const { data: session } = useSession();
  const id = session?.user.id || "";
  const { data, isLoading } = useGetProfile(id);

  const profileData: Partial<UserProfile> = data?.data || {
    firstName: session?.user?.firstName || "User",
    lastName: session?.user?.lastName || "",
    email: session?.user?.email || "",
    phone: "",
    location: "",
    bio:'',
  };

  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && id) {
      const formData = new FormData();
      formData.append("profileImage", file);

      uploadAvatar({ data: formData });
    }
  };

  if (isLoading) {
    return (
      <aside className="w-full  max-w-sm">
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200 animate-pulse">
          <div className="h-24 bg-gray-200"></div>
          <div className="px-6 pb-6">
            <div className="flex justify-center -mt-16 mb-4">
              <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-lg"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto mb-6"></div>
            <div className="space-y-4 border-t border-gray-200 pt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-gray-100 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }
 console.log('bio',data)
  return (
    <aside className="w-full max-w-sm bg-white">
      <div className="bg-white rounded-lg overflow-hidden border h-full border-gray-200">
        {/* Header Background */}
        <div
          className="h-24 opacity-80"
          style={{
            background:
              "var(--GR, linear-gradient(180deg, #A3B18A 0%, #84D3B2 100%))",
          }}
        ></div>

        {/* Profile Section */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex justify-center -mt-16 mb-4 relative z-10">
            <div
              className="relative w-24 h-24 group cursor-pointer"
              onClick={handleAvatarClick}
            >
              <Image
                src={profileData?.profileImage || "/images/no.jpg"}
                alt={profileData?.firstName || "Profile"}
                fill
                className="rounded-full object-cover border-4 border-white shadow-lg"
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {/* Verified Badge / Edit Icon */}
              <div className="absolute bottom-0 right-0 bg-teal-600 rounded-full p-2 text-white hover:bg-teal-700 transition-colors">
                {isUploading ? (
                  <span className="animate-spin h-4 w-4 block border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Pencil className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <h2 className="text-center font-semibold text-gray-900 text-lg mb-1">
            {profileData.firstName} {profileData.lastName}
          </h2>
          {/* <p className="text-center text-gray-600 text-sm mb-6">Bio: {id}</p> */}

          {/* Info Items */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            {[
              {
                label: "Name:",
                value:
                  [profileData.firstName, profileData.lastName]
                    .filter(Boolean)
                    .join(" ") || "N/A",
              },
              {
                label:"Bio:",
                value:profileData.bio || "N/A"
              },
              {
                label: "Email:",
                value: profileData.email || "N/A",
              },
              {
                label: "Phone:",
                value: profileData.phone || profileData.phoneNumber || "N/A",
              },
              {
                label: "Location:",
                value:
                  [
                    profileData.address?.country || profileData.country,
                    profileData.address?.roadArea ||
                      profileData.address?.cityState ||
                      profileData.cityState,
                    profileData.street,
                  ]
                    .filter(Boolean)
                    .join(", ") || "N/A",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 flex-wrap">
                <p className="text-gray-700 font-medium text-sm min-w-[80px]">
                  {item.label}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
