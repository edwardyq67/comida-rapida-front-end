// app/restaurante/components/ListaProductos.tsx
"use client";

import { useEffect, useState } from "react";
import { useRestauranteStore } from "@/stores/useRestauranteStore";
import { publicApi, Producto } from "@/lib/public-api";
import ProductoCard from "./ProductoCard";

export default function ListaProductos() {
  const { categoriaSeleccionada } = useRestauranteStore();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos cuando cambia la categoría seleccionada
  useEffect(() => {
    const cargarProductos = async () => {
      if (!categoriaSeleccionada) {
        setProductos([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const productosData = await publicApi.producto.findByCategoriaNombre(
          categoriaSeleccionada
        );
        setProductos(productosData);
      } catch (error) {
        console.error("Error cargando productos:", error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, [categoriaSeleccionada]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay productos en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <h2 className="text-xl font-bold mb-4 px-2">{categoriaSeleccionada}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-2">
        {productos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}
