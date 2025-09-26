import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_PUBLIC;

// Configuración base de axios (público - no necesita token)
const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= TIPOS BASADOS EN EL NUEVO SCHEMA =================
export interface Categoria {
  id: number;
  nombre: string;
  imagen?: string;
  activo: boolean;
}

export interface Ingrediente {
  id: number;
  nombre: string;
}

export interface Tamano {
  id: number;
  nombre: string;
}

export interface Opcion {
  id: number;
  nombre: string;
}

export interface Adicional {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  activo: boolean;
}

export interface EstadoPedido {
  id: number;
  nombre: string;
}

export interface ProductoIngrediente {
  id: number;
  producto_id: number;
  ingrediente_id: number;
  opcional: boolean;
  por_defecto: boolean;
  ingrediente: Ingrediente;
}

export interface ProductoTamano {
  id: number;
  producto_id: number;
  tamano_id: number;
  precio: number;
  tamano: Tamano;
}

export interface ProductoOpcion {
  id: number;
  producto_id: number;
  opcion_id: number;
  precio: number;
  opcion: Opcion;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio?: number;
  activo: boolean;
  categoria_id: number;
  tamano_id?: number;
  categoria: Categoria;
  tamano?: Tamano;
  ingredientes: ProductoIngrediente[];
  opciones: ProductoOpcion[];
  tamanosDisponibles: ProductoTamano[];
}

// ================= TIPOS PARA PEDIDO =================
export interface PedidoIngredienteCreate {
  ingrediente_id: number;
}

export interface PedidoItemCreate {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  productoTamano_id?: number | null;
  opcionId?: number | null;
  pedidoIngredientes?: {
    create: PedidoIngredienteCreate[];
  };
}

export interface PedidoCreate {
  cliente: string;
  notas?: string;
  total: number;
  estado_id: number;
  pedidoItems: {
    create: PedidoItemCreate[];
  };
}

export interface PedidoIngrediente {
  id: number;
  pedidoItem_id: number;
  ingrediente_id: number;
  ingrediente: Ingrediente;
}

export interface PedidoItem {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  productoTamano_id?: number | null;
  opcionId?: number | null;
  producto: Producto;
  pedidoIngredientes: PedidoIngrediente[];
}

export interface Pedido {
  id: number;
  cliente: string;
  notas?: string;
  total: number;
  estado_id: number;
  fecha_creacion: Date;
  pedidoItems: PedidoItem[];
  estado: EstadoPedido;
}

// ================= CATEGORIA API =================
export const categoriaPublicApi = {
  // A - Obtener todas las categorías
  findAll: async (): Promise<Categoria[]> => {
    const response = await publicApiClient.get("/categoria");
    return response.data;
  },

  // B - Obtener una categoría por ID
  findOne: async (id: number): Promise<Categoria> => {
    const response = await publicApiClient.get(`/categoria/${id}`);
    return response.data;
  },

  // C - Obtener categorías activas
  findActive: async (): Promise<Categoria[]> => {
    const response = await publicApiClient.get("/categoria?activo=true");
    return response.data;
  },
};

// ================= INGREDIENTE API =================
export const ingredientePublicApi = {
  // D - Obtener todos los ingredientes
  findAll: async (): Promise<Ingrediente[]> => {
    const response = await publicApiClient.get("/ingrediente");
    return response.data;
  },

  // E - Obtener un ingrediente por ID
  findOne: async (id: number): Promise<Ingrediente> => {
    const response = await publicApiClient.get(`/ingrediente/${id}`);
    return response.data;
  },
};

// ================= TAMANO API =================
export const tamanoPublicApi = {
  // F - Obtener todos los tamaños
  findAll: async (): Promise<Tamano[]> => {
    const response = await publicApiClient.get("/tamano");
    return response.data;
  },

  // G - Obtener un tamaño por ID
  findOne: async (id: number): Promise<Tamano> => {
    const response = await publicApiClient.get(`/tamano/${id}`);
    return response.data;
  },
};

// ================= OPCION API =================
export const opcionPublicApi = {
  // H - Obtener todas las opciones
  findAll: async (): Promise<Opcion[]> => {
    const response = await publicApiClient.get("/opciones");
    return response.data;
  },

  // I - Obtener una opción por ID
  findOne: async (id: number): Promise<Opcion> => {
    const response = await publicApiClient.get(`/opciones/${id}`);
    return response.data;
  },
};

