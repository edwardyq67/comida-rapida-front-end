// app/restaurante/components/PedidoSheet.tsx
"use client";

import { useRestauranteStore } from "@/stores/useRestauranteStore";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import publicApi from "@/lib/public-api";


export default function PedidoSheet() {
  const {
    pedidoAbierto,
    setPedidoAbierto,
    pedidos,
    removerDelPedido,
    actualizarCantidad,
    total,
    limpiarPedido,
  } = useRestauranteStore();

  // Estados para el nombre y la nota
  const [nombreCliente, setNombreCliente] = useState("");
  const [notaPedido, setNotaPedido] = useState("");
  const [enviando, setEnviando] = useState(false); // Estado para loading

  const handleConfirmarPedido = async () => {
    if (!nombreCliente.trim()) return;

    setEnviando(true);

    try {
      // Estructura del pedido para enviar
     const pedidoData = {
      cliente: nombreCliente,
      notas: notaPedido,
      total: total,
      estado_id: 1, // PENDIENTE - agregado aquí
      pedidoItems: {
        create: pedidos.map((item) => ({
          producto_id: item.productoId,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad,
          productoTamano_id: item.personalizacion?.tamano?.id || null,
          opcionId: item.personalizacion?.opcion?.id || null,
          pedidoIngredientes: {
            create:
              item.personalizacion?.ingredientes
                ?.filter((ing) => ing.incluido)
                .map((ing) => ({
                  ingrediente_id: ing.id,
                })) || [],
          },
        })),
      },
    };

      console.log("Enviando pedido:", pedidoData);

      // Llamar a la API
      const pedidoCreado = await publicApi.pedido.create(pedidoData);
      
      console.log("Pedido creado exitosamente:", pedidoCreado);
      
      // Mostrar mensaje de éxito
      alert(`¡Pedido confirmado! Número de pedido: ${pedidoCreado.id}`);
      
      // Limpiar todo después del éxito
      limpiarPedido();
      setNombreCliente("");
      setNotaPedido("");
      setPedidoAbierto(false);
      
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      alert("Error al confirmar el pedido. Por favor, intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Sheet open={pedidoAbierto} onOpenChange={setPedidoAbierto}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tu Pedido</SheetTitle>
          <SheetDescription className="sr-only">
            Resumen de tu pedido actual. Revisa y modifica los productos antes
            de confirmar.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4">
          {pedidos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Tu pedido está vacío
            </p>
          ) : (
            <>
              {/* Campos para nombre y nota */}
              <div className="space-y-3 mb-4">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre del cliente *
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    placeholder="Ingresa tu nombre"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    disabled={enviando}
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="nota"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    id="nota"
                    value={notaPedido}
                    onChange={(e) => setNotaPedido(e.target.value)}
                    placeholder="Ej: Sin cebolla, para llevar, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    rows={2}
                    disabled={enviando}
                  />
                </div>
              </div>

              {/* Lista de productos */}
              <div className="max-h-96 overflow-y-auto space-y-3">
                {pedidos.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-12 h-12 rounded object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {item.nombre}
                      </h4>
                      <p className="text-green-600 font-bold">
                        S/ {item.precio * item.cantidad}
                      </p>

                      {/* Mostrar personalizaciones si existen */}
                      {item.personalizacion && (
                        <div className="text-xs text-gray-600 mt-1">
                          {item.personalizacion.tamano && (
                            <div>
                              Tamaño: {item.personalizacion.tamano.nombre}
                            </div>
                          )}
                          {item.personalizacion.opcion && (
                            <div>
                              Opción: {item.personalizacion.opcion.nombre}
                            </div>
                          )}
                          {item.personalizacion.ingredientes &&
                            item.personalizacion.ingredientes.some(
                              (ing) => ing.incluido
                            ) && (
                              <div>
                                Ingredientes:{" "}
                                {item.personalizacion.ingredientes
                                  .filter((ing) => ing.incluido)
                                  .map((ing) => ing.nombre)
                                  .join(", ")}
                              </div>
                            )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() =>
                          actualizarCantidad(item.id, item.cantidad - 1)
                        }
                        disabled={enviando}
                        aria-label={`Disminuir cantidad de ${item.nombre}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span
                        className="text-sm font-medium w-8 text-center"
                        aria-live="polite"
                      >
                        {item.cantidad}
                      </span>

                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() =>
                          actualizarCantidad(item.id, item.cantidad + 1)
                        }
                        disabled={enviando}
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 ml-2"
                        onClick={() => removerDelPedido(item.id)}
                        disabled={enviando}
                        aria-label={`Eliminar ${item.nombre} del pedido`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total y botones */}
              <div className="border-t p-4 mt-4">
               <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span aria-live="polite">
                    S/{" "}
                    {pedidos
                      .reduce(
                        (sum, item) => sum + item.precio * item.cantidad,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      limpiarPedido();
                      setNombreCliente("");
                      setNotaPedido("");
                    }}
                    disabled={enviando}
                    aria-label="Limpiar todo el pedido"
                  >
                    Limpiar
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleConfirmarPedido}
                    disabled={!nombreCliente.trim() || enviando}
                    aria-label="Confirmar pedido"
                  >
                    {enviando ? "Enviando..." : "Confirmar Pedido"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}