//* Route Groups in Next.js are a feature introduced to help you organize routes inside the app/ directory without affecting the actual URL structure. they are created by wrapping a folder name inside parentheses, for example:
//! aap/(auth)/login/page.js
//! aap/(dashboard)/users/page.js

// What Route Group Do
// 1. Organize your project without changing URLs

// 2. Apply different layouts to different sections
// Route Groups allow you to define multiple layouts inside a single Next.js project
// app/(auth)/layout.js.        -> used for login, register pages
// app/(dashboard)/layout.js    -> used for dashboard pages

// 3. Better code splitting a maintainability


import { ApplicantProfileStatus } from "@/app/features/applicants/components/applicant-profile-status";
import { StatsCards } from "@/app/features/applicants/components/applicant-stats";
import { RecentApplications } from "@/app/features/applicants/components/recent-applications";
import { getCurrentUser } from "@/app/features/auth/server/auth.queries";
import { redirect } from "next/navigation";

export default async function ApplicantDashboard() {
  const user = await getCurrentUser();
  console.log("Current User employer:", user);

  // Redirect to login if not logged in
  if (!user) return redirect("/login");
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Hello <span className="capitalize">{user?.name.toLowerCase()}</span>
        </h1>
        <p className="text-muted-foreground">
          Here is your daily activities and job alerts
        </p>
      </div>

    {/* 1. Stats Cards Row */}
    <StatsCards />

    {/* 2. Red Alert Banner (Profile Incomplete) */}
    <ApplicantProfileStatus />

    {/* 3. Recently Applied table */}
    <RecentApplications />
    </div>

  );
};

