// src/lib/hooks/useOverview.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteSavedDrafts,
  editSavedDrafts,
  getSavedDrafts,
  getSingleSavedDrafts,
} from "../services/SavedDraftsService";
import { FacebookPost } from "@/types/facebook";

// Type definition for ask for help data
export interface AskForHelpData {
  issue: string;
  description: string;
  email: string;
}

// get dashboard all overview
export function useGetSavedDrafts(status: string) {
  return useQuery({
    queryKey: ["savedDrafts", status],
    queryFn: () => getSavedDrafts(status),
    enabled: !!status,
  });
}

// edit saved drafts
export function useEditSavedDrafts(id: string) {
  return useMutation({
    mutationFn: (data: Partial<FacebookPost>) => editSavedDrafts(id, data),
  });
}

// get single saved drafts
export function useGetSingleSavedDrafts(id: string) {
  return useQuery({
    queryKey: ["singleSavedDrafts", id],
    queryFn: () => getSingleSavedDrafts(id),
    enabled: !!id,
  });
}

// delete saved drafts
export function useDeleteSavedDrafts(id: string) {
  return useMutation({
    mutationFn: () => deleteSavedDrafts(id),
  });
}
