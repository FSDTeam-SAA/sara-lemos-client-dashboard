/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PersonalInformationFormData } from "../common/sschmas";
import { ProfileResponse } from "@/lib/types/profile";




interface PersonalInformationPresenterProps {
  form: UseFormReturn<PersonalInformationFormData>;
  onSubmit: (data: PersonalInformationFormData) => void;
  onError?: (errors: any) => void;
  isLoading?: boolean;
  profile?: ProfileResponse;
}

const UserDetailsPresenter = ({
  form,
  onSubmit,
  onError,
  isLoading = false,
  profile
}: PersonalInformationPresenterProps) => {
  const profileData=profile?.data;
  return (
    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Personal Information
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your personal information and profile details.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          {/* First and Last Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Olivia"
                      {...field}
                      className="border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rhye"
                      {...field}
                      className="border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bio Row */}
          <div className="grid grid-cols-1 gap-6">
             <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Bio
                  </FormLabel>
                   <FormControl>
                    <textarea
                      placeholder="Tell us about yourself"
                      {...field}
                       className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus:border-teal-600 focus:ring-teal-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email and Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                       type="email"
                      placeholder="bessieedwards@gmail.com"
                      {...field}
                      className="border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Phone Number"
                      {...field}
                      className="border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Location Details Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Bangladesh"
                      {...field}
                      className="border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="cityState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    City/State
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mohakhali"
                      {...field}
                      className="border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

           {/* Location Details Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="roadArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Road/Area
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="BRAC"
                      {...field}
                      className="border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Postal Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1211"
                      {...field}
                      className="border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              onClick={() => {
                // Reset form to original profile values
                if (profileData) {
                  form.reset({
                    firstName: profileData.firstName || "",
                    lastName: profileData.lastName || "",
                    country: profileData.address?.country || profileData.country || "",
                    cityState: profileData.address?.cityState || profileData.cityState || "",
                    postalCode: profileData.address?.postalCode || profileData.postalCode || "",
                    roadArea: profileData.address?.roadArea || profileData.roadArea || "",
                    phoneNumber: profileData.phoneNumber || profileData.phone || "",
                    bio: profileData.bio || "",
                    email: profileData.email || "",
                  });
                }
              }}
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#65A30D] cursor-pointer hover:bg-primary/90 text-white"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserDetailsPresenter;