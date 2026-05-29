"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { UserCheck, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { loginUserAction } from "../features/auth/server/auth.actions";

interface LoginFormData {
  email: string;
  password: string;
}
const login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  //   input text handler
  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //   password show hide handler
  const [showPassword, setShowPassword] = useState(false);

  console.log(formData);


  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const LoginData = {
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
    };

   const result = await loginUserAction(LoginData);
    if (result.success) {
         toast.success(result.message);
       } else {
         toast.error(result.message);
       }
      

  } catch (error) {
    console.error(error);
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
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
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-10 pr-10"
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
