import { getCurrentUser } from "@/app/features/auth/server/auth.queries";
import { getEmployerApplications } from "@/app/features/auth/server/employers.queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, Download, FileText, Mail, UserCircle } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function EmployerApplicationsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "employer") return redirect("/login");

  const applications = await getEmployerApplications(user.id);

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Received Applications
        </h2>
        <p className="text-muted-foreground">
          Review and manage candidates who applied to your job postings.
        </p>
      </div>
      {applications.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            {" "}
            No applications yet
          </h3>
          <p>when candidates apply to your jobs, they will appear here.</p>
        </div>
      ) : (
        <div className="rounded-md border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-[40%] pl-6">Candidate</TableHead>
                <TableHead>Applied Role</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => {
                const { application, job, user, resume } = app;

                return (
                  <TableRow
                    key={application.id}
                    className="hover:bg-gray-50/50"
                  >
                    <TableCell>
                      <div className="flex text-start gap-3">
                        <div className="h-10 w-10 relative rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border">
                          {user.avatarUrl ? (
                            <Image
                              src={user.avatarUrl}
                              alt={user.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <UserCircle className="h-full w-full text-gray-400" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {user.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-blue-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {user.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 mb-1">
                        {/* <span className="font-medium text-gray-900">
                          {job.title}
                        </span> */}
                        <span className="font-medium text-gray-900">
                          {job.title.length > 30
                            ? `${job.title.slice(0, 30)}...`
                            : job.title}
                        </span>
                        <Badge variant="secondary">{job.jobType}</Badge>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(application.appliedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {application.coverLetter && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 border-gray-300 hover:bg-gray-100"
                              >
                                <FileText className="h-4 w-4" />

                                <span className="hidden sm:inline">
                                  Cover Letter
                                </span>
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="overflow-hidden rounded-3xl border-0 p-0 shadow-2xl sm:max-w-2xl text-white">
                              {/* Header */}
                              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
                                    <div className="flex text-start gap-3">
                                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100 flex-shrink-0 border">
                                        {user.avatarUrl ? (
                                          <Image
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            fill
                                            className="object-cover"
                                          />
                                        ) : (
                                          <UserCircle className="h-full w-full text-gray-400" />
                                        )}
                                      </div>

                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-semibold">
                                            Applicant : {user.name}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs">
                                          <span className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />{" "}
                                            {user.email}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogTitle>
                                </DialogHeader>
                              </div>

                              {/* Body */}
                              <div className="space-y-6 bg-white p-6">
                                {/* Applied Job */}
                                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                                    Applied For
                                  </p>

                                  <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                                    {job.title}
                                  </h3>

                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <Badge className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100">
                                      {job.jobType}
                                    </Badge>

                                    <Badge
                                      variant="outline"
                                      className="rounded-full border-gray-300"
                                    >
                                      {job.workType}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Cover Letter */}
                                <div className="rounded-2xl border bg-gray-50 p-5">
                                  <div className="mb-3 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />

                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                      Candidate Message
                                    </p>
                                  </div>

                                  <div className="max-h-[400px] overflow-y-auto pr-2">
                                    <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                                      {application.coverLetter}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {resume?.fileUrl ? (
                          <Button
                            size="sm"
                            asChild
                            className="gap-2 bg-blue-600 hover:bg-blue-700"
                          >
                            <a
                              href={resume.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">Resume</span>
                            </a>
                          </Button>
                        ) : (
                          <Button size="sm" disabled variant="secondary">
                            No Resume
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
