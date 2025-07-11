"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/auth";
const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "leonardo.alvarenga@gmail.com",
      password: "123456",
    },
  });

  function onSubmit(data: LoginFormData) {
    login(data)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error);
        }
        alert("Logado");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        alert(error.message);
      });
  }

  return (
    <div className="w-full mt-9 mx-auto my-auto">
      <Card className="p-8 max-w-96 mx-auto">
        <h1 className="text-3xl text-center font-medium mb-6">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button className="w-full">Login</Button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          <Link href="/register">Register</Link>
        </p>
      </Card>
    </div>
  );
}
