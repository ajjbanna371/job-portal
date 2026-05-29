import { getCurrentEmployerDetails } from "@/app/features/auth/server/employers.queries";
import EmployerSettingsForm from "@/app/features/employers/components/employer-settings-form";
import { EmployerProfileData } from "@/app/features/employers/employers.schema";
import { redirect } from "next/navigation";


const EmployerSettings = async () => {
    const employer = await getCurrentEmployerDetails();
      if (!employer) return redirect("/login");

      console.log("currentEmployer:", employer);


    return (
        <div>
            <EmployerSettingsForm  initialData= {{
                name: employer.employerDetails.name,
                description: employer.employerDetails.description,
                organizationType: employer.employerDetails.organizationType,
                teamSize: employer.employerDetails.teamSize,
                location: employer.employerDetails.location,
                websiteUrl: employer.employerDetails.websiteUrl,
                yearOfEstablishment: employer.employerDetails.yearOfEstablishment?.toString(),
                avatarUrl: employer.avatarUrl,
                bannerImageUrl: employer.employerDetails.bannerImageUrl,
            } as EmployerProfileData
            }/>
        </div>
    )
}

export default EmployerSettings;
