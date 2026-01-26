// src/lib/hooks/useOverview.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import { getOverviewData, postAskForHelp } from "../services/overViewService";

// Type definition for ask for help data
export interface AskForHelpData {
  issue: string;
  description: string;
  email: string;
}

// get dashboard all overview
export function useGetOverview(userId: string | undefined) {
  return useQuery({
    queryKey: ["overview", userId],
    queryFn: () => getOverviewData(userId!),
    enabled: !!userId,
  });
}

// post ask for help
export function usePostAskForHelp() {
  return useMutation({
    mutationFn: (data: AskForHelpData) => postAskForHelp(data),
  });
}
