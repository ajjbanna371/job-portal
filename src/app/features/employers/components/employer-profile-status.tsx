import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldAlertIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentEmployerDetails } from "../../auth/server/employers.queries";

export async function EmployerProfileCompletionStatus() {
  const currentEmployer = await getCurrentEmployerDetails();

  if (!currentEmployer) return redirect("/login");

  if (currentEmployer.isProfileCompleted) return null;

  return (
    <div className="flex flex-col gap-6">

      <div className="relative overflow-hidden rounded-xl bg-red-500 p-6 text-white shadow-sm">
      {/* Decorative Circle (Optional visual flair) */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute right-20 bottom-[-50px] h-24 w-24 rounded-full bg-white/10" /> 

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-400">
            <ShieldAlertIcon className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Incomplete Profile
            </h3>
            <p className="text-sm mt-1 text-red-100">
              You haven't completed your employer profile yet. please complete
            your profile to post jobs and access all features.
            </p>
          </div>
        </div>

      <Link href="/employer-dashboard/settings">
          <Button size="sm" variant="secondary" className="whitespace-nowrap bg-white text-red-600 hover:bg-gray-100 font-semibold cursor-pointer">
            Complete Profile 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>


      </div>
    </div>
    </div>
  );
}
