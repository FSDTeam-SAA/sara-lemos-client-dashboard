import { z } from "zod"

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>


export const personalInformationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  cityState: z.string().optional(),
  roadArea: z.string().optional(),
  postalCode: z.string().optional(),

})

export type PersonalInformationFormData = z.infer<typeof personalInformationSchema>
