"use client";
import { useEffect, useState } from "react";
import { ClockingAPI } from "@/services/api";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/context/ToastContext.jsx";
import { Title } from "@/app/main-page/components";

export default function HistoricoPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await ClockingAPI.getHistory();
        setItems(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        toast.show(e?.message || "Erro ao carregar histórico", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="mb-4 text-center">
          <Title>Histórico de Pontos</Title>
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
                    <Td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          row.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : row.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : row.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }`}
                      >
                        {row.status === "PENDING"
                          ? "PENDENTE"
                          : row.status === "APPROVED"
                          ? "APROVADO"
                          : row.status === "REJECTED"
                          ? "REJEITADO"
                          : row.status || "--"}
                      </span>
                    </Td>
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
    return v ? new Date(v).toLocaleTimeString("pt-BR") : "--:--:--";
  } catch {
    return "--:--:--";
  }
}
function formatDate(v) {
  try {
    return v ? new Date(v).toLocaleDateString("pt-BR") : "--/--/----";
  } catch {
    return "--/--/----";
  }
}
