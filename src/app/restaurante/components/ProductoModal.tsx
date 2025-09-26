// app/restaurante/components/ProductoModal.tsx
'use client';

import { useRestauranteStore } from '@/stores/useRestauranteStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle,DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

// Usar las mismas interfaces del store para consistencia
interface TamanoPersonalizado {
  id: number;
  nombre: string;
  precio: number;
}

interface OpcionPersonalizada {
  id: number;
  nombre: string;
}

interface IngredientePersonalizado {
  id: number;
  nombre: string;
  opcional: boolean;
  incluido: boolean; // Cambiar de 'seleccionado' a 'incluido' para coincidir con el store
}

export default function ProductoModal() {
  const { productoSeleccionado, setProductoSeleccionado, agregarAlPedido } = useRestauranteStore();
  const [cantidad, setCantidad] = useState(1);
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<TamanoPersonalizado | undefined>(undefined);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<OpcionPersonalizada | undefined>(undefined);
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState<IngredientePersonalizado[]>([]);

  // Inicializar selecciones cuando cambia el producto
  useEffect(() => {
    if (productoSeleccionado) {
      // Inicializar tamaño (primero disponible o usar precio base)
      if (productoSeleccionado.tamanosDisponibles?.length > 0) {
        const primerTamano = productoSeleccionado.tamanosDisponibles[0];
        setTamanoSeleccionado({
          id: primerTamano.tamano_id,
          nombre: primerTamano.tamano.nombre,
          precio: primerTamano.precio
        });
      } else {
        setTamanoSeleccionado(undefined);
      }

      // Inicializar ingredientes (seleccionar los que son por defecto)
      const ingredientesIniciales = productoSeleccionado.ingredientes?.map(ing => ({
        id: ing.ingrediente_id,
        nombre: ing.ingrediente.nombre,
        opcional: ing.opcional,
        incluido: ing.por_defecto // Cambiar de 'seleccionado' a 'incluido'
      })) || [];
      setIngredientesSeleccionados(ingredientesIniciales);

      // Resetear opción
      setOpcionSeleccionada(undefined);
      setCantidad(1);
    }
  }, [productoSeleccionado]);

  const toggleIngrediente = (ingredienteId: number) => {
    setIngredientesSeleccionados(prev => 
      prev.map(ing => 
        ing.id === ingredienteId 
          ? { ...ing, incluido: !ing.incluido }
          : ing
      )
    );
  };

  const calcularPrecioTotal = () => {
    const precioBase = tamanoSeleccionado?.precio || productoSeleccionado?.precio || 0;
    return precioBase * cantidad;
  };

  const handleAgregarPedido = () => {
    if (!productoSeleccionado) return;

    const personalizacion = {
      cantidad,
      tamano: tamanoSeleccionado,
      opcion: opcionSeleccionada,
      ingredientes: ingredientesSeleccionados.map(ing => ({
        id: ing.id,
        nombre: ing.nombre,
        opcional: ing.opcional,
        incluido: ing.incluido
      }))
    };

    agregarAlPedido(productoSeleccionado, personalizacion);
    setProductoSeleccionado(null);
  };

  if (!productoSeleccionado) return null;

  const precioActual = tamanoSeleccionado?.precio || productoSeleccionado.precio;

  return (
    <Dialog open={!!productoSeleccionado} onOpenChange={() => setProductoSeleccionado(null)}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{productoSeleccionado.nombre}</DialogTitle>
           <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <img 
            src={productoSeleccionado.imagen} 
            alt={productoSeleccionado.nombre}
            className="w-full h-48 object-cover rounded-lg"
          />

          <div>
            <p className="text-gray-600">{productoSeleccionado.descripcion}</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              S/ {precioActual}
            </p>
          </div>

          {/* Selector de Tamaños */}
          {productoSeleccionado.tamanosDisponibles?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Tamaño:</h4>
              <div className="grid grid-cols-2 gap-2">
                {productoSeleccionado.tamanosDisponibles.map((tamano: any) => {
                  const tamanoPersonalizado = {
                    id: tamano.tamano_id,
                    nombre: tamano.tamano.nombre,
                    precio: tamano.precio
                  };
                  
                  return (
                    <label key={tamano.tamano_id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="tamano"
                        value={tamano.tamano_id}
                        checked={tamanoSeleccionado?.id === tamano.tamano_id}
                        onChange={() => setTamanoSeleccionado(tamanoPersonalizado)}
                        className="hidden"
                      />
                      <div className={`p-3 border-2 rounded-lg text-center transition-colors ${
                        tamanoSeleccionado?.id === tamano.tamano_id 
                          ? 'bg-blue-600 text-white' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        {tamano.tamano.nombre} - S/ {tamano.precio}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selector de Opciones */}
          {productoSeleccionado.opciones?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Opciones:</h4>
              <div className="grid grid-cols-2 gap-2">
                {productoSeleccionado.opciones.map((opcion: any) => {
                  const opcionPersonalizada = {
                    id: opcion.opcion_id,
                    nombre: opcion.opcion.nombre
                  };
                  
                  return (
                    <label key={opcion.opcion_id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="opcion"
                        value={opcion.opcion_id}
                        checked={opcionSeleccionada?.id === opcion.opcion_id}
                        onChange={() => setOpcionSeleccionada(opcionPersonalizada)}
                        className="hidden"
                      />
                      <div className={`p-3 border-2 rounded-lg text-center transition-colors ${
                        opcionSeleccionada?.id === opcion.opcion_id 
                          ? 'bg-blue-600 text-white' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        {opcion.opcion.nombre}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selector de Ingredientes */}
          {productoSeleccionado.ingredientes?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Ingredientes:</h4>
              <div className="gap-2 grid grid-cols-2">
                {ingredientesSeleccionados.map((ingrediente) => (
                  <label key={ingrediente.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ingrediente.incluido}
                      onChange={() => toggleIngrediente(ingrediente.id)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-3 transition-colors ${
                      ingrediente.incluido 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300'
                    }`}>
                      {ingrediente.incluido && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm flex-1">
                      {ingrediente.nombre}
                      {ingrediente.opcional && (
                        <span className="text-xs text-gray-500 ml-1">(Opcional)</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Selector de cantidad */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Cantidad:</span>
            <div className="flex items-center space-x-3">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="text-lg font-medium w-8 text-center">{cantidad}</span>
              
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCantidad(cantidad + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Botón agregar */}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleAgregarPedido}
            size="lg"
          >
            Agregar al Pedido - S/ {calcularPrecioTotal().toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}