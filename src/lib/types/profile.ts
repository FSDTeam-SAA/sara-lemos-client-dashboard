/* eslint-disable @typescript-eslint/no-explicit-any */
// ============ CORE INTERFACES ============

// Cloudinary image interface (for your existing UserProfile)
export interface CloudinaryImage {
  public_id: string;
  url: string;
}

// Base address interface
export interface UserAddress {
  country: string;
  cityState: string;
  roadArea: string;
  postalCode: string;
  taxId: string;
}

// Social links interface
export interface SocialLinks {
  linkedin: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
}

// Main User interface based on YOUR API response
export interface User {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dob: string | null;
  gender: string;
  adAccountId: string | null;
  pageAccessToken: string | null;
  instagramAccountId: string | null;
  facebookConnectedAt: string | null;
  jobTitle: string;
  companyName: string;
  websiteUrl: string;
  industryExperience: string;
  languagesSpoken: string[];
  profileImage: string;
  multiProfileImage: any[];
  pdfFile: string;
  profilePhoto: string;
  companyLogo: string;
  bannerImage: string;
  socialLinks: SocialLinks;
  preferredToneOfVoice: string[];
  postingFrequency: string;
  yachtTypesHandled: string[];
  averagePriceRange: string | null;
  primaryRegionsServed: string[];
  listingPlatformsUsed: string[];
  customHeadline: string;
  portfolioPageSlug: string;
  qrCodeUrl: string;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  isActive: boolean;
  stripeAccountId: string | null;
  bio: string;
  address: UserAddress;
  otp: string | null;
  otpExpires: string | null;
  otpVerified: boolean;
  resetExpires: string | null;
  refreshToken: string;
  hasActiveSubscription: boolean;
  subscriptionExpireDate: string | null;
  blockedUsers: string[];
  language: string;
  facebookPages: any[];
  facebookBusinesses: any[];
}

// ============ API RESPONSE INTERFACES ============

// Generic API response wrapper
export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
}

// For single user response (your new example)
export type SingleUserResponse = ApiResponse<User>;

// For paginated users response (your first example)
export interface UsersData {
  users: User[];
  paginationInfo: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type UsersListResponse = ApiResponse<UsersData>;

// ============ YOUR EXISTING UserProfile INTERFACE (Alternative/legacy) ============

// Your existing UserProfile interface - different structure!
export interface UserProfile {
  _id: string;
  createdAt: string;
  updatedAt: string;
  dateOfBirth: string | null;
  email: string;
  firstName: string;
  lastName: string;
  image: CloudinaryImage;
  isSuspended: boolean;
  isVerified: boolean;
  location: string;
  phone: string;
  profileImage: string;
  address?: UserAddress;
  phoneNumber?: string;
  postalCode: string;
  role: string;
  street: string;
  bio?: string;
  country?: string;
  cityState?: string;
  roadArea?: string;
  gender?: "male" | "female" | "other";
}

export interface ProfileResponse {
  data: UserProfile;
  message: string;
  statusCode: number;
  success: boolean;
}

// ============ HELPER TYPES & UTILITIES ============

// Type guard to check if response is a single user
export function isSingleUserResponse(
  response: any,
): response is SingleUserResponse {
  return (
    response?.data?._id !== undefined &&
    Array.isArray(response?.data?.users) === false
  );
}

// Type guard to check if response is a users list
export function isUsersListResponse(
  response: any,
): response is UsersListResponse {
  return (
    Array.isArray(response?.data?.users) &&
    response?.data?.paginationInfo !== undefined
  );
}

// Convert User to UserProfile if you need to map between them
export function mapUserToUserProfile(user: User): UserProfile {
  return {
    _id: user._id,
    createdAt: "", // Not in User interface
    updatedAt: "", // Not in User interface
    dateOfBirth: user.dob,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    image: {
      public_id: "",
      url: user.profilePhoto || user.profileImage,
    },
    profileImage: user.profilePhoto || user.profileImage,
    isSuspended: !user.isActive,
    isVerified: user.isVerified,
    location: user.address?.cityState || "",
    phone: user.phoneNumber,
    phoneNumber: user.phoneNumber,
    postalCode: user.address?.postalCode || "",
    role: user.role,
    street: user.address?.roadArea || "",
    bio: user.bio,
    country: user.address?.country || "",
    cityState: user.address?.cityState || "",
    roadArea: user.address?.roadArea || "",
    gender: user.gender as "male" | "female" | "other",
    address: user.address,
  };
}

// Simplified user for lists
export interface SimplifiedUser {
  _id: string;
  name: string;
  email: string;
  role: User["role"];
  profilePhoto: string;
  isActive: boolean;
  phoneNumber: string;
  companyName: string;
}

// User update type
export type UserUpdate = Partial<Omit<User, "_id">>;

// User create type
export type UserCreate = Omit<UserUpdate, "_id">;

// Filter options
export interface UserFilters {
  role?: User["role"];
  isVerified?: boolean;
  isActive?: boolean;
  search?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
}

// Sort options
export interface UserSortOptions {
  field: keyof User;
  order: "asc" | "desc";
}

// ============ CONSTANTS ============

export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const GENDER_OPTIONS = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;

export const DEFAULT_PAGINATION: PaginationInfo = {
  currentPage: 1,
  totalPages: 1,
  totalData: 0,
  hasNextPage: false,
  hasPrevPage: false,
};
export const DEFAULT_USER_FILTERS: UserFilters = {};
export const DEFAULT_USER_SORT: UserSortOptions = {
  field: "firstName",
  order: "asc",
};
