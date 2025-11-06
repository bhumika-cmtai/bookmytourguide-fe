"use client";

import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { User } from "@/types/auth";
import { usePathname } from "next/navigation";

const generateTitle = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) return "Dashboard";

  const title = segments[segments.length - 1];
  return title.charAt(0).toUpperCase() + title.slice(1).replace("-", " ");
};

export default function Header({
  onMenuClick,
  user,
}: {
  onMenuClick?: () => void;
  user: User | null;
}) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const title = generateTitle(pathname);

  // Get first name from full name
  const getFirstName = (fullName: string | undefined) => {
    if (!fullName) return "User";
    return fullName.split(" ")[0];
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white dark:bg-slate-900 dark:border-slate-800 px-8 py-4 md:px-16 shadow-sm">

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Welcome Message - Always Visible */}
        <div className="flex flex-col items-end">
          <span className="text-xl text-slate-500 dark:text-slate-400">
            Welcome back,
          </span>
          <span className="text-xl font-semibold text-slate-800 dark:text-slate-200 -mt-0.5">
            {getFirstName(user?.name)}
          </span>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => logout()}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 h-10"
        >
          <LogOut className="h-6 w-6 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
