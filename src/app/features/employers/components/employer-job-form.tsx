"use client";

import Tiptap from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  JOB_LEVEL,
  JOB_TYPE,
  MIN_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/config/constant";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Award,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  Loader,
  MapPin,
  Tag,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { JobFormData, jobSchema } from "../jobs/jobs.schema";
import { toast } from "sonner";
import { createJobAction, updateJobAction } from "../../server/jobs.actions";
import { useRouter } from "next/navigation";

export type SalaryCurrency = (typeof SALARY_CURRENCY)[number];
export type SalaryPeriod = (typeof SALARY_PERIOD)[number];

export type JobType = (typeof JOB_TYPE)[number];
export type WorkType = (typeof WORK_TYPE)[number];

export type JobLevel = (typeof JOB_LEVEL)[number];
export type MinEducation = (typeof MIN_EDUCATION)[number];

// interface JobFormValues {
//   title: string;
//   description: string;

//   tags?: string; // comma-separated or space-separated

//   minSalary?: number;
//   maxSalary?: number;

//   salaryCurrency?: SalaryCurrency;
//   salaryPeriod?: SalaryPeriod;

//   location?: string;

//   jobType?: JobType;
//   workType?: WorkType;
//   jobLevel?: JobLevel;

//   experience?: string;
//   minEducation?: MinEducation;

//   isFeatured: boolean;

//   expiresAt?: string; // YYYY-MM-DD (HTML date input)
// }

interface JobPostFormProps {
  initialData?: any; // The job data fetched from DB
  isEditMode?: boolean; // Flag to tell from what to do
}

