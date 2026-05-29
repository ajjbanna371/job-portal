// "use client";

// import {
//   Briefcase,
//   Bookmark,
//   LayoutDashboard,
//   Search,
//   Settings,
//   LogOut,
// } from "lucide-react";
// import Link from "next/link";
// import { logoutUserAction } from "../../auth/server/auth.actions";
// import { cn } from "@/lib/utils";
// import { usePathname } from "next/navigation";

// // Base URL set
// const base = "/dashboard";

// // Applicant specific navigation items
// const applicantNavItems = [
//   { name: "Home", icon: LayoutDashboard, href: base + "/" },
//   { name: "Find Jobs", icon: Search, href: base + "/find-jobs" },
//   { name: "Applied", icon: Briefcase, href: base + "/application" },
//   { name: "Saved Jobs", icon: Bookmark, href: base + "/saved-jobs" },
//   { name: "Settings", icon: Settings, href: base + "/settings" },
// ];

// // handleLogout Button
// const handleLogout = async () => {
//   await logoutUserAction();
// };

// // to check the link of the matching sidebar
// function isLinkActive({
//   href,
//   pathname,
//   base = "/",
// }: {
//   href: string;
//   pathname: string;
//   base?: string;
// }) {
//   //   // Safety check: URLPattern might not exist in all environments (SSR),
//   //   // but since we are using it in EmployerSidebar, we keep it here
//   //   try {
//   //     const normalizedHref = href.replace(/\/$/, "") || "/";
//   //     const pattern = new URLPattern({
//   //       pathname: normalizedHref === base ? base : `${normalizedHref}{/*}?`,
//   //     });

//   //     return pattern.test({ pathname });
//   //   } catch (error) {
//   //     // Fallback agar URLPattern fail ho (optional safety)
//   //     return pathname.startsWith(href);
//   //   }
//   if (!href) return false;

//   const normalizedHref = href.replace(/\/$/, "") || "/";
//   const normalizedPath = pathname.replace(/\/$/, "") || "/";

//   // exact match
//   if (normalizedPath === normalizedHref) return true;

//   // nested routes (like /settings/profile)
//   if (
//     normalizedHref !== base &&
//     normalizedPath.startsWith(normalizedHref + "/")
//   ) {
//     return true;
//   }

//   // base route match
//   if (normalizedHref === base && normalizedPath === base) {
//     return true;
//   }

//   return false;
// }

// const ApplicantSidebar = () => {
//   const pathname = usePathname();

//   return (
//     <div className="w-64 bg-card border-r border-border fixed bottom-0 top-0">
//       <div className="p-6">
//         <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
//           Applicant Dashboard
//         </h2>
//       </div>

//       <nav className="px-3 space-y-1">
//         {applicantNavItems.map((curNav) => {
//           const Icon = curNav.icon;

//           return (
//             <Link
//               key={curNav.name}
//               href={curNav.href || "#"}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
//                 isLinkActive({
//                   href: curNav.href || "#",
//                   pathname,
//                   base: "/dashboard",
//                 })
//                   ? "text-primary bg-blue-300/20" // Note: bg-blue-300 might be too dark, added opacity or stick to your calss
//                   : "text-muted-foreground hover:text-foreground hover:bg-accent",
//               )}
//             >
//               <Icon className="w-4 h-4" />
//               {curNav.name}
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="absolute bottom-6 left-3 right-3">
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full"
//         >
//           <LogOut className="h-4 w-4" />
//           Log-out
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ApplicantSidebar;

"use client";

import { LogOut } from "lucide-react";
import { logoutUserAction } from "../../auth/server/auth.actions";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { applicantNavItems } from "@/config/constant";
import { isActiveLink } from "@/lib/navigation-utils";

// handleLogout Button
const handleLogout = async () => {
  await logoutUserAction();
};

const ApplicantSidebar = () => {
 const pathname = usePathname();
 console.log("pathname: ", pathname);

  return (
    <div className="w-64 bg-card border-r border-border fixed bottom-0 top-0">
      <div className="p-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Applicant Dashboard
        </h2>
      </div>

      <nav className="px-3 space-y-1">
        {applicantNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActiveLink(pathname, item.href, item.exact);

          console.log("pathname:  item.href ", item.href);

          return (
            <Link
              key={item.name}
              href={item.href || "#"}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                active
                  ? "text-primary bg-primary/10" // Note: bg-blue-300 might be too dark, added opacity or stick to your calss
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-3 right-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Log-out
        </button>
      </div>
    </div>
  );
};

export default ApplicantSidebar;
