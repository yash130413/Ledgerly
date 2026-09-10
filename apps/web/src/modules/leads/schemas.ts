import { z } from "zod";

export const leadCaptureSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  company: z.string().min(1, "Company name is required").max(100),
  role: z.string().min(1, "Select your role"),
  teamSize: z.string().min(1, "Select your team size"),
  // Honeypot field — must always be empty. Validated server-side via isHoneypotTripped().
  website: z.string().optional(),
});

export type LeadCaptureInput = Omit<z.infer<typeof leadCaptureSchema>, "website"> & {
  website?: string;
};
