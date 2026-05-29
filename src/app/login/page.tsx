"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserCheck, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { loginUserAction } from "../features/auth/server/auth.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginUserData, loginUserSchema } from "../features/auth/auth.schema";


const login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginUserSchema),
  });

  //   password show hide handler
  const [showPassword, setShowPassword] = useState(false);


  const onSubmit = async (data: LoginUserData) => {
    
    try {
      const result = await loginUserAction(data);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };


  
  return (
    <div>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">
              Sign in to your Job Portal
            </CardTitle>
            <CardDescription>
              Sign to your account to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* onSubmit={handleSubmit} */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    id="email"
                    placeholder="Your Email"
                    required
                    {...register("email")}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Create strong Password"
                    required
                    {...register("password")}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Login
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {" "}
                  Don't have an Account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-500 hover:text-blue-60 font-medium underline-offset-4 hover:underline"
                  >
                    {" "}
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default login;
