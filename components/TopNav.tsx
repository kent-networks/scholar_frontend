"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { mockLoggedIn } from "@/lib/mockState";

const navItems = [
  { name: "Ecosystem", href: "/ecosystem" },
  { name: "For Students", href: "/for-students" },
  { name: "For Educators", href: "/for-educators" },
  { name: "Community", href: "/community" },
];

export default function TopNav() {
  const pathname = usePathname();
  const isLoggedIn = mockLoggedIn;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">Scholar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href || pathname?.startsWith(item.href + "/")
                    ? "text-primary"
                    : "text-slate-700 dark:text-slate-300 hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/account"
                className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
              >
                Account
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                >
                  Join Scholar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

