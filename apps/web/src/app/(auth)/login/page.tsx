import type { Metadata } from "next";
import { LoginForm } from "@/components/shared/login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your Credex account</p>
      </div>
      <LoginForm />
    </div>
  );
}
