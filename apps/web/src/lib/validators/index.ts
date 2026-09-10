import { z } from "zod";

/** Auth + shared form schemas (UI). Domain validation for APIs lives in Nest DTOs. */
export {
  leadCaptureSchema,
  type LeadCaptureInput,
} from "@/modules/leads/schemas";

export const auditSchema = z.object({
  name: z.string().min(1, "Audit name is required").max(100),
  providerId: z.string().min(1, "Select a provider"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export const integrationSchema = z.object({
  provider: z.enum(["openai", "anthropic", "gemini", "cohere", "mistral", "custom"]),
  apiKey: z.string().min(10, "API key appears too short"),
  label: z.string().min(1, "Label is required").max(50),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AuditInput = z.infer<typeof auditSchema>;
export type IntegrationInput = z.infer<typeof integrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
