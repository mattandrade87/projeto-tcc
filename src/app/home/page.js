import { Button, Title } from "../main-page/components";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <Title>CONSTRUÇÃO CIVIL</Title>
        <div className="max-w-md mx-auto mt-8 gap-2 flex flex-col">
          <Button>Orçamento</Button>
          <Button>Cliente</Button>
          <Button>Serviços</Button>
          <Button>Relatórios</Button>
          <div className="text-center ">
            <button className="bg-red-600  cursor-pointer hover:bg-red-700 p-1 rounded text-white px-6">
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
