// stores/useRestauranteStore.ts (versión mejorada)
import { create } from "zustand";
import { publicApi } from "@/lib/public-api";
import { Categoria, Producto } from "@/lib/public-api";

// Interfaces para personalizaciones
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
  incluido: boolean;
}

interface Personalizacion {
  cantidad: number;
  tamano?: TamanoPersonalizado;
  opcion?: OpcionPersonalizada;
  ingredientes?: IngredientePersonalizado[];
}

interface ProductoPedido {
  id: number;
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  personalizacion: Personalizacion;
}

interface RestauranteStore {
  // Estado de la UI
  categoriaSeleccionada: string | null;
  productoSeleccionado: Producto | null;
  pedidoAbierto: boolean;

  // Estado de carga
  cargando: boolean;
  error: string | null;

  // Datos
  categorias: Categoria[];
  productos: Producto[];

  // Pedido actual
  pedidos: ProductoPedido[];

  // Actions
  setCategoriaSeleccionada: (categoria: string | null) => void;
  setProductoSeleccionado: (producto: Producto | null) => void;
  setPedidoAbierto: (abierto: boolean) => void;

  // API Actions
  cargarCategorias: () => Promise<void>;
  cargarProductos: () => Promise<void>;
  cargarProductosPorCategoria: (categoriaNombre: string) => Promise<void>;

  // Pedido actions
  agregarAlPedido: (
    producto: Producto,
    personalizacion: Personalizacion
  ) => void;
  removerDelPedido: (id: number) => void;
  actualizarCantidad: (id: number, cantidad: number) => void;
  limpiarPedido: () => void;

  // Computed
  total: number;
  totalItems: number;
}

export const useRestauranteStore = create<RestauranteStore>((set, get) => ({
  // Estado inicial
  categoriaSeleccionada: null,
  productoSeleccionado: null,
  pedidoAbierto: false,
  cargando: false,
  error: null,
  categorias: [],
  productos: [],
  pedidos: [],


  // Actions
  setCategoriaSeleccionada: (categoria) =>
    set({ categoriaSeleccionada: categoria }),
  setProductoSeleccionado: (producto) =>
    set({ productoSeleccionado: producto }),
  setPedidoAbierto: (abierto) => set({ pedidoAbierto: abierto }),

  // API Actions
  cargarCategorias: async () => {
    set({ cargando: true, error: null });
    try {
      const categorias = await publicApi.categoria.findAll();
      set({ categorias, cargando: false });
    } catch (error) {
      set({
        error: "Error al cargar las categorías",
        cargando: false,
      });
      console.error("Error cargando categorías:", error);
    }
  },

  cargarProductos: async () => {
    set({ cargando: true, error: null });
    try {
      const productos = await publicApi.producto.findAll();
      set({ productos, cargando: false });
    } catch (error) {
      set({
        error: "Error al cargar los productos",
        cargando: false,
      });
      console.error("Error cargando productos:", error);
    }
  },

  cargarProductosPorCategoria: async (categoriaNombre: string) => {
    set({ cargando: true, error: null });
    try {
      const todosLosProductos = await publicApi.producto.findAll();
      const productosFiltrados = todosLosProductos.filter(
        (producto) => producto.categoria.nombre === categoriaNombre
      );
      set({ productos: productosFiltrados, cargando: false });
    } catch (error) {
      set({
        error: "Error al cargar los productos de la categoría",
        cargando: false,
      });
      console.error("Error cargando productos por categoría:", error);
    }
  },

  // Pedido actions
  agregarAlPedido: (producto, personalizacion) => {
    const { pedidos } = get();

    // Generar un ID único para este item del pedido (incluye personalizaciones)
    const itemId = generateItemId(producto, personalizacion);

    const existe = pedidos.find((p) => p.id === itemId);

    if (existe) {
      set({
        pedidos: pedidos.map((p) =>
          p.id === itemId
            ? {
                ...p,
                cantidad: p.cantidad + personalizacion.cantidad,
              }
            : p
        ),
      });
    } else {
      const precioFinal =
        personalizacion.tamano?.precio || producto.precio || 0;

      set({
        pedidos: [
          ...pedidos,
          {
            id: itemId,
            productoId: producto.id,
            nombre: producto.nombre,
            precio: precioFinal,
            imagen: producto.imagen,
            cantidad: personalizacion.cantidad,
            personalizacion,
          },
        ],
      });
    }
  },
  // Computed values
  get total() {
    return get().pedidos.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
  },

  get totalItems() {
    return get().pedidos.reduce((sum, item) => sum + item.cantidad, 0);
  },
  removerDelPedido: (id) => {
    set({ pedidos: get().pedidos.filter((p) => p.id !== id) });
  },

  actualizarCantidad: (id, cantidad) => {
    if (cantidad <= 0) {
      get().removerDelPedido(id);
      return;
    }

    set({
      pedidos: get().pedidos.map((p) => (p.id === id ? { ...p, cantidad } : p)),
    });
  },

  limpiarPedido: () => set({ pedidos: [] }),

}));

// Función helper para generar IDs únicos basados en personalizaciones
function generateItemId(
  producto: Producto,
  personalizacion: Personalizacion
): number {
  let baseId = producto.id * 1000000; // Base del producto

  // Agregar información del tamaño
  if (personalizacion.tamano) {
    baseId += personalizacion.tamano.id * 1000;
  }

  // Agregar información de la opción
  if (personalizacion.opcion) {
    baseId += personalizacion.opcion.id * 100;
  }

  // Agregar información de ingredientes (solo los incluidos)
  if (personalizacion.ingredientes) {
    const ingredientesIncluidos = personalizacion.ingredientes
      .filter((ing) => ing.incluido)
      .map((ing) => ing.id)
      .sort((a, b) => a - b);

    if (ingredientesIncluidos.length > 0) {
      baseId += ingredientesIncluidos[0]; // Solo el primero para simplificar
    }
  }

  return baseId;
}
