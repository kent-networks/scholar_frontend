"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import { ArrowLeft, Send, Search } from "lucide-react";
import { messageApi, Message } from "@/lib/api/messages";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function InboxPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const recipientUserId = params.id ? parseInt(params.id as string, 10) : null;
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation
  useEffect(() => {
    const fetchData = async () => {
      if (!recipientUserId || !isAuthenticated) {
        if (!isAuthenticated) {
          router.push("/login");
        }
        return;
      }

      try {
        setLoading(true);
        const conversationMessages = await messageApi.getConversation(recipientUserId);
        setMessages(conversationMessages);
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/login");
        } else {
          toast.error(error.response?.data?.message || "Failed to load conversation");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recipientUserId, isAuthenticated, router]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !recipientUserId || !isAuthenticated) {
      if (!isAuthenticated) {
        router.push("/login");
      }
      return;
    }

    const messageText = message.trim();
    setMessage("");

    // Optimistic update
    const optimisticMessage: Message = {
      id: Date.now(), // Temporary ID
      senderId: user!.id,
      recipientId: recipientUserId,
      content: messageText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      setSending(true);
      const sentMessage = await messageApi.sendMessage(recipientUserId, messageText);
      
      // Replace optimistic message with real one
      setMessages((prev) => 
        prev.map((m) => 
          m.id === optimisticMessage.id ? sentMessage : m
        )
      );
    } catch (error: any) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex items-center justify-center flex-1">
          <div className="w-8 h-8 border-4 rounded-full border-primary/30 border-t-primary animate-spin" />
        </main>
      </div>
    );
  }

  // Get recipient info from messages
  const recipientInfo = messages.length > 0
    ? (messages.find((m) => m.senderId !== user?.id) || messages[0])
    : null;

  const recipientName = recipientInfo 
    ? (recipientInfo.senderId === user?.id ? recipientInfo.recipientName : recipientInfo.senderName) || "User"
    : "User";
  const recipientPhoto = recipientInfo
    ? (recipientInfo.senderId === user?.id ? recipientInfo.recipientPhoto : recipientInfo.senderPhoto)
    : undefined;

  // Format timestamp like "10:30 AM"
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4 px-4 py-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              {recipientPhoto ? (
                <img
                  src={recipientPhoto}
                  alt={recipientName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                  {recipientName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">{recipientName}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMe
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isMe ? "text-white/70" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1 px-4 py-3 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="p-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 pb-safe">
        <MobileBottomNav />
      </div>
    </div>
  );
}
