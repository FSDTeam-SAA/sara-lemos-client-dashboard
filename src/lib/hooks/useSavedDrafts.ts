// src/lib/hooks/useOverview.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteSavedDrafts,
  editSavedDrafts,
  getSavedDrafts,
  getSingleSavedDrafts,
} from "../services/SavedDraftsService";

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
    mutationFn: (data: FormData | Record<string, unknown>) =>
      editSavedDrafts(id, data),
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
export function useDeleteSavedDrafts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSavedDrafts(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedDrafts"] });
    },
  });
}
