import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  ShieldX,
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "../../auth/server/auth.queries";
import { getAppliedJobsForApplicant } from "../server/applicant.queries";
import { redirect } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";

// Mock data for recent applications
// const RECENT_APPLICATIONS = [
//   {
//     id: 1,
//     title: "Networking Engineer",
//     type: "Remote",
//     location: "washington, USA",
//     salary: "$80k-100k/month",
//     date: "may 20, 2026 19:28",
//     status: "Active",
//     logo: "https://img.magnific.com/premium-vector/creative-elegant-abstract-minimalistic-logo-design-vector-any-brand-company_1253202-235749.jpg?semt=ais_hybrid&w=740&q=80",
//     company: "Dell Technologies",
//     typeColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
//     url: "https://www.dell.com/",
//   },
//   {
//     id: 2,
//     title: "Product Designer",
//     type: "Full Time",
//     location: "Dhaka bangladesh",
//     salary: "$50k-80k/month",
//     date: "April 28, 2026 23:26",
//     status: "Inactive",
//     logo: "https://png.pngtree.com/template/20210615/ourmid/pngtree-design-a-real-estate-company-logo-image_535799.jpg",
//     company: "Creative Tech Park",
//     typeColor: "bg-purple-100 text-purple-700 hover:bg-purple-100",
//     url: "https://creativetechpark.com/",
//   },
//   {
//     id: 3,
//     title: "UI/UX Designer",
//     type: "Temporary",
//     location: "New York, USA",
//     salary: "$60k-90k/month",
//     date: "June 15, 2026 14:12",
//     status: "Active",
//     logo: "https://img.magnific.com/free-vector/colorful-letter-gradient-logo-design_474888-2309.jpg",
//     company: "Beehive Softwares",
//     typeColor: "bg-green-100 text-green-700 hover:bg-green-100",
//     url: "https://www.beehivesoftware.com/",
//   },
//   {
//     id: 4,
//     title: "Data Analyst",
//     type: "contract",
//     location: "San Francisco, USA",
//     salary: "$70k-110k/month",
//     date: "February 10, 2026 09:45",
//     status: "Inactive",
//     logo: "https://img.magnific.com/free-vector/bird-colorful-gradient-design-vector_343694-2506.jpg?semt=ais_hybrid&w=740&q=80",
//     company: "Data Insights Co.",
//     typeColor: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
//     url: "https://www.datainsightsco.com/",
//   },
//   {
//     id: 5,
//     title: "Marketing Specialist",
//     type: "FreeLance",
//     location: "Chicago, USA",
//     salary: "$55k-85k/month",
//     date: "August 5, 2026 16:30",
//     status: "Active",
//     logo: "https://images.seeklogo.com/logo-png/38/1/company-logo-png_seeklogo-389186.png",
//     company: "MarketGurus Inc.",
//     typeColor: "bg-orange-100 text-orange-700 hover:bg-orange-100",
//     url: "https://www.alkami.com/",
//   },
//   {
//     id: 6,
//     title: "Software Engineer",
//     type: "Part Time",
//     location: "Austin, USA",
//     salary: "$90k-130k/month",
//     date: "December 20, 2025 11:20",
//     status: "Inactive",
//     logo: "https://png.pngtree.com/png-vector/20250513/ourmid/pngtree-modern-house-rooftop-logo-design-png-image_16241300.png",
//     company: "Innovatech Solutions",
//     typeColor: "bg-red-100 text-red-700 hover:bg-red-100",
//     url: "https://www.innovatechsolutions.com/",
//   },
// ];

export async function RecentApplications() {
  const user = await getCurrentUser();
  if (!user) return redirect("/login");

  const allApplications = await getAppliedJobsForApplicant(user.id);

  const recentApplications = allApplications.slice(0, 5);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-6">
        <h3 className="font-semibold text-gray-900">Recently Applied</h3>
        <Link
          href="/dashboard/applied-jobs"
          className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {recentApplications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          You haven't applied to any jobs yet.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="w-[40%] pl-6">Job Title</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentApplications.map((app) => {
              const { application, job, employer } = app;

              return (
                <TableRow key={application.id} className="hover:bg-gray-50">
                  {/* Job Info Column */}
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-start gap-4">
                      {/* Logo PlaceHolder */}
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500 overflow-hidden border">
                        {employer?.bannerImageUrl ? (
                          <Image
                            src={employer.bannerImageUrl}
                            alt={employer.name || "Company"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-gray-400" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {job.title}
                          </span>
                          <Badge className="rounded-full px-2 py-0.5 text-[10px] font-normal border-0 bg-blue-100 text-blue-700 hover:bg-blue-100 whitespace-nowrap">
                            {job.jobType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{" "}
                            {job.location || "Remote"}
                          </span>
                          {(job.minSalary || job.maxSalary) && (
                            <span>
                              {job.salaryCurrency} {job.minSalary} -{" "}
                              {job.maxSalary}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>


                  {/* Date Applied Column */} 
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(application.appliedAt), "MMM dd, yyyy")}
                  </TableCell>

                  {/* Status Column */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-green-600 font-medium text-sm"> 
                      <CheckCircle2 className="h-4 w-4" />
                      Applied
                    </div>
                  </TableCell>

                  {/* Action Column */}
                  <TableCell className="text-right pr-6">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1 justify-end"
                    >
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
