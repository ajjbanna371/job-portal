import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/features/auth/server/auth.queries";
import ApplicantSidebar from "@/app/features/applicants/components/applicants-sidebar";


export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }

  if (user.role !== "applicant") {
    return redirect("/employer-dashboard");
  }
  return(
    <div className="flex main-h-screen bg-background">
        <ApplicantSidebar />
      <main className="container mx-auto mt-5 ml-70 mr-5">{children}</main>
    </div>
  );
}
