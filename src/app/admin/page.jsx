"use client";
import Link from "next/link";
import { Title } from "@/app/main-page/components";
import { useAuth } from "@/context/AuthContext.jsx";

export default function AdminHome() {
  const { role } = useAuth();
  if (role !== "ADMIN") return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="text-center">
          <Title>Painel Admin</Title>
        </div>
        <div className="mt-6 space-y-3">
          <Nav href="/home">Home</Nav>
          <Nav href="/admin/users">Usuários</Nav>
          <Nav href="/admin/clocking/status">Pontos por Status</Nav>
          <Nav href="/admin/clocking/user">Pontos por Usuário</Nav>
        </div>
      </div>
    </div>
  );
}

function Nav({ href, children }) {
  return (
    <Link
      href={href}
      className="block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-center"
    >
      {children}
    </Link>
  );
}
