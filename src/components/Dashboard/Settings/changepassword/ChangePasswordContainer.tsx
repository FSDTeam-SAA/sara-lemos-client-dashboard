"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { toast } from "sonner";
import { useUpdatePassword } from "@/lib/hooks/profile";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "../common/sschmas";
import ChangePasswordPresenter from "./ChangePasswordPresenter";

const ChangePasswordContainer = () => {
  const { mutate, isPending } = useUpdatePassword();
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    mutate(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  return (
    <ChangePasswordPresenter
      form={form}
      onSubmit={onSubmit}
      isLoading={isPending}
    />
  );
};

export default ChangePasswordContainer;
