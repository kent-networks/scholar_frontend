"use client";

import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* Form Section */}
      <div className="relative flex items-center justify-center flex-1 p-4 md:p-8">
        {/* Background Image for Mobile */}
        <div className="absolute inset-0 lg:hidden">
          <img
            src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Education"
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/80" />
        </div>
        
        {/* White Card with Auth Info */}
        <div className="relative z-10 w-full max-w-md p-6 space-y-8 bg-white rounded-md dark:bg-slate-900 lg:bg-white lg:dark:bg-slate-900">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      {/* Right Side - Image with Overlay (Desktop only) */}
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Education"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/80" />
        <div className="relative z-10 flex items-center justify-center h-full p-12 text-white">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-4xl font-bold">Welcome to Scholar</h2>
            <p className="text-xl text-blue-100">
              Join thousands of students, educators, and creators building the future of education
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

