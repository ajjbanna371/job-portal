// "use client";
import { JobDetailsType } from "@/app/features/employers/jobs/server/jobs.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Banknote,
  Briefcase,
  CalendarDays,
  Globe,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

interface JobSidebarProps {
  job: NonNullable<JobDetailsType>;
  // "NonNullable" tells TS: "Trust me, job is not undefined here. It has to be a valid JobDetailsType object."
}

const JobOverviewSidebar = ({ job }: JobSidebarProps) => {
  // Helper for salary
  const salaryDisplay =
    job.minSalary && job.maxSalary
      ? `${job.salaryCurrency} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`
      : "Not Disclosed";

  return (
    <div>
      <div className="space-y-6">
        {/* Job Overview Card */}
        <Card>
          <CardHeader className="bg-gray-50/50 pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Job Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <OverviewItem
              label="Salary"
              icon={<Banknote className="h-5 w-5 text-gray-500" />}
              value={salaryDisplay}
            />
            <OverviewItem
              label="Job Type"
              icon={<Briefcase className="h-5 w-5 text-gray-500" />}
              value={job.jobType?.replace("-", " ")}
            />

            <OverviewItem
              label="Work Type"
              icon={<CalendarDays className="h-5 w-5 text-gray-500" />}
              value={job.workType?.replace("-", " ")}
            />

            <OverviewItem
              label="Experience level"
              icon={<GraduationCap className="h-5 w-5 text-gray-500" />}
              value={job.experience?.replace("-", " ")}
            />

            <OverviewItem
              label="Education"
              icon={<GraduationCap className="h-5 w-5 text-gray-500" />}
              value={job.minEducation?.replace("-", " ") || null}
            />
          </CardContent>
        </Card>

        {/* Company Snippet Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About the Company</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <p
              className="text-sm text-gray-600 line-clamp-4 prose prose-sm"
              dangerouslySetInnerHTML={{ __html: job.companyBio || "No description available." }}
            /> */}

            <div
              className="text-sm text-gray-600 line-clamp-4 prose prose-sm"
              dangerouslySetInnerHTML={{
                __html: job.companyBio || "No company description available.",
              }}
            />
            {job.companyWebsite && (
              <Link
                href={job.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit company website (opens in new tab)"
                className="flex items-center gap-2 font-medium text-blue-600 hover:underline"
              >
                <Globe className="h-4 w-4" />
                Visit Website
              </Link>
            )}  
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobOverviewSidebar;

function OverviewItem({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string | null | undefined;
}) {
  if (!value) return null; // Don't render if value is empty or undefined
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
        <p className="text-sm font-semibold text-gray-900 capitalize">
          {value}
        </p>
      </div>
    </div>
  );
}
