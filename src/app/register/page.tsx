"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { User, UserCheck, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { RegistrationAction } from "../features/auth/server/auth.actions";
import { toast } from "sonner";
import {
  RegisterUserWithConfirmData,
  registerUserWithConfirmSchema,
} from "../features/auth/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const Registration: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerUserWithConfirmSchema), // Integrate Zod schema with React Hook Form using zodResolver ( npm install @hookform/resolvers )
  });

  const router = useRouter();

  //   password show hide handler
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: RegisterUserWithConfirmData) => {
    const result = await RegistrationAction(data);

  if (result.success) {
    toast.success(result.message);

    if (data.role === "employer") {
      router.push("/employer-dashboard");
    } else {
      router.push("/dashboard");
    }
  } else {
    toast.error(result.message);
    router.push("/");
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
            <CardTitle className="text-2xl">Join Our Job Portal</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    id="name"
                    placeholder="Your Full Name"
                    required
                    {...register("name")}
                    className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    id="username"
                    placeholder="Your Username"
                    required
                    {...register("username")}
                    className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

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

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">I am a *</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue=""
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applicant">Job Applicant</SelectItem>
                        <SelectItem value="employer">Employer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                ></Controller>
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    {...register("confirmPassword")}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Create Account
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {" "}
                  Already have an Account?{" "}
                  <Link
                    href="login"
                    className="text-blue-500 hover:text-blue-60 font-medium underline-offset-4 hover:underline"
                  >
                    {" "}
                    Sign in here
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

export default Registration;

// npm i zod        Installation command for Zod library

// Zod schema validation in Next.js  for this first we need to create a schema in auth.schema.ts file and then we can use that schema in our registration form to validate the user input before sending it to the server. This will help us ensure that the data being sent to the server is in the correct format and meets our validation criteria.

// Integrate Zod schema with React Hook Form using zodResolver ( npm install @hookform/resolvers )
