"use client";
import Link from "next/link";
import { FaUtensils, FaUsers, FaFire, FaConciergeBell } from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaConciergeBell className="text-4xl text-gray-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Gestión de Restaurante
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Selecciona tu sector para comenzar
          </p>
        </div>

        {/* Botones de navegación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Botón Cocina */}
          <Link href="/kitchen">
            <div className="group cursor-pointer">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-8 border-2 border-transparent hover:border-orange-500">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <FaFire className="w-10 h-10 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Cocina
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Gestiona pedidos y preparación de comida
                  </p>
                  <span className="inline-flex items-center text-orange-600 font-semibold">
                    Entrar a Cocina
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Botón Personal de Mesas */}
          <Link href="/restaurante">
            <div className="group cursor-pointer">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-8 border-2 border-transparent hover:border-green-500">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <FaUsers className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Cliente
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Tomar pedidos 
                  </p>
                  <span className="inline-flex items-center text-green-600 font-semibold">
                    Entrar a Clientes
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Pie de página */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            ¿Acceso de administrador?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Iniciar sesión como administrador
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
