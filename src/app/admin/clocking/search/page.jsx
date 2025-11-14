"use client";
import { useEffect, useState } from "react";
import { ClockingAPI, AdminAPI } from "@/services/api";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/context/ToastContext.jsx";
import { Title } from "@/app/main-page/components";
import { BackButton } from "@/components/ui";

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

export default function ClockingSearchPage() {
  const [status, setStatus] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState(false);
  const toast = useToast();

  // Load all users for the dropdown
  useEffect(() => {
    (async () => {
      try {
        const data = await AdminAPI.listUsers();
        setUsers(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        toast.show(e?.message || "Erro ao carregar usuários", "error");
      }
    })();
  }, []);

  const search = async (e) => {
    e?.preventDefault();

    if (!selectedUserId && !status) {
      toast.show("Selecione um usuário ou status para buscar", "error");
      return;
    }

    setLoading(true);
    try {
      let data = [];

      if (selectedUserId && status) {
        // Filter by both user and status
        const byStatus = await ClockingAPI.getByStatus(status);
        const allItems = Array.isArray(byStatus)
          ? byStatus
          : byStatus?.items || [];
        data = allItems.filter((item) => item.userId === selectedUserId);
      } else if (selectedUserId) {
        // Filter by user only
        const byUser = await ClockingAPI.getByUser(selectedUserId);
        data = Array.isArray(byUser) ? byUser : byUser?.items || [];
      } else if (status) {
        // Filter by status only
        const byStatus = await ClockingAPI.getByStatus(status);
        data = Array.isArray(byStatus) ? byStatus : byStatus?.items || [];
      }

      setItems(data);
    } catch (e) {
      toast.show(e?.message || "Erro ao buscar pontos", "error");
    } finally {
      setLoading(false);
    }
  };

  const act = async (fn, id) => {
    setActing(true);
    try {
      await fn(id);
      toast.show("Atualizado com sucesso", "success");
      // Reload the search results
      await search();
    } catch (e) {
      toast.show(e?.message || "Falha na operação", "error");
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl">
        <BackButton />
        <div className="mb-6 text-center">
          <Title>Consultar Pontos de Usuários</Title>
        </div>

        <form
          onSubmit={search}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              Buscar por nome:
            </label>
            <input
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                // Auto-select user when typing
                const found = users.find(
                  (u) =>
                    (u.displayName &&
                      u.displayName
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())) ||
                    (u.firstName &&
                      u.firstName
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())) ||
                    (u.name &&
                      u.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase()))
                );
                setSelectedUserId(found ? found.id : "");
              }}
              placeholder="Digite o nome do usuário"
              className="px-3 py-2 border rounded w-64"
              list="user-list"
            />
            <datalist id="user-list">
              {users.map((u) => (
                <option
                  key={u.id}
                  value={u.displayName || u.firstName || u.name}
                />
              ))}
            </datalist>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Status:</label>
            <select
              className="px-3 py-2 border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="PENDING">PENDENTE</option>
              <option value="APPROVED">APROVADO</option>
              <option value="REJECTED">REJEITADO</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 mt-5"
          >
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
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      {loading
                        ? "Carregando..."
                        : "Nenhum ponto encontrado. Use os filtros acima para buscar."}
                    </td>
                  </tr>
                ) : (
                  items.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-gray-50">
                      <Td>{r.id}</Td>
                      <Td>
                        {r.user?.displayName ||
                          `${r.user?.firstName || ""} ${
                            r.user?.lastName || ""
                          }`.trim() ||
                          r.user?.name ||
                          r.userName ||
                          `ID: ${r.userId}`}
                      </Td>
                      <Td>
                        {r.date
                          ? new Date(r.date).toLocaleDateString("pt-BR")
                          : r.startWork
                          ? new Date(r.startWork).toLocaleDateString("pt-BR")
                          : "--/--/----"}
                      </Td>
                      <Td>
                        {r.startWork
                          ? new Date(r.startWork).toLocaleTimeString("pt-BR")
                          : "--:--:--"}
                      </Td>
                      <Td>
                        {r.endWork
                          ? new Date(r.endWork).toLocaleTimeString("pt-BR")
                          : "--:--:--"}
                      </Td>
                      <Td>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            r.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : r.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {r.status === "PENDING"
                            ? "PENDENTE"
                            : r.status === "APPROVED"
                            ? "APROVADO"
                            : "REJEITADO"}
                        </span>
                      </Td>
                      <Td>
                        {r.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              disabled={acting}
                              onClick={() => act(ClockingAPI.approve, r.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 text-xs"
                            >
                              Aprovar
                            </button>
                            <button
                              disabled={acting}
                              onClick={() => act(ClockingAPI.reject, r.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 text-xs"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
