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
// import { RegistrationAction } from "./registrationAction.action";
import { RegistrationAction } from "../features/auth/server/auth.actions";
import { toast } from "sonner";

interface RegistrationFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "applicant" | "employer";
}
const Registration: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "applicant",
  });

  //   input text handler
  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //   password show hide handler
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Here you would typically make your API call
    const registrationFormData = {
      name: formData.name.trim(),
      username: formData.username.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role,
    };

    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    const result = await RegistrationAction(registrationFormData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
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
            {/* onSubmit={handleSubmit} */}
            {/* action={RegistrationAction} */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Full Name"
                    required
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("name", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    id="username"
                    name="userame"
                    placeholder="Your Username"
                    required
                    value={formData.username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    id="email"
                    name="email"
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

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">I am a *</Label>
                <Select
                  name="role"
                  value={formData.role}
                  onValueChange={(value: "applicant" | "employer") =>
                    handleInputChange("role", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applicant">Job Applicant</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="pl-10 pr-10"
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

              {/* <Button
        variant="outline"
        onClick={() => toast.success("Event has been created")}
      >
        Success
      </Button> */}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