export const JobForm = ({
  initialData,
  isEditMode = false,
}: JobPostFormProps) => {
  //   const {
  //     register,
  //     control,
  //     formState: { errors, isDirty, isSubmitting },
  //   } = useForm<JobFormValues>();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          // Fix 1: Handle Date formet
          expiresAt: initialData.expiresAt
            ? new Date(initialData.expiresAt).toISOString().split("T")[0] //"2026-01-20T18:15:00.000Z"
            : "",
        }
      : {
          title: "",
          description: "",

          jobType: undefined,
          workType: undefined,
          jobLevel: undefined,

          location: "",
          tags: "",

          minSalary: "",
          maxSalary: "",
          salaryCurrency: undefined,
          salaryPeriod: undefined,

          minEducation: undefined,
          experience: "",
          expiresAt: "",
        },
  });

  const router = useRouter();

  const handleFormSubmit = async (data: JobFormData) => {
    try {
      let response;
      if (isEditMode && initialData) {
        // ---- Update Flow ----
        response = await updateJobAction(initialData.id, data);
      } else {
        // ---- Create Flow ----
        response = await createJobAction(data);
      }
      // const response = await createJobAction(data);
      if (response.status === "SUCCESS") {
        toast.success(response.message);
        router.push("/employer-dashboard/jobs");
        // router.refresh();  // Ensure the list page show new data
      } else toast.error(response.message);
    } catch (error) {
      toast.error("Something went wrong");
    }
    // const response = await createJobAction(data);
    // if (response.status === "SUCCESS") toast.success(response.message);
    // else toast.error(response.message);
  };

  return (
    <Card className="w-3/4">
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="title"
                type="text"
                placeholder="e.g., Senior Frontend Developer"
                className={cn("pl-10", errors.title && "border-destructive")}
                {...register("title")}
                aria-invalid={!!errors.title}
              />
            </div>
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message as string}
              </p>
            )}
          </div>

          {/* Job Type, Work Type, Job Level */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Controller
                name="jobType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="jobType"
                        className={cn(
                          "pl-10 w-full",
                          errors.jobType && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPE.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              ></Controller>
              {errors.jobType && (
                <p className="text-sm text-destructive">
                  {errors.jobType.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workType">Work Type *</Label>
              <Controller
                name="workType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="workType"
                        className={cn(
                          "pl-10 w-full",
                          errors.workType && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select Work type" />
                      </SelectTrigger>
                      <SelectContent>
                        {WORK_TYPE.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              ></Controller>
              {errors.workType && (
                <p className="text-sm text-destructive">
                  {errors.workType.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobLevel">Job Level *</Label>
              <Controller
                name="jobLevel"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="jobLevel"
                        className={cn(
                          "pl-10 w-full",
                          errors.jobLevel && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select Job Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_LEVEL.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              ></Controller>
              {errors.jobLevel && (
                <p className="text-sm text-destructive">
                  {errors.jobLevel.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Location (Optional), Tags (Optional) */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., New York NY or Remote"
                  className="pl-10"
                  {...register("location")}
                  aria-invalid={!!errors.location}
                />
              </div>
              {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="tags"
                  type="text"
                  placeholder="e.g., React TypeScript Node.js"
                  className="pl-10"
                  {...register("tags")}
                  aria-invalid={!!errors.tags}
                />
              </div>
              {errors.tags && (
                <p className="text-sm text-destructive">
                  {errors.tags.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Min Salary (Optional), Max Salary (Optional), Currency, Period */}
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary">Min Salary (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="minSalary"
                  type="text"
                  placeholder="e.g., 50000"
                  className="pl-10"
                  {...register("minSalary")}
                  aria-invalid={!!errors.minSalary}
                />
              </div>
              {errors.minSalary && (
                <p className="text-sm text-destructive">
                  {errors.minSalary.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSalary">Max Salary (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="maxSalary"
                  type="text"
                  placeholder="e.g., 80000"
                  className="pl-10"
                  {...register("maxSalary")}
                  aria-invalid={!!errors.maxSalary}
                />
              </div>
              {errors.maxSalary && (
                <p className="text-sm text-destructive">
                  {errors.maxSalary.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryCurrency">Currency</Label>
              <Controller
                name="salaryCurrency"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="salaryCurrency"
                        className={cn(
                          "w-full",
                          errors.workType && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {SALARY_CURRENCY.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              ></Controller>
              {errors.salaryCurrency && (
                <p className="text-sm text-destructive">
                  {errors.salaryCurrency.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryPeriod">Period</Label>
              <Controller
                name="salaryPeriod"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="salaryPeriod"
                        className={cn(
                          "w-full",
                          errors.jobLevel && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        {SALARY_PERIOD.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              ></Controller>
              {errors.salaryPeriod && (
                <p className="text-sm text-destructive">
                  {errors.salaryPeriod.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Minimum Education (Optional), Expiry Date (Optional) */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minEducation">Minimum Education (Optional)</Label>
              <Controller
                name="minEducation"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="minEducation"
                        className={cn(
                          "pl-10 w-full",
                          errors.jobType && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {MIN_EDUCATION.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              ></Controller>
              {errors.minEducation && (
                <p className="text-sm text-destructive">
                  {errors.minEducation.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date (Optional)</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="expiresAt"
                  type="date"
                  className={cn(
                    "pl-10",
                    errors.expiresAt && "border-destructive",
                  )}
                  {...register("expiresAt")}
                  aria-invalid={!!errors.expiresAt}
                />
              </div>
              {errors.expiresAt && (
                <p className="text-sm text-destructive">
                  {errors.expiresAt.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Experience Requirements */}
          <div className="space-y-2">
            <Label htmlFor="experience">
              Experience Requirements (Optional)
            </Label>
            <div className="relative">
              <Award className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="experience"
                type="text"
                placeholder="e.g., 3+ years of React development"
                className={cn(
                  "pl-10",
                  errors.experience && "border-destructive",
                )}
                {...register("experience")}
                aria-invalid={!!errors.experience}
              />
            </div>
            {errors.experience && (
              <p className="text-sm text-destructive">
                {errors.experience.message as string}
              </p>
            )}
          </div>

          {/* Tiptap text Editor Job Description */}
          <div className="space-y-2">
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label>Job Description *</Label>
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

          {/* Post Job Button */}
          <div className="flex items-center gap-4 pt-4 flex-wrap">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
              {isEditMode
                ? isSubmitting
                  ? "Saving..."
                  : "Update Job"
                : isSubmitting
                  ? "Saving..."
                  : "Post Job"}
              {/* {isSubmitting ? "Saving..." : isEditMode ? "Update Job" : "Post Job"} */}
              {/* {isSubmitting ? "Saving..." : "Post Job"} */}
            </Button>
            {!isDirty && (
              <p className="text-sm text-muted-foreground">
                No Changes to save
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
