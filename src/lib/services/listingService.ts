// src/lib/services/listingService.ts
import axiosInstance from "../instance/axios-instance";
import { PDFExtractionResponse } from "../types/listing";

export interface Listing {
  _id: string;
  yachtName: string;
  builder: string;
  yachtType: string;
  model: string;
  location: string;
  guestCapacity: number;
  Price: number;
  bathRooms: number;
  bedRooms: number;
  cabins: number;
  crew: number;
  guests: number;
  constructions: {
    GRP: boolean;
    Steel: boolean;
    Aluminum: boolean;
    Wood: boolean;
    Composite: boolean;
  };
  yearBuilt: number;
  lengthOverall: {
    value: number;
    unit: string;
  };
  beam: {
    value: number;
    unit: string;
  };
  draft: {
    value: number;
    unit: string;
  };
  grossTons: number;
  engineMake: string;
  engineModel: string;
  images: string[];
  description: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ListingsResponse {
  success: boolean;
  listings: Listing[];
  pagination: Pagination;
}

//  Get All Listing
export const getAllListing = async (): Promise<ListingsResponse> => {
  const response = await axiosInstance.get<ListingsResponse>("/listing/all", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response.data;
};

// Upload Listing PDF
export const uploadListingManual = async (
  data: FormData,
): Promise<PDFExtractionResponse> => {
  const response = await axiosInstance.post<PDFExtractionResponse>(
    "/listing/extract-pdf",
    data,
    {
      // Headers will be set automatically by Axios when passing FormData
    },
  );

  return response.data;
};

export const createListingManual = async (
  data: FormData,
): Promise<ListingsResponse> => {
  const response = await axiosInstance.post<ListingsResponse>(
    "/listing/create",
    data,
    {
      // Headers will be set automatically by Axios when passing FormData
    },
  );

  return response.data;
};
