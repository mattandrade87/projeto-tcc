"use client";
import Link from "next/link";
import { Title } from "@/app/main-page/components";
import { BackButton } from "@/components/ui";

export default function AdminRegisterIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <BackButton />
        <div className="text-center">
          <Title>Registrar</Title>
        </div>
        <div className="mt-6 space-y-3">
          <Nav href="/admin/register/new-admin">Novo Admin</Nav>
          <Nav href="/admin/register/new-user">Novo Usuário</Nav>
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
