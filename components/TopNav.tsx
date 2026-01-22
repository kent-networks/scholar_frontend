"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Ecosystem", href: "/ecosystem" },
  { name: "For Students", href: "/for-students" },
  { name: "For Educators", href: "/for-educators" },
  { name: "Community", href: "/community" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">Scholar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-8 md:flex">
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

          {/* Desktop Auth Buttons */}
          <div className="items-center hidden gap-4 md:flex">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold transition-colors text-slate-700 dark:text-slate-300 hover:text-primary"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-4 text-sm font-bold text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark"
            >
              Join Scholar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 transition-colors rounded-lg md:hidden text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white border-t md:hidden dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors ${
                    pathname === item.href || pathname?.startsWith(item.href + "/")
                      ? "text-primary"
                      : "text-slate-700 dark:text-slate-300 hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-2 text-sm font-bold text-center transition-colors text-slate-700 dark:text-slate-300 hover:text-primary"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-sm font-bold text-center text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark"
                >
                  Join Scholar
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

