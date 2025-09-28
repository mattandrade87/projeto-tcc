import Title from "./components/Title";
import Subtitle from "./components/Subtitle";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="mb-8">
          <Title>CONSTRUÇÃO CIVIL</Title>
          <Subtitle>Efetue seu login</Subtitle>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
