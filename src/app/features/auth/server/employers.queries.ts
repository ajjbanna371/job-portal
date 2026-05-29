import {
  applicants,
  employers,
  jobApplications,
  jobs,
  resumes,
  users,
} from "@/drizzle/schema";
import { getCurrentUser } from "./auth.queries";
import db from "@/config/db";
import { desc, eq } from "drizzle-orm";

export const getCurrentEmployerDetails = async () => {
  const currentUser = await getCurrentUser();

  console.log("currentUser:", currentUser);

  if (!currentUser) return null;

  if (currentUser.role !== "employer") return null;

  const [employer] = await db
    .select()
    .from(employers)
    .where(eq(employers.id, currentUser.id));

  console.log("employer:", employer);

  const isProfileCompleted =
    employer.name &&
    employer.description &&
    currentUser.avatarUrl &&
    employer.organizationType &&
    employer.teamSize &&
    employer.location &&
    employer.websiteUrl &&
    employer.yearOfEstablishment;

  return { ...currentUser, employerDetails: employer, isProfileCompleted };
};

//  for getting recently applied jobs aplicatons
export async function getEmployerApplications(employerId: number) {
  const applications = await db
    .select({
      application: jobApplications,
      job: jobs,
      user: users,
      applicant: applicants,
      resume: resumes,
    })
    .from(jobApplications)
    .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
    .innerJoin(users, eq(jobApplications.applicantId, users.id))
    .leftJoin(applicants, eq(jobApplications.applicantId, applicants.id))
    .leftJoin(resumes, eq(jobApplications.resumeId, resumes.id))
    .where(eq(jobs.employerId, employerId))
    .orderBy(desc(jobApplications.appliedAt));

  return applications;
}
