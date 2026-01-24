"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import ModalDialog from "@/components/ModalDialog";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/research-lab");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to login. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Scholar account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full py-3 pl-10 pr-4 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
              className="w-full py-3 pl-10 pr-12 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Enter your password"
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

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setForgotPasswordOpen(true)}
            className="text-sm font-bold text-primary hover:text-primary-dark"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 font-bold text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-center text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link href="/signup" className="font-bold text-primary hover:text-primary-dark">
            Create account
          </Link>
        </p>
      </form>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </AuthLayout>
  );
}

// Forgot Password Modal Component
function ForgotPasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.data.success) {
        toast.success("OTP sent to your email!");
        setStep("otp");
      } else {
        setError(response.data.message || "Failed to send OTP");
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
      toast.error(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      if (response.data.success) {
        toast.success("OTP verified!");
        setStep("reset");
      } else {
        setError(response.data.message || "Invalid OTP");
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify OTP. Please try again.");
      toast.error(err.response?.data?.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/reset-password", { email, otp, password });
      if (response.data.success) {
        toast.success("Password reset successfully!");
        onClose();
        setStep("email");
        setEmail("");
        setOtp("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.message || "Failed to reset password");
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
      toast.error(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={handleClose} title="Reset Password" width="md">
      <div className="space-y-4">
        {step === "email" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="you@example.com"
              />
            </div>
            {error && (
              <div className="p-3 text-sm text-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 font-bold text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter the OTP sent to {email}
            </p>
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-900 dark:text-white">
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="000000"
              />
            </div>
            {error && (
              <div className="p-3 text-sm text-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="flex-1 px-6 py-3 font-bold transition-colors border rounded-lg border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="flex-1 px-6 py-3 font-bold text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter your new password
            </p>
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-900 dark:text-white">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-900 dark:text-white">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="Confirm new password"
              />
            </div>
            {error && (
              <div className="p-3 text-sm text-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("otp")}
                className="flex-1 px-6 py-3 font-bold transition-colors border rounded-lg border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading || password !== confirmPassword || password.length < 6}
                className="flex-1 px-6 py-3 font-bold text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </ModalDialog>
  );
}
