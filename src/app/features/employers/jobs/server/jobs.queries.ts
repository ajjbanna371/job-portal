// src/features/employers/jobs/server/jobs.queries.ts

import db from "@/config/db";
import { employers, jobs, users } from "@/drizzle/schema";
import { and, desc, eq, gte, isNull, like, or, sql, SQL } from "drizzle-orm";

//  2. Define the interface
export interface JobFilterParams {
  search?: string;
  jobType?: string;
  jobLevel?: string;
  workType?: string;
  page?: number;
  limit?: number;
}

export async function getAllJobs(filters: JobFilterParams) {
  console.log("Filters real: ", filters);

  const page = filters.page || 1;
  const limit = filters.limit || 9;
  const offset = (page - 1) * limit;


  // Create a date object for "Midnight Last Night"
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to 00:00:00

  // Base Rule
  const conditions: (SQL | undefined)[] = [
    isNull(jobs.deletedAt), // Not deleted
    or(isNull(jobs.expiresAt), gte(jobs.expiresAt, today)), // Not expired
  ];

  // search
  if (filters.search) {
    // 1: react mern stack react title , react, react thapa
    // % - wildcard
    // 2: company name, tags, title - LIKE() contains
    // 3: OR

    const searchTerm = `%${filters.search}%`;

    conditions.push(
      or(
        like(jobs.title, searchTerm),
        like(employers.name, searchTerm),
        like(jobs.tags, searchTerm),
      ),
    );
  }

  // jobType filter
  if (filters?.jobType && filters.jobType !== "all") {
    conditions.push(eq(jobs.jobType, filters.jobType as any));
  }

  // jobLevel filter
  if (filters?.jobLevel && filters.jobLevel !== "all") {
    conditions.push(eq(jobs.jobLevel, filters.jobLevel as any));
  }

  // workType filter
  if (filters?.workType && filters.workType !== "all") {
    conditions.push(eq(jobs.workType, filters.workType as any));
  }

  const jobsData = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,
      location: jobs.location,
      jobType: jobs.jobType,
      workType: jobs.workType,
      jobLevel: jobs.jobLevel,
      createdAt: jobs.createdAt,
      expiresAt: jobs.expiresAt,
      companyName: employers.name,
      companyLogo: users.avatarUrl,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id)) // Join users to get avatar
    // .where(
    //   and(
    //     isNull(jobs.deletedAt),
    //     or(isNull(jobs.expiresAt), gte(jobs.expiresAt, today)),
    //   ),
    // )
    .where(and(...conditions))
    .orderBy(desc(jobs.createdAt))
    .limit(limit)
    .offset(offset);


    //  2. Fetch the total count for pagination math
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .innerJoin(employers, eq(jobs.employerId, employers.id))
      .innerJoin(users, eq(employers.id, users.id))
      .where(and(...conditions));

      const totalCount = Number(countResult[0]?.count || 0);

      // Return both the data and the total count 

  return {jobs: jobsData, totalCount};
}

// AUTOMATTIC TYPE EXPORT
// This creates a type based on EXACTLY what getAllJobs returns.
// If you add a field above, this type updates automatically.
// export type JobCardType = Awaited<ReturnType<typeof getAllJobs>>[number];


// Ensure the type only extracts the job object shape for JobCards
export type JobCardType = Awaited<ReturnType<typeof getAllJobs>>["jobs"][number];

// ----------- * ---------- getJobById ---------- * ------------- //
/**
 * Get a Single Job By ID with full details
 * Purpose: For the Single Job Details Page (/jobs/[id])
 */
export async function getJobById(jobId: number) {
  const job = await db
    .select({
      // Basic Info
      id: jobs.id,
      title: jobs.title,
      description: jobs.description, // Full HTML Description
      tags: jobs.tags,

      // Salary Details
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,

      // Job Meta Data (Crucial for Sidebar)
      location: jobs.location,
      jobType: jobs.jobType, // e.g. "remote"
      workType: jobs.workType, // e.g. "full-time"
      jobLevel: jobs.jobLevel, // e.g. "senior"
      experience: jobs.experience, // e.g. "3-5 years"
      minEducation: jobs.minEducation, // e.g. "bachelors"

      // Timestamps
      createdAt: jobs.createdAt,
      expiresAt: jobs.expiresAt,

      // Employer Info (Joined)
      companyLogo: users.avatarUrl,
      companyName: employers.name,
      companyBio: employers.description,
      companyWebsite: employers.websiteUrl,
      companyLocation: employers.location,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(eq(jobs.id, jobId)) // Filter by the specific ID
    .limit(1); // We only want one result

  // Return the first item (or undefined if not found)
  return job[0];
}

// Create the Type for the Details Page
export type JobDetailsType = Awaited<ReturnType<typeof getJobById>>;
