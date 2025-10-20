"use client";

import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <button
      type="button"
      aria-label="Voltar"
      onClick={() => window.history.back()}
      className="flex items-center gap-2 px-2 py-2  border border-gray-200 rounded-xl  hover:bg-indigo-50 cursor-pointer text-indigo-600 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-300"
    >
      <ArrowLeft className="w-4 h-4" strokeWidth={2.2} />
    </button>
  );
}
