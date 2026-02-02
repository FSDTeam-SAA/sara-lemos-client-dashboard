export interface FacebookPostMedia {
  url: string;
  mediaType: "IMAGE" | "VIDEO";
  _id: string;
}

export interface FacebookPostContent {
  message: string;
  hashtags: string[];
}

export interface FacebookPostPlatformData {
  facebook?: { isVerified: boolean };
  instagram?: { isVerified: boolean };
}

export type FacebookPostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "FAILED";

export interface FacebookPost {
  _id: string;
  userId: string;
  pageId: string;
  listingName: string;
  content: FacebookPostContent;
  media: FacebookPostMedia[];
  postType: string;
  platforms: string[];
  status: FacebookPostStatus;
  platformData: FacebookPostPlatformData;
  statusCheckCount: number;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FacebookPostResponse {
  success: boolean;
  data: FacebookPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SingleFacebookPostResponse {
  success: boolean;
  data: FacebookPost;
}
