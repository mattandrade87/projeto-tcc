"use client";
import { useEffect, useState } from "react";
import { ClockingAPI } from "@/services/api";
import Loader from "@/app/ui/Loader.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { Title } from "@/app/main-page/components";

export default function ClockingByStatusPage() {
  const [status, setStatus] = useState("PENDING");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await ClockingAPI.getByStatus(status);
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      toast.show(e?.message || "Erro ao carregar pontos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const act = async (fn, id) => {
    setActing(true);
    try {
      await fn(id);
      toast.show("Atualizado", "success");
      await load();
    } catch (e) {
      toast.show(e?.message || "Falha na operação", "error");
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl">
        <div className="mb-4 text-center">
          <Title>Pontos por Status</Title>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm">Status:</label>
          <select
            className="px-3 py-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <button
            onClick={load}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Atualizar
          </button>
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
                  <Th>ID</Th>
                  <Th>Usuário</Th>
                  <Th>Data</Th>
                  <Th>Início</Th>
                  <Th>Fim</Th>
                  <Th>Status</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id} className="border-t">
                    <Td>{r.id}</Td>
                    <Td>{r.user?.name || r.userId}</Td>
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
                    <Td>
                      <div className="flex gap-2">
                        <button
                          disabled={acting}
                          onClick={() => act(ClockingAPI.approve, r.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          Aprovar
                        </button>
                        <button
                          disabled={acting}
                          onClick={() => act(ClockingAPI.reject, r.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          Reprovar
                        </button>
                      </div>
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
