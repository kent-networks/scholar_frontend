"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { adminCreateApi } from "@/lib/api/admin-create";

type UserType = "student" | "educator" | "creator" | null;

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [userType, setUserType] = useState<UserType>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdminCreateMode = searchParams.get("role") === "admin";

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !isAdminCreateMode) {
      router.push("/");
    }
  }, [isAuthenticated, isAdminCreateMode, router]);

  // Guard admin-create mode (must be logged-in global admin)
  useEffect(() => {
    if (!isAdminCreateMode) return;
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if ((user?.role || "") !== "admin") {
      router.push("/signup");
    }
  }, [isAdminCreateMode, authLoading, isAuthenticated, user?.role, router]);

  const userTypes = [
    {
      id: "student" as const,
      label: "Student",
      icon: GraduationCap,
      description: "Learn and explore research",
    },
    {
      id: "educator" as const,
      label: "Educator",
      icon: BookOpen,
      description: "Teach and share knowledge",
    },
    {
      id: "creator" as const,
      label: "Creator",
      icon: Sparkles,
      description: "Create educational content",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminCreateMode) {
      setError("");
      setIsLoading(true);
      try {
        const created = await adminCreateApi.createAdminUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        toast.success(`Admin created (@${created.username})`);
        router.push("/admin");
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || "Failed to create admin user.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!userType) return;
    setError("");
    setIsLoading(true);

    try {
      await register({
        email,
        password,
        name,
        role: userType,
      });
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={isAdminCreateMode ? "Create an admin user" : "Create your account"}
      subtitle={
        isAdminCreateMode
          ? "System-level admin creation (admins only)"
          : "Join Bwati as a Student, Educator, or Creator"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isAdminCreateMode && (
          <div>
            <label className="block mb-3 text-sm font-bold text-slate-900 dark:text-white">
              I want to join as
            </label>
            <div className="grid grid-cols-1 gap-3">
              {userTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setUserType(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      userType === type.id
                        ? "border-primary bg-primary/10"
                        : "border-slate-300 dark:border-slate-700 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          userType === type.id
                            ? "bg-primary text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{type.label}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{type.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-bold text-slate-900 dark:text-white">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 pl-10 pr-4 py-3.5 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all disabled:opacity-60"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-bold text-slate-900 dark:text-white">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 pl-10 pr-4 py-3.5 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all disabled:opacity-60"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-bold text-slate-900 dark:text-white">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 pl-10 pr-12 py-3.5 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all disabled:opacity-60"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
{/* 
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            required
            className="w-4 h-4 mt-1 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary/50"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label> */}

        <button
          type="submit"
          disabled={isLoading || (!isAdminCreateMode && !userType)}
          className="w-full px-6 py-3 font-bold text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Please wait..." : isAdminCreateMode ? "Create admin user" : "Create account"}
        </button>

        {!isAdminCreateMode && (
          <p className="text-sm text-center text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        )}
      </form>
    </AuthLayout>
  );
}

