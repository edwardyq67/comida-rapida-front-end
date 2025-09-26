// app/restaurante/components/ProductCard.tsx
'use client';

import { useRestauranteStore } from '@/stores/useRestauranteStore';
import { Producto } from '@/lib/public-api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const { setProductoSeleccionado } = useRestauranteStore();

  const handleAbrirModal = () => {
    setProductoSeleccionado(producto);
  };

  const tienePersonalizaciones = 
    producto.tamanosDisponibles?.length > 0 || 
    producto.opciones?.length > 0 || 
    producto.ingredientes?.length > 0;

  return (
    <Card onClick={handleAbrirModal} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        {/* Imagen del producto */}
        <div className="relative">
          <img 
            src={producto.imagen} 
            alt={producto.nombre}
            className="w-full h-48 object-cover"
          />
          {producto.categoria && (
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {producto.categoria.nombre}
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4" >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1 mr-2">
              {producto.nombre}
            </h3>
            <span className="text-green-600 font-bold text-lg whitespace-nowrap">
              S/ {producto.precio}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {producto.descripcion}
          </p>

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {tienePersonalizaciones ? 'Personalizar' : 'Agregar al Pedido'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}