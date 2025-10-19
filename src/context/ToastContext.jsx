"use client";

import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = "info", timeout = 3500) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (timeout) setTimeout(() => dismiss(id), timeout);
  };

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const value = useMemo(() => ({ show, dismiss }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded shadow text-white ${
              t.type === "success"
                ? "bg-green-600"
                : t.type === "error"
                ? "bg-red-600"
                : t.type === "warning"
                ? "bg-yellow-600"
                : "bg-gray-800"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
