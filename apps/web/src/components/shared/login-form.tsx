"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AnimateList, AnimateItem } from "@/components/shared/motion";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { createClient } from "@/infra/supabase/client";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) { toast.error(error.message); return; }
    router.push("/dashboard");
  };

  return (
    <Card hover={false} className="shadow-lg shadow-black/[0.06] border-gray-100">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimateList className="flex flex-col gap-4" stagger={0.07}>
            <AnimateItem>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </AnimateItem>

            <AnimateItem>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  aria-describedby={errors.password ? "password-error" : undefined}
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                {errors.password && (
                  <p id="password-error" role="alert" className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </AnimateItem>

            <AnimateItem>
              <motion.div
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.12, ease: EASE }}
              >
                <Button
                  type="submit"
                  className="w-full"
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Signing in…" : "Sign in"}
                </Button>
              </motion.div>
            </AnimateItem>

            <AnimateItem>
              <p className="text-center text-sm text-muted-foreground">
                No account?{" "}
                <Link href="/signup" className="text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity">
                  Sign up
                </Link>
              </p>
            </AnimateItem>
          </AnimateList>
        </form>
      </CardContent>
    </Card>
  );
}
