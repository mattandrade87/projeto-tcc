"use client";
import { Button, Title } from "../main-page/components";
import { useEffect, useState } from "react";
import { UserAPI } from "@/services/api";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();

  console.log(profile);

  useEffect(() => {
    (async () => {
      try {
        const me = await UserAPI.getMe();
        setProfile(me);
      } catch (_) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="text-center">
          <Title>CONSTRUÇÃO CIVIL</Title>
          {loading ? (
            <div className="flex justify-center mt-4">
              <Loader />
            </div>
          ) : (
            <>
              <p className="text-xl">
                Bem-vindo{" "}
                {profile?.displayName ||
                  `${profile?.firstName || ""} ${
                    profile?.lastName || ""
                  }`.trim() ||
                  profile?.name ||
                  "Usuário"}
                !
              </p>
              <p className="text-lg text-gray-600 mt-2">
                {profile?.role === "ADMIN" ? "Administrador" : "Usuário"}
              </p>
            </>
          )}
        </div>

        <div className="max-w-md mx-auto mt-8 gap-2 flex flex-col">
          <Button href="/bater-ponto">Bater Ponto</Button>
          <Button href="/perfil">Perfil</Button>
          <Button href="/relatorios">Relatórios</Button>
          {profile?.role === "ADMIN" && <Button href="/admin">Admin</Button>}
          <div className="text-center ">
            <button
              onClick={signOut}
              className="bg-red-500 cursor-pointer hover:bg-red-600 p-1 rounded text-white px-6"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
