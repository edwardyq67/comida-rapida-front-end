"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import { Home, Info } from "lucide-react"; // 👈 Agregamos el ícono Info

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });

      // Pequeña pausa para permitir que el estado se actualice
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Leer el estado ACTUAL del store
      const currentState = useAuthStore.getState();
      console.log("Estado actual:", currentState.isAuthenticated);

      if (currentState.isAuthenticated) {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error de login:", error);
    }
  };

  // Función para autocompletar credenciales de prueba
  const fillDemoCredentials = () => {
    setEmail("admin@ejemplo.com");
    setPassword("admin123");
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 relative">
        {/* 🔹 Botón de Home arriba a la izquierda */}
        <Link
          href="/"
          className="absolute top-4 left-4 text-gray-500 hover:text-blue-600 transition"
        >
          <Home className="h-6 w-6" />
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-gray-600">Acceso al panel de administración</p>
        </div>

        {/* 🔹 Cuadro con credenciales de prueba */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Credenciales de prueba:</p>
              <p><strong>Email:</strong> admin@ejemplo.com</p>
              <p><strong>Contraseña:</strong> admin123</p>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="mt-2 text-blue-700 hover:text-blue-900 underline text-xs font-medium"
              >
                Autocompletar credenciales
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}