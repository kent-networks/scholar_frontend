"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import { userApi } from "@/lib/api/users";

interface User {
  id: number;
  username: string;
  name: string;
  photo?: string | null;
}

interface UsersSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  type: "followers" | "following";
  title: string;
}

export default function UsersSidePanel({
  isOpen,
  onClose,
  userId,
  type,
  title,
}: UsersSidePanelProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      if (userId) {
        fetchUsers();
      }
    }
  }, [isOpen, userId, type]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (shouldRender) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = "";
      }
    };
  }, [shouldRender]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = type === "followers" 
        ? await userApi.getFollowers(userId)
        : await userApi.getFollowing(userId);
      setUsers(data);
    } catch (error: any) {
      console.error("Failed to load users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShouldRender(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const handleUserClick = (username: string) => {
    router.push(`/profile/${username}`);
    handleClose();
  };

  return (
    <AnimatePresence>
      {shouldRender && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
          />

          {/* Side Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-white dark:bg-slate-800 z-50 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {title} ({users.length})
              </h2>
              <button
                onClick={handleClose}
                className="p-2 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={1.5}/>
              </button>
            </div>

            {/* Users List */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {loading ? (
                <div className="py-12 text-center">
                  <div className="w-8 h-8 mx-auto border-4 rounded-full border-primary/30 border-t-primary animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="py-12 text-center">
                  <User className="w-12 h-12 mx-auto mb-3 text-slate-400" strokeWidth={1.5}/>
                  <p className="text-slate-500 dark:text-slate-400">
                    No {type === "followers" ? "followers" : "following"} yet.
                  </p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user.username)}
                    className="flex items-center gap-3 p-3 transition-colors rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="flex-shrink-0 object-cover w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-white rounded-full bg-primary">
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs truncate text-slate-500 dark:text-slate-400">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

