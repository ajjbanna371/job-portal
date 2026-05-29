// "use client";
import ApplicantSettingsForm from "@/app/features/applicants/components/applicant-settings-form";
import { getApplicantProfileData } from "@/app/features/applicants/server/applicant.queries";
import { getCurrentUser } from "@/app/features/auth/server/auth.queries";
import { redirect } from "next/navigation";


const ApplicantSettings = async () => {
  const user = await getCurrentUser();

  if (!user) return redirect("/login");

  const initialData = await getApplicantProfileData(user.id);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8 py-8">
        {/* Header */}
        <div>
            <h2 className="text-2xl font-bold tracking-tight"> Applicant Profile Settings Form </h2>
            <p className="text-muted-foreground"> Manage your personal information and professional profile. </p>
        </div>
      <ApplicantSettingsForm initialData={initialData} />
    </div>
  );
};

export default ApplicantSettings;
