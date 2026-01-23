"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle, Phone, MapPin } from "lucide-react";
import { contactApi } from "@/lib/api/contact";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactApi.submit(formData);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-slate-50/50 dark:from-background-dark dark:to-slate-950/50">
      <TopNav />

      <main className="max-w-6xl px-5 py-16 mx-auto sm:px-6 lg:px-8 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-slate-900 dark:text-white">
            Get in Touch
          </h1>
          <p className="max-w-2xl mx-auto mt-5 text-lg sm:text-xl text-slate-600 dark:text-slate-300">
            Have a question, idea, or just want to say hi? We'd love to hear from you.
          </p>
        </motion.div>
        
        <div className="flex items-center justify-center w-full">
          
          <div className="grid w-full max-w-3xl gap-10">
            {/* Contact Form – takes more space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className=""
            >
              <div className="border shadow-sm bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/40 rounded-2xl p-7 md:p-9">
                {isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
                    <h3 className="mb-3 text-2xl font-semibold text-slate-800 dark:text-slate-100">
                      Thank You!
                    </h3>
                    <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                      Your message has been sent successfully.<br />
                      We'll get back to you as soon as possible.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="font-medium transition-colors text-primary hover:text-primary-dark"
                    >
                      Send another message →
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-7">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Name */}
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 pt-6 pb-2 placeholder-transparent bg-transparent border border-slate-300/70 dark:border-slate-600/50 rounded-lg peer
                          text-slate-900 dark:text-white
                          focus:outline-none focus:border-primary
                          focus:ring-1 focus:ring-primary/40
                          transition-[border-color,box-shadow]"
                        placeholder=" "
                        />
                        <label
                          htmlFor="name"
                          className="absolute text-sm font-medium transition-all pointer-events-none left-4 top-2 text-slate-500 dark:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-primary"
                        >
                          Name <label className="text-red-400">*</label>
                        </label>
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 pt-6 pb-2 placeholder-transparent transition-[border-color,box-shadow] duration-200 bg-transparent border rounded-lg peer border-slate-300/70 dark:border-slate-600/50 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                          placeholder=" "
                        />
                        <label
                          htmlFor="email"
                          className="absolute text-sm font-medium transition-all pointer-events-none left-4 top-2 text-slate-500 dark:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-primary"
                        >
                          Email <label className="text-red-400">*</label>
                        </label>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 pt-6 pb-2 placeholder-transparent transition-[border-color,box-shadow] duration-200 bg-transparent border rounded-lg peer border-slate-300/70 dark:border-slate-600/50 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                        placeholder=" "
                      />
                      <label
                        htmlFor="subject"
                        className="absolute text-sm font-medium transition-all pointer-events-none left-4 top-2 text-slate-500 dark:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-primary"
                      >
                        Subject <label className="text-red-400">*</label>
                      </label>
                    </div>

                    {/* Message */}
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 pt-6 pb-2 placeholder-transparent transition-[border-color,box-shadow] duration-200 bg-transparent border rounded-lg resize-none peer border-slate-300/70 dark:border-slate-600/50 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                        placeholder=" "
                      />
                      <label
                        htmlFor="message"
                        className="absolute text-sm font-medium transition-all pointer-events-none left-4 top-2 text-slate-500 dark:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-primary"
                      >
                        Message <label className="text-red-400">*</label>
                      </label>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-white bg-primary hover:bg-primary-dark disabled:opacity-60 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}