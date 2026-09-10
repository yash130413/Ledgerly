import type { Metadata } from "next";
import { SignupForm } from "@/components/shared/signup-form";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Start auditing your AI spend today</p>
      </div>
      <SignupForm />
    </div>
  );
}
