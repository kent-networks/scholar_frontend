"use client";

import { Download, Eye } from "lucide-react";

interface DocumentCardProps {
  document: {
    id: number;
    title: string;
    subject: string;
    year: number;
    institution: string;
    author: string;
  };
}

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all hover:border-primary/50">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {document.title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
            {document.subject}
          </span>
          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded">
            {document.year}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{document.institution}</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">By {document.author}</p>
      </div>
      <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button className="flex-1 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2">
          <Eye className="h-4 w-4" />
          View
        </button>
        <button className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  );
}

