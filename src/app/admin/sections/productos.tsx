"use client";

import React, { useEffect, useState } from "react";
import { publicApi } from "@/lib/public-api";
import { DataTableProductos } from "@/app/admin/components/data-table-admin-productos";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ModalAgregarProducto } from "../components/modal-agregar-producto";

// Importar la interfaz Producto desde tu public-api
import type { Producto } from "@/lib/public-api";

export default function ProductosPage() {
  // Cambié el nombre a ProductosPage para que sea más específico
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const productosData = await publicApi.producto.findAll();
      setProductos(productosData);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleProductoAgregado = () => {
    cargarProductos();
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="text-lg md:text-xl">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header responsive */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Gestión de Productos
        </h1>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start"
          size="lg"
        >
          <Plus size={18} className="md:size-4" />
          <span className="text-base md:text-sm">Agregar Producto</span>
        </Button>
      </div>

      {/* Contenedor de la tabla con scroll horizontal para tablet */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <div className="min-w-[800px] md:min-w-0">
          <DataTableProductos
            data={productos}
            onProductoActualizado={cargarProductos}
          />
        </div>
      </div>

      <ModalAgregarProducto
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductoAgregado={handleProductoAgregado}
      />
    </div>
  );
}
