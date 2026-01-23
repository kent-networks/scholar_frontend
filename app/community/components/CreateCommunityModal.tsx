"use client";

import { useState } from "react";
import { X, Network, Globe, Lock } from "lucide-react";
import ModalDialog from "@/components/ModalDialog";
import Dropdown from "@/components/Dropdown";
import { communityApi, CreateCommunityData } from "@/lib/api/communities";
import toast from "react-hot-toast";

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const researchFieldOptions = [
  { value: "", label: "Select a field" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Physics", label: "Physics" },
  { value: "Biotechnology", label: "Biotechnology" },
  { value: "Social Sciences", label: "Social Sciences" },
  { value: "Environmental Science", label: "Environmental Science" },
  { value: "Other", label: "Other" },
];

export default function CreateCommunityModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCommunityModalProps) {
  const [formData, setFormData] = useState<CreateCommunityData>({
    name: "",
    description: "",
    researchField: "",
    privacy: "public",
    restrictInvitations: false,
    moderateContent: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [otherField, setOtherField] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "description") {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        researchField: formData.researchField === "Other" ? otherField : formData.researchField,
      };
      await communityApi.createCommunity(submitData);
      toast.success("Community created successfully!");
      onSuccess();
      // Reset form
      setFormData({
        name: "",
        description: "",
        researchField: "",
        privacy: "public",
        restrictInvitations: false,
        moderateContent: true,
      });
      setOtherField("");
      setCharCount(0);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create community");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title=""
      width="lg"
    >
      <div className="space-y-6">
        {/* Custom Header */}
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Create Research Community
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Establish a new space for academic collaboration and knowledge sharing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Icon Section */}
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center w-24 overflow-hidden border-2 border-dashed bg-primary/10 border-primary/30 rounded-xl min-h-24 group">
              <Network className="w-12 h-12 text-primary" />
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-lg font-bold leading-tight text-slate-900 dark:text-white">
                Community Identity
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                A custom emblem will be generated based on your research field.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Community Name */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Community Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="flex w-full h-12 px-4 text-base font-normal leading-normal transition-all bg-white border rounded-xl border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white dark:bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g. Quantum Computing Research Group"
              />
            </div>

            {/* Research Field Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Research Field
              </label>
              <Dropdown
                options={researchFieldOptions}
                value={formData.researchField || ""}
                onChange={(e) => {
                  const value = typeof e === "string" ? e : e.target.value;
                  setFormData((prev) => ({ ...prev, researchField: value }));
                  if (value !== "Other") {
                    setOtherField("");
                  }
                }}
                placeholder="Select a field"
                className="h-12"
              />
              {formData.researchField === "Other" && (
                <input
                  type="text"
                  value={otherField}
                  onChange={(e) => setOtherField(e.target.value)}
                  placeholder="Enter research field..."
                  className="flex w-full h-12 px-4 text-base font-normal leading-normal transition-all bg-white border rounded-xl border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white dark:bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            </div>

            {/* Privacy Setting */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Privacy Setting
              </label>
              <div className="flex h-12 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, privacy: "public" }))}
                  className={`flex-1 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    formData.privacy === "public"
                      ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, privacy: "private" }))}
                  className={`flex-1 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    formData.privacy === "private"
                      ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  Private
                </button>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">
                  Description
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-500">
                  {charCount} / 250 characters
                </span>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={250}
                className="flex w-full p-4 text-base font-normal leading-normal transition-all bg-white border resize-none rounded-xl border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white dark:bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Describe the purpose, scope, and goals of this research community..."
                rows={4}
              />
            </div>
          </div>
          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-xl h-11 px-5 bg-transparent text-slate-900 dark:text-white text-sm font-bold transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-11 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Community"}
            </button>
          </div>
        </form>
      </div>
    </ModalDialog>
  );
}

