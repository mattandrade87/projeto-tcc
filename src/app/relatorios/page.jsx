"use client";

import { useEffect, useState } from "react";
import { ClockingAPI } from "@/services/api";
import Loader from "@/components/ui/Loader";
import BackButton from "@/components/ui/BackButton";
import { useToast } from "@/context/ToastContext.jsx";
import { Title } from "@/app/main-page/components";

export default function Relatorios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await ClockingAPI.getHistory();
        setItems(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        toast.show(e?.message || "Erro ao carregar relatórios", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <BackButton />
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1 text-center">
            <Title>Relatórios de Ponto</Title>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full border rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <Th>Data</Th>
                  <Th>Início</Th>
                  <Th>Início Almoço</Th>
                  <Th>Fim Almoço</Th>
                  <Th>Fim</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    <Td>{formatDate(row.date || row.startWork)}</Td>
                    <Td>{formatTime(row.startWork)}</Td>
                    <Td>{formatTime(row.startLunch)}</Td>
                    <Td>{formatTime(row.endLunch)}</Td>
                    <Td>{formatTime(row.endWork)}</Td>
                    <Td>{row.status || ""}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-2 text-sm font-semibold text-gray-700">
      {children}
    </th>
  );
}
function Td({ children }) {
  return <td className="px-4 py-2 text-sm">{children}</td>;
}
function formatTime(v) {
  try {
    return v ? new Date(v).toLocaleTimeString() : "--:--";
  } catch {
    return "--:--";
  }
}
function formatDate(v) {
  try {
    return v ? new Date(v).toLocaleDateString() : "--/--/----";
  } catch {
    return "--/--/----";
  }
}
