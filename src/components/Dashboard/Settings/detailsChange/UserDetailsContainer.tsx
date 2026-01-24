/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { toast } from "sonner";

import { useGetProfile, useUpdateProfile } from "@/lib/hooks/profile";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { PersonalInformationFormData, personalInformationSchema } from "../common/sschmas";
import UserDetailsPresenter from "./UserDetailsPresenter";


const UserDetailsContainer = () => {
  const { data: session } = useSession()
  const id=session?.user.id || ''
  const { data } = useGetProfile(id)
  const { mutate, isPending } = useUpdateProfile();
  const queryclient = useQueryClient();

  const profile = data?.data || session?.user;
  const form = useForm<PersonalInformationFormData>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      email: profile?.email ?? "",
      phoneNumber: profile?.phoneNumber || profile?.phone || "",
      bio: profile?.bio ?? "",
      country: profile?.country ?? "",
      cityState: profile?.cityState ?? "",
      roadArea: profile?.roadArea ?? "",
      postalCode: profile?.postalCode ?? "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        phoneNumber: profile.phoneNumber || profile.phone || "",
        bio: profile.bio ?? "",
        country: profile.address?.country || profile.country || "",
        cityState: profile.address?.cityState || profile.cityState || "",
        roadArea: profile.address?.roadArea || profile.roadArea || "",
        postalCode: profile.address?.postalCode || profile.postalCode || "",
      });
    }
  }, [profile, form]);

  const onSubmit = (data: PersonalInformationFormData) => {
    // Construct JSON payload matching the backend requirement
    const payload: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      bio: data.bio,
      address: {
        country: data.country,
        cityState: data.cityState,
        roadArea: data.roadArea,
        postalCode: data.postalCode,
      }
    };

    // Keep the logic for combining names if required (previous requirement)
    if (data.lastName && payload.firstName && !payload.firstName.includes(data.lastName)) {
       payload.firstName = `${data.firstName} ${data.lastName}`.trim();
       delete payload.lastName;
    }

    const userId = session?.user?.id || profile?.id || profile?._id;

    if (userId) {
      mutate({ data: payload, id: userId });
    } else {
      toast.error("User ID not found. Please try refreshing page.");
    }
  };

  const onError = (errors: any) => {
    console.log("Form Validation Errors:", errors);
    toast.error("Validation Error", {
      description: "Please check the form for errors.",
    });
  };

  return (
    <UserDetailsPresenter
      form={form}
      onSubmit={onSubmit}
      onError={onError}
      isLoading={isPending}
      profile={profile}
    />
  );
};

export default UserDetailsContainer;
