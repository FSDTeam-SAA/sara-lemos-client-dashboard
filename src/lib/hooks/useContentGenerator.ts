import {
  generateContent,
  GenerateContentPayload,
  GenerateContentResponse,
  finalizeFacebookPost,
  FinalizeFacebookPostPayload,
} from "../services/contentGeneratorService";
import { useMutation } from "@tanstack/react-query";

// Generate Content
export function useGenerateContent() {
  return useMutation<GenerateContentResponse, Error, GenerateContentPayload>({
    mutationFn: (data) => generateContent(data),
  });
}

// Finalize Facebook Post
export function useFinalizeFacebookPost() {
  return useMutation<unknown, Error, FinalizeFacebookPostPayload>({
    mutationFn: (data) => finalizeFacebookPost(data),
  });
}
