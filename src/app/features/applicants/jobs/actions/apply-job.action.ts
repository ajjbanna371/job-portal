"use server";
import { getCurrentUser } from "@/app/features/auth/server/auth.queries";
import { applyJobSchema, ApplyJobSchema } from "../../apply-job.schema";
import db from "@/config/db";
import { jobApplications } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function applyForJobAction(data: ApplyJobSchema) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return { status: "ERROR", message: "Unauthorized. Please Login." };

    const { data: validatedData, error } = applyJobSchema.safeParse(data);

    if (error) {
      return { status: "ERROR", message: error.issues[0].message };
    }

    const { jobId, resumeId, coverLetter } = validatedData;

    const existingApplication = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.applicantId, user.id),
          eq(jobApplications.jobId, jobId),
        ),
      ).limit(1);

      if (existingApplication.length > 0) {
        return {
            status: "ERROR",
            message: "You have already applied for this job.",
        };
      }

      await db.insert(jobApplications).values({
        jobId,
        applicantId: user.id,
        resumeId,
        coverLetter: coverLetter || null,
      });

      revalidatePath(`/jobs/${jobId}`);

      return {
        status: "SUCCESS",
        message: "Application submitted successfully!",
      };
  } catch (error) {
        console.error("APPLY JOB ERROR:", error);
        return { status: "ERROR", message: "Failed to submit application." };
  }
}
