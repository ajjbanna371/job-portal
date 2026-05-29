import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/features/auth/server/auth.queries";
import EmployerSidebar from "@/app/features/employers/components/employers-sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  // console.log("Current User:", user);

  if (!user) {
    return redirect("/login");
  }

  if (user.role !== "employer") {
    return redirect("/dashboard");
  }
  return(
    <div className="flex main-h-screen bg-background">
      <EmployerSidebar />
      <main className="container mx-auto mt-5 ml-70 mr-5">{children}</main>

    </div>
  );
}
