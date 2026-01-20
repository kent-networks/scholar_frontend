"use client";

import { useState } from "react";
import Sidebar, { MobileBottomNav } from "@/components/Sidebar";
import DocumentCard from "./components/DocumentCard";
import FilterDropdown from "./components/FilterDropdown";
import ModalDialog from "@/components/ModalDialog";
import { mockLoggedIn } from "@/lib/mockState";
import { Plus, Search, UploadCloud } from "lucide-react";

const mockDocuments = [
  {
    id: 1,
    title: "Advanced Quantum Computing Algorithms",
    subject: "Computer Science",
    year: 2024,
    institution: "MIT",
    author: "Dr. Sarah Chen",
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions",
    subject: "Environmental Science",
    year: 2023,
    institution: "Stanford University",
    author: "Prof. Michael Johnson",
  },
  {
    id: 3,
    title: "AI-Powered Medical Diagnostics",
    subject: "Artificial Intelligence",
    year: 2024,
    institution: "Harvard Medical School",
    author: "Dr. Emily Rodriguez",
  },
  {
    id: 4,
    title: "Climate Change Impact Analysis",
    subject: "Climate Science",
    year: 2023,
    institution: "UC Berkeley",
    author: "Dr. Lisa Anderson",
  },
  {
    id: 5,
    title: "Biotechnology Innovations",
    subject: "Biotechnology",
    year: 2024,
    institution: "Johns Hopkins",
    author: "Prof. James Wilson",
  },
  {
    id: 6,
    title: "Neural Network Optimization",
    subject: "Machine Learning",
    year: 2024,
    institution: "Carnegie Mellon",
    author: "Dr. David Kim",
  },
];

const subjects = ["All", "Computer Science", "Environmental Science", "AI", "Climate Science", "Biotechnology", "Machine Learning"];
const years = ["All", "2024", "2023", "2022", "2021"];
const institutions = ["All", "MIT", "Stanford", "Harvard", "UC Berkeley", "Johns Hopkins", "Carnegie Mellon"];

export default function ResearchLabPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedInstitution, setSelectedInstitution] = useState("All");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || doc.subject === selectedSubject;
    const matchesYear = selectedYear === "All" || doc.year.toString() === selectedYear;
    const matchesInstitution = selectedInstitution === "All" || doc.institution === selectedInstitution;
    
    return matchesSearch && matchesSubject && matchesYear && matchesInstitution;
  });

  const visibleDocuments = filteredDocuments.slice(0, visibleCount);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 pb-20 overflow-y-auto md:pb-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
              Research Lab
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Explore research documents and publications
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full py-3 pl-12 pr-4 transition-all bg-white border shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-4">
              <FilterDropdown
                label="Subject"
                value={selectedSubject}
                options={subjects}
                onChange={setSelectedSubject}
              />
              <FilterDropdown
                label="Year"
                value={selectedYear}
                options={years}
                onChange={setSelectedYear}
              />
              <FilterDropdown
                label="Institution"
                value={selectedInstitution}
                options={institutions}
                onChange={setSelectedInstitution}
              />

              {/* Upload Button - only visible if logged in */}
              {mockLoggedIn && (
                <button
                  onClick={() => setUploadOpen(true)}
                  className="flex items-center gap-2 px-5 py-2 font-bold text-white transition-colors rounded-lg shadow-sm bg-primary hover:bg-primary-dark shadow-primary/30"
                >
                  <UploadCloud className="h-4 w-4" />
                  Upload
                </button>
              )}
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">No documents found</p>
            </div>
          )}

          {/* Load more */}
          {filteredDocuments.length > visibleCount && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((c) => c + 6)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-border-light bg-surface-light hover:bg-slate-100 transition-colors font-bold text-slate-900"
              >
                <Plus className="h-4 w-4" />
                Load more
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg md:hidden bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 safe-area-inset-bottom">
        <MobileBottomNav />
      </div>

      {/* Upload modal */}
      <ModalDialog
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload document"
        width="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border-light bg-surface-light">
            <p className="text-sm font-bold text-slate-900 mb-1">Choose a file</p>
            <p className="text-xs text-slate-500 mb-3">
              (Mock) This will not upload anywhere yet.
            </p>
            <input type="file" className="w-full" />
          </div>
          <button
            onClick={() => setUploadOpen(false)}
            className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors"
          >
            Upload
          </button>
        </div>
      </ModalDialog>
    </div>
  );
}
