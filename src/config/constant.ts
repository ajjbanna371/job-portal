import type { LucideIcon } from "lucide-react";
import {
  Bookmark,
  Briefcase,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";

export const SESSIONS_LIFETIME = 30 * 24 * 60 * 60; // 30 days in seconds
export const SESSION_REFRESH_TIME = SESSIONS_LIFETIME / 2; // 7 days in seconds

// -------- employer-job-form ----------------- //
export const SALARY_CURRENCY = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "INR",
  "NPR",
] as const;

export const SALARY_PERIOD = ["hourly", "monthly", "yearly"] as const;

export const JOB_TYPE = ["remote", "hybrid", "on-site"] as const;

export const WORK_TYPE = [
  "full-time",
  "part-time",
  "contract",
  "temporary",
  "freelance",
] as const;

export const JOB_LEVEL = [
  "internship",
  "entry level",
  "junior",
  "mid level",
  "senior level",
  "lead",
  "manager",
  "director",
  "executive",
] as const;

export const MIN_EDUCATION = [
  "none",
  "high school",
  "undergraduate",
  "masters",
  "phd",
] as const;

// -------- employer-job-form ----------------- //

// =====================================================
// NAVIGATION TYPES
// =====================================================
export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number | "dynamic";
}

// =====================================================
// APPLICANT DASHBOARD NAVIGATION
// =====================================================
/**
 * Applicant Dashboard Navigation Items
 * Based on folder structure: app/(applicants)/dashboard/
 */
export const applicantNavItems: NavItem[] = [
  {
    name: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true, // Exact match only for home
  },
  {
    name: "Find Jobs",
    href: "/jobs",
    icon: Search,
  },
  {
    name: "Applied",
    href: "/dashboard/applied-jobs",
    icon: Briefcase,
    badge: "dynamic", // will show count of applied jobs
  },
  {
    name: "Saved Jobs",
    href: "/dashboard/saved-jobs",
    icon: Bookmark,
    badge: "dynamic",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

// =====================================================
// EMPLOYER DASHBOARD NAVIGATION
// =====================================================
/**
 * Employer Dashboard Navigation Items
 * Based on folder structure: app/employer-dashboard/
 */

export const employerNavItems: NavItem[] = [
  {
    name: "Overview",
    href: "/employer-dashboard",
    icon: LayoutDashboard,
    exact: true, // Exact match for dashboard home
  },
  {
    name: "Applications",
    href: "/employer-dashboard/applications",
    icon: User,
  },
  {
    name: "Post a Job",
    href: "/employer-dashboard/jobs/create",
    icon: Plus,
  },
  {
    name: "My Jobs",
    href: "/employer-dashboard/jobs",
    icon: Briefcase,
    exact: true,
    // Note: If your active link logic highlights "My Jobs" when you are on "/jobs/create",
    // you might need to add `exact: true` here depending on your navigation-utils setup!
  },
  {
    name: "Settings",
    href: "/employer-dashboard/settings",
    icon: Settings,
  },
];


// const employerNavItems = [
//   { name: "Overview", icon: LayoutDashboard, href: base + "/" },
//   { name: "Employers Profile", icon: User },
//   { name: "Post a Job", icon: Plus, href: base + "/jobs" },
//   { name: "My Jobs", icon: Briefcase, href: base + "/jobslist"},
//   { name: "Saved Candidate", icon: Bookmark },
//   { name: "Plans & Billing", icon: CreditCard },
//   { name: "All Companies", icon: Building },
//   { name: "Settings", icon: Settings, href: base + "/settings" },