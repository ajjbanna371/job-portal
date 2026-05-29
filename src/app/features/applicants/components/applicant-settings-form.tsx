"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import {
  Briefcase,
  Calendar,
  Flag,
  Globe,
  Loader,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  applicantSettingsSchema,
  ApplicantSettingsSchema,
  EDUCATION_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from "../applicant.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Tiptap from "@/components/text-editor";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ResumeUpload } from "./resume-upload";
import { ImageUpload } from "./image-upload";
import { savaApplicantProfile } from "../server/applicant.action";
import { ApplicantProfileType } from "../server/applicant.queries";

interface ApplicantSettingsFormProps {
  initialData: ApplicantProfileType | null;
}

const ApplicantSettingsForm = ({ initialData }: ApplicantSettingsFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ApplicantSettingsSchema>({
    resolver: zodResolver(applicantSettingsSchema),
    defaultValues: initialData || {
      email: "", // Fallback if no data at all
    },
  });

  const isUpdating = !!initialData?.location; // Boolean coercion

  const onSubmit = async (data: ApplicantSettingsSchema) => {
    console.log("Saving Data: ", data);
    // console.log("Uploaded Resume URL:", data.resumeUrl);
    // console.log("Uploaded Resume Name:", data.resumeName);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // alert("Profile Updated Successfully! (Check Console)");

    try {
      const res = await savaApplicantProfile(data);
      if (res.status === "SUCCESS") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Form Submission Error:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic information</CardTitle>
            <CardDescription>
              This is how employers will see you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6 mb-6">
              {/* <div className="h-24 w-24 rounded-full bg-gray-50 py-4 items-center justify-center border-2 border-dashed border-gray-200 hover:border-gray-400 cursor-pointer transition"> */}
              <div className="text-center space-y-1">
                {/* <UploadCloud className="h-6 w-6 mx-auto text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    Upload Photo
                  </span> */}

                <Controller
                  name="avatarUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div>
                      {/* <Label>Upload Logo</Label> */}
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        className={cn(
                          fieldState.error &&
                            "ring-1 ring-destructive/50 rounded-full",
                          "h-34 w-34",
                        )}
                      />
                      {fieldState.error && (
                        <p className="text-sm text-destructive">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* </div> */}

              <div className="text-sm text-muted-foreground">
                <p>Max file size is 5MB. Minimum dimension: 150x150px</p>
                <p>Suitable file formats: JPG & PNG</p>
              </div>
            </div>

            {/* Full Name and Email - two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="John Doe"
                    className={`pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="john@example.com"
                    className="pl-10 bg-gray-50"
                    {...register("email")}
                    readOnly
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone and Location - two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="+1234 567 890"
                    className={`pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="New York, USA"
                    className={`pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("location")}
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date of Birth and Nationality - two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    placeholder="Select your date of birth"
                    className={`pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("dateOfBirth")}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g., American, Indian"
                    className={`pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("nationality")}
                  />
                </div>
                {errors.nationality && (
                  <p className="text-sm text-destructive">
                    {errors.nationality.message}
                  </p>
                )}
              </div>
            </div>

            {/* Gender and Marital Status - two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          errors.gender
                            ? "border-destructive focus:ring-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-sm text-destructive">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status *</Label>
                <Controller
                  name="maritalStatus"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          errors.gender
                            ? "border-destructive focus:ring-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select your marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        {MARITAL_STATUS_OPTIONS.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.maritalStatus && (
                  <p className="text-sm text-destructive">
                    {errors.maritalStatus.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Education and Experience - two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="education">Education *</Label>
                <Controller
                  name="education"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          errors.gender
                            ? "border-destructive focus:ring-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select your highest education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_OPTIONS.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.education && (
                  <p className="text-sm text-destructive">
                    {errors.education.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className={`pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    placeholder="e.g., 3 years at XYZ Company"
                    {...register("experience")}
                  />
                </div>
                {errors.experience && (
                  <p className="text-sm text-destructive">
                    {errors.experience.message}
                  </p>
                )}
              </div>
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL (optional)</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="https://www.yourportfolio.com"
                  {...register("websiteUrl")}
                />
              </div>
              {errors.websiteUrl && (
                <p className="text-sm text-destructive">
                  {errors.websiteUrl.message}
                </p>
              )}
            </div>

            {/* Biography */}
            {/* <div className="space-y-2">
              <Label htmlFor="biography">Biography *</Label>
              <Textarea
                className={`min-h-[120px] ${errors.biography ? "border-destructive focus-visible:ring-destructive" : ""}`}
                placeholder="Tell us about yourself..."
                {...register("biography")}
              />
              <div className="flex justify-between items-start">
                {errors.biography && (
                    <p className="text-sm text-destructive">
                        {errors.biography.message}
                    </p>
                )}
                <p className="text-[10px] text-right text-muted-foreground">
                Max 500 characters
              </p>
              </div>
            </div> */}

            {/* Tiptap text Editor Description */}
            <div className="space-y-2">
              <Controller
                name="biography"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label>Biography *</Label>
                    <Tiptap content={field.value} onChange={field.onChange} />

                    {fieldState.error && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <Separator />

            {/* Resume upload / CV */}
            {/* <div className="space-y-4">
              <Label className="text-base">Resume / CV</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition hover:bg-gray-50">
                <div className="text-center space-y-1">
                  <UploadCloud className="h-15 w-15 rounded-full mx-auto text-blue-400 bg-blue-100 mt-4 p-4" />
                  <p>Click to upload or drag and drop</p>
                  <span className="text-[10px] text-muted-foreground mb-4">
                    PDF (Max 2 MB)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

            {/* Resume upload / CV */}
            <div className="space-y-4">
              <Label className="text-base">Your Cv/Resume</Label>

              <Controller
                name="resumeUrl"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <ResumeUpload
                      value={field.value}
                      onChange={(url, name, size) => {
                        // We update BOTH fields in React Hook from when upload finishes
                        field.onChange(url);
                        setValue("resumeName", name, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("resumeSize", size, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        // setValue("resumeName", name, { shouldDirty: true});  // if you want to use setValue
                      }}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-destructive mt-2">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Footer Action */}
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                // Disable the button if submitting OR if the user hasn't changed any fields
                disabled={isSubmitting || !isDirty}
                className="min-w-[150px]"
              >
                {isSubmitting && (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isSubmitting
                  ? isUpdating
                    ? "Updating..."
                    : "Saving..."
                  : isUpdating
                    ? "Update Profile"
                    : "Save Profile"}
              </Button>

              {!isDirty && (
                <p className="text-sm text-muted-foreground">
                  No changes to save.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ApplicantSettingsForm;

// // // * ------------------------- * ----------------------------- * //

// // // Note this is our normal Setting Form validation page end

// // // * ------------------------- * ----------------------------- * //

// * ------------------------- * ----------------------------- * //

// Note this is our Zod Validation Applicant Setting Form page start

// * ------------------------- * ----------------------------- * //