// ================= ADICIONAL API =================
export const adicionalPublicApi = {
  // J - Obtener todos los adicionales
  findAll: async (): Promise<Adicional[]> => {
    const response = await publicApiClient.get("/adicional");
    return response.data;
  },

  // K - Obtener un adicional por ID
  findOne: async (id: number): Promise<Adicional> => {
    const response = await publicApiClient.get(`/adicional/${id}`);
    return response.data;
  },

  // L - Obtener adicionales activos
  findActive: async (): Promise<Adicional[]> => {
    const response = await publicApiClient.get("/adicional?activo=true");
    return response.data;
  },
};

// ================= ESTADO PEDIDO API =================
export const estadoPedidoPublicApi = {
  // M - Obtener todos los estados de pedido
  findAll: async (): Promise<EstadoPedido[]> => {
    const response = await publicApiClient.get("/estado-pedido");
    return response.data;
  },

  // N - Obtener un estado de pedido por ID
  findOne: async (id: number): Promise<EstadoPedido> => {
    const response = await publicApiClient.get(`/estado-pedido/${id}`);
    return response.data;
  },
};

// ================= PRODUCTO API =================
export const productoPublicApi = {
  // O - Obtener todos los productos con filtros opcionales
  findAll: async (filters?: { category?: string; nombre?: string }): Promise<Producto[]> => {
    const params = new URLSearchParams();
    
    if (filters?.category) {
      params.append('category', filters.category);
    }
    
    if (filters?.nombre) {
      params.append('nombre', filters.nombre);
    }

    const queryString = params.toString();
    const url = queryString ? `/producto?${queryString}` : '/producto';
    
    const response = await publicApiClient.get(url);
    return response.data;
  },

  // P - Obtener un producto por ID
  findOne: async (id: number): Promise<Producto> => {
    const response = await publicApiClient.get(`/producto/${id}`);
    return response.data;
  },

  // Q - Obtener productos por categoría ID
  findByCategoria: async (categoriaId: number): Promise<Producto[]> => {
    const response = await publicApiClient.get(
      `/producto?categoria_id=${categoriaId}`
    );
    return response.data;
  },

  // R - Obtener productos por nombre de categoría
  findByCategoriaNombre: async (categoriaNombre: string): Promise<Producto[]> => {
    const response = await publicApiClient.get(
      `/producto?category=${encodeURIComponent(categoriaNombre)}`
    );
    return response.data;
  },

  // S - Obtener productos activos
  findActive: async (): Promise<Producto[]> => {
    const response = await publicApiClient.get("/producto?activo=true");
    return response.data;
  },

  // T - Obtener producto con relaciones específicas
  findWithRelations: async (id: number): Promise<Producto> => {
    const response = await publicApiClient.get(
      `/producto/${id}?include=ingredientes,opciones,tamanosDisponibles`
    );
    return response.data;
  },
};

// ================= PEDIDO API =================
export const pedidoPublicApi = {
  // U - Crear un nuevo pedido
  create: async (pedidoData: PedidoCreate): Promise<Pedido> => {
    const response = await publicApiClient.post("/pedido", pedidoData);
    return response.data;
  },

  // V - Obtener un pedido por ID
  findOne: async (id: number): Promise<Pedido> => {
    const response = await publicApiClient.get(`/pedido/${id}`);
    return response.data;
  },

  // W - Obtener pedidos por estado
  findByEstado: async (estadoId: number): Promise<Pedido[]> => {
    const response = await publicApiClient.get(`/pedido?estado_id=${estadoId}`);
    return response.data;
  },

  // X - Obtener todos los pedidos
  findAll: async (): Promise<Pedido[]> => {
    const response = await publicApiClient.get("/pedido");
    return response.data.data;
  },

  // Y - Actualizar estado de un pedido
  updateEstado: async (id: number, estadoId: number): Promise<Pedido> => {
    const response = await publicApiClient.put(`/pedido/${id}/estado`, {
      estado_id: estadoId
    });
    return response.data;
  },
};

// Exportar todo como un objeto único
export const publicApi = {
  categoria: categoriaPublicApi,      // A, B, C
  ingrediente: ingredientePublicApi,  // D, E
  tamano: tamanoPublicApi,            // F, G
  opcion: opcionPublicApi,            // H, I
  adicional: adicionalPublicApi,      // J, K, L
  estadoPedido: estadoPedidoPublicApi,// M, N
  producto: productoPublicApi,        // O, P, Q, R, S, T
  pedido: pedidoPublicApi,            // U, V, W, X, Y
};

export default publicApi;