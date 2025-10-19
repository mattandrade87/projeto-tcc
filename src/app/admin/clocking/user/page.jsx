"use client";
import { useState } from "react";
import { ClockingAPI } from "@/services/api";
import Loader from "@/app/ui/Loader.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { Title } from "@/app/main-page/components";

export default function ClockingByUserPage() {
  const [userId, setUserId] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const load = async (e) => {
    e?.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      const data = await ClockingAPI.getByUser(userId);
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      toast.show(e?.message || "Erro ao carregar pontos", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl">
        <div className="mb-4 text-center">
          <Title>Pontos por Usuário</Title>
        </div>
        <form onSubmit={load} className="flex items-center gap-3 mb-4">
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="ID do usuário"
            className="px-3 py-2 border rounded w-64"
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Buscar
          </button>
        </form>
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
                  <Th>Fim</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((r, idx) => (
                  <tr key={idx} className="border-t">
                    <Td>
                      {r.date ? new Date(r.date).toLocaleDateString() : ""}
                    </Td>
                    <Td>
                      {r.startWork
                        ? new Date(r.startWork).toLocaleTimeString()
                        : "--"}
                    </Td>
                    <Td>
                      {r.endWork
                        ? new Date(r.endWork).toLocaleTimeString()
                        : "--"}
                    </Td>
                    <Td>{r.status}</Td>
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
