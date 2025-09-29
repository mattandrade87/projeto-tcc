"use client";

export default function BackButton() {
  return (
    <button
      type="button"
      aria-label="Voltar"
      className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-700 rounded-full p-2 mb-4 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
      style={{
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => window.history.back()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}
