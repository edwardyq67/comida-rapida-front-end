// app/restaurante/page.tsx
"use client";

import { useEffect } from "react";
import { useRestauranteStore } from "@/stores/useRestauranteStore";
import HeaderCategorias from "./components/HeaderCategorias";
import Bienvenidos from "./components/Bienvenidos";
import ListaProductos from "./components/ListaProductos";
import BotonPedido from "./components/BotonPedido";
import ProductoModal from "./components/ProductoModal";
import PedidoSheet from "./components/PedidoSheet";

export default function RestaurantePage() {
  const { categoriaSeleccionada } = useRestauranteStore();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header con categorías */}
      <HeaderCategorias />

      {/* Contenido principal */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {!categoriaSeleccionada ? <Bienvenidos /> : <ListaProductos />}
      </main>

      {/* Componentes flotantes/modales */}
      <BotonPedido />
      <ProductoModal />
      <PedidoSheet />
    </div>
  );
}
