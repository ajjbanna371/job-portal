"use server";

import db from "@/config/db";
import { getCurrentUser } from "../../auth/server/auth.queries";
import { applicantSettingsSchema, ApplicantSettingsSchema } from "../applicant.schema";
import { applicants, resumes, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const savaApplicantProfile = async (data: ApplicantSettingsSchema) => {
    try {
        console.log("data: ", data);

        const user = await getCurrentUser();
        if (!user) return { status: "ERROR", message: "Unauthorized" };

        const { data: validatedData, error } = 
        applicantSettingsSchema.safeParse(data);

        if (error) {
            // Return the very first Zod Validation error message 
            return { status: "ERROR", message: error.issues[0].message };
        }

        const { 
            name, 
            phone, 
            avatarUrl, 
            location, 
            dateOfBirth, 
            nationality, 
            gender,
            maritalStatus, 
            education, 
            experience, 
            websiteUrl, 
            biography, 
            resumeUrl, 
            resumeName, 
            resumeSize,
        } = validatedData;
         await db.transaction(async (tx) => {
            // 1. Update the user's table
            await tx 
                .update(users)
                .set({
                    name, 
                    phone, 
                    avatarUrl,
                })
                .where(eq(users.id, user.id));

            // 2. UPSERT APPLICANTS TABLE
            const existingApplicant = await tx
                .select()
                .from(applicants)
                .where(eq(applicants.id, user.id))
                .limit(1);

            const applicantData = {
                location,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                nationality,
                gender,
                maritalStatus,
                education,
                experience,
                websiteUrl,
                biography,
            };

            if (existingApplicant.length > 0) {
                // Record exists, UPDATE
                await tx
                .update(applicants)
                .set(applicantData)
                .where(eq(applicants.id, user.id));
            } else {
                // No record, INSERT
                 await tx.insert(applicants).values({
                id: user.id, // Foregin key & Primary key
                ...applicantData,
            });
            }

            // 3. UPSERT RESUMES TABLE
            if (resumeName && resumeUrl) {

                const existingResume = await tx
                    .select()
                    .from(resumes)
                    .where(eq(resumes.applicantId, user.id))
                    .limit(1);

                const resumeData = {
                    fileUrl: resumeUrl,
                    fileName: resumeName,
                    fileSize: resumeSize,
                    isPrimary: true,
                };

                if (existingResume.length > 0) {
                    // Update the specific resume ID that we found

                    await tx
                    .update(resumes)
                    .set(resumeData)
                    .where(eq(resumes.id, existingResume[0].id));
                } else {
                    // Insert a new resume

                    await tx.insert(resumes).values({
                    applicantId: user.id,
                    ...resumeData,
                });
                }
            }
         });

         // Refresh the page so that pre-filled data updates immediately
         revalidatePath("/dashboard/settings");
         
         return { status: "SUCCESS", message: "Profile created successfully!" };
    } catch (error) {
        console.error("CREATE PROFILE ERROR:", error);
        return { status: "ERROR", message: "Failed to create profile." };
    }
};

