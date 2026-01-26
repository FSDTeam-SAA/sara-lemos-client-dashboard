export interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  billingCycle: string;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: "admin" | "manager" | "user" | "USER"; // "USER" from API response
  isVerified: boolean;
  createdAt?: string; // Optional as not in provided sample but good to have
  updatedAt?: string; // Optional as not in provided sample but good to have
  phoneNumber?: string | null;
  profilePhoto?: string;
  companyName?: string;
  jobTitle?: string;
  subscriptionPlanId?: SubscriptionPlan; // populated field
  hasActiveSubscription?: boolean;
  subscriptionExpireDate?: string;
  // Add other fields as necessary from the large JSON if needed, keeping it minimal for now
}

export interface UserProfileResponse {
  status: boolean; // Changed from success to match API sample
  message: string;
  data: UserProfile;
}
