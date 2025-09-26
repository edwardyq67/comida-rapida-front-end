// app/restaurante/components/HeaderCategorias.tsx
'use client';

import { useEffect } from 'react';
import { useRestauranteStore } from '@/stores/useRestauranteStore';

export default function HeaderCategorias() {
  const { 
    categorias, 
    categoriaSeleccionada, 
    setCategoriaSeleccionada,
    cargarCategorias,
    cargando 
  } = useRestauranteStore();

  // Función para obtener las iniciales del nombre
  const getIniciales = (nombre: string) => {
    return nombre
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  if (cargando) {
    return (
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="animate-pulse bg-blue-200 rounded-full w-16 h-16"></div>
              </div>
            ))}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex space-x-4 overflow-x-auto">
          {/* Botón "Todos" */}
          <button
            onClick={() => setCategoriaSeleccionada(null)}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
              !categoriaSeleccionada ? 'bg-blue-100 text-blue-600' : 'bg-blue-100 text-blue-600'
            }`}>
              🏠
            </div>
          </button>

          {/* Botones de categorías con imágenes o iniciales */}
          {categorias.map((categoria) => (
            <button
          
              onClick={() => setCategoriaSeleccionada(categoria.nombre)}
              title={categoria.nombre} // Tooltip con el nombre completo
            >
              <div className={`w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center ${
                categoriaSeleccionada === categoria.nombre 
                  ? 'border-blue-500' 
                  : 'border-blue-200'
              }`}>
                {categoria.imagen ? (
                  <img 
                    src={categoria.imagen} 
                    alt={categoria.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-blue-700">
                    {getIniciales(categoria.nombre)}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}