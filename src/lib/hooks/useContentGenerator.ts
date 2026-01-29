import {
  generateContent,
  GenerateContentPayload,
  GenerateContentResponse,
} from "../services/contentGeneratorService";
import { useMutation } from "@tanstack/react-query";

// Generate Content
export function useGenerateContent() {
  return useMutation<GenerateContentResponse, Error, GenerateContentPayload>({
    mutationFn: (data) => generateContent(data),
  });
}
