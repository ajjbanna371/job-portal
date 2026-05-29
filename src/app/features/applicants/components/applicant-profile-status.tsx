import { Button } from "@/components/ui/button";
import { ArrowRight, UserCircle } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "../../auth/server/auth.queries";
import { redirect } from "next/navigation";
import { getApplicantProfileData } from "../server/applicant.queries";

export async function ApplicantProfileStatus() {
  // You can add logic here to determine if the applicant's profile is complete or not.

  const user = await getCurrentUser();
  if (!user) return redirect("/login");

  const profileData = await getApplicantProfileData(user.id);

  const isCompleted = !!(
    profileData?.location &&
    profileData?.biography &&
    profileData?.experience &&
    profileData?.resumeUrl
  );

  if (isCompleted) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-red-500 p-6 text-white shadow-md">
      {/* Decorative Circle (Optional visual flair) */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute right-20 bottom-[-50px] h-24 w-24 rounded-full bg-white/10" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-400">
            <UserCircle className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Your profile editing is not complete yet!
            </h3>
            <p className="text-sm mt-1 text-red-100">
              Please complete all required fields to ensure your profile is
              fully updated.
            </p>
          </div>
        </div>

        <Link href="/dashboard/settings">
          <Button
            size="sm"
            variant="secondary"
            className="whitespace-nowrap bg-white text-red-600 hover:bg-gray-100 font-semibold cursor-pointer"
          >
            Edit Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}


