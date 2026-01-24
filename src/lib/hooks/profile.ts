/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { UserProfile } from "@/types/profile";
import { toast } from "sonner";
import {
  changePassword,
  getUserProfile,
  uploadUserAvatar,
  userProfileUpdate,
} from "../services/profileService";

export function useGetProfile(id: string) {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => getUserProfile(id),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["profile"],
    mutationFn: ({ data, id }: { data: any; id: string }) =>
      userProfileUpdate(data, id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(res?.message || "Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["upload-avatar"],
    mutationFn: ({ data }: { data: FormData }) => uploadUserAvatar(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(res?.message || "Avatar uploaded successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to upload avatar");
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationKey: ["password"],
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      changePassword(data),
    onSuccess: (res) => {
      toast.success(res?.message || "Password updated successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update password");
    },
  });
}
