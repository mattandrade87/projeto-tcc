"use client";
import { useEffect, useState } from "react";
import { AdminAPI } from "@/services/api";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/context/ToastContext.jsx";
import Link from "next/link";
import { Title } from "@/app/main-page/components";
import { BackButton } from "@/components/ui";

export default function UsersListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await AdminAPI.listUsers();
        setItems(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        toast.show(e?.message || "Erro ao carregar usuários", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl">
        <BackButton />
        <div className="mb-4 text-center">
          <Title>Usuários</Title>
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
                  <Th>Nome</Th>
                  <Th>Email</Th>
                  <Th>Papel</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id} className="border-t">
                    <Td>
                      {u.displayName ||
                        `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                        u.name ||
                        u.email}
                    </Td>
                    <Td>{u.email}</Td>
                    <Td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {u.role || "USER"}
                      </span>
                    </Td>
                    <Td>
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        Detalhes
                      </Link>
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
