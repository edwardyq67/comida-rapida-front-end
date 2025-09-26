import axios from "axios";

const API_BASE_URL =
  process.env.API_URL_PUBLIC || "http://localhost:3001/public-panel";

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

// ================= CATEGORIA API =================
export const categoriaPublicApi = {
  findAll: async (): Promise<Categoria[]> => {
    const response = await publicApiClient.get("/categoria");
    return response.data;
  },

  findOne: async (id: number): Promise<Categoria> => {
    const response = await publicApiClient.get(`/categoria/${id}`);
    return response.data;
  },

  findActive: async (): Promise<Categoria[]> => {
    const response = await publicApiClient.get("/categoria?activo=true");
    return response.data;
  },
};

// ================= INGREDIENTE API =================
export const ingredientePublicApi = {
  findAll: async (): Promise<Ingrediente[]> => {
    const response = await publicApiClient.get("/ingrediente");
    return response.data;
  },

  findOne: async (id: number): Promise<Ingrediente> => {
    const response = await publicApiClient.get(`/ingrediente/${id}`);
    return response.data;
  },
};

// ================= TAMANO API =================
export const tamanoPublicApi = {
  findAll: async (): Promise<Tamano[]> => {
    const response = await publicApiClient.get("/tamano");
    return response.data;
  },

  findOne: async (id: number): Promise<Tamano> => {
    const response = await publicApiClient.get(`/tamano/${id}`);
    return response.data;
  },
};

// ================= OPCION API =================
export const opcionPublicApi = {
  findAll: async (): Promise<Opcion[]> => {
    const response = await publicApiClient.get("/opciones");
    return response.data;
  },

  findOne: async (id: number): Promise<Opcion> => {
    const response = await publicApiClient.get(`/opciones/${id}`);
    return response.data;
  },
};

// ================= ADICIONAL API =================
export const adicionalPublicApi = {
  findAll: async (): Promise<Adicional[]> => {
    const response = await publicApiClient.get("/adicional");
    return response.data;
  },

  findOne: async (id: number): Promise<Adicional> => {
    const response = await publicApiClient.get(`/adicional/${id}`);
    return response.data;
  },

  findActive: async (): Promise<Adicional[]> => {
    const response = await publicApiClient.get("/adicional?activo=true");
    return response.data;
  },
};

// ================= ESTADO PEDIDO API =================
export const estadoPedidoPublicApi = {
  findAll: async (): Promise<EstadoPedido[]> => {
    const response = await publicApiClient.get("/estado-pedido");
    return response.data;
  },

  findOne: async (id: number): Promise<EstadoPedido> => {
    const response = await publicApiClient.get(`/estado-pedido/${id}`);
    return response.data;
  },
};

// ================= PRODUCTO API =================
export const productoPublicApi = {
  findAll: async (): Promise<Producto[]> => {
    const response = await publicApiClient.get("/producto");
    return response.data;
  },

  findOne: async (id: number): Promise<Producto> => {
    const response = await publicApiClient.get(`/producto/${id}`);
    return response.data;
  },

  findByCategoria: async (categoriaId: number): Promise<Producto[]> => {
    const response = await publicApiClient.get(
      `/producto?categoria_id=${categoriaId}`
    );
    return response.data;
  },

  findActive: async (): Promise<Producto[]> => {
    const response = await publicApiClient.get("/producto?activo=true");
    return response.data;
  },

  // Métodos para buscar productos con relaciones específicas
  findWithRelations: async (id: number): Promise<Producto> => {
    const response = await publicApiClient.get(
      `/producto/${id}?include=ingredientes,opciones,tamanosDisponibles`
    );
    return response.data;
  },
};

// ================= PEDIDO API =================
export const pedidoPublicApi = {
  create: async (pedidoData: any): Promise<any> => {
    const response = await publicApiClient.post("/pedido", pedidoData);
    return response.data;
  },

  findOne: async (id: number): Promise<any> => {
    const response = await publicApiClient.get(`/pedido/${id}`);
    return response.data;
  },

  findByEstado: async (estadoId: number): Promise<any[]> => {
    const response = await publicApiClient.get(`/pedido?estado_id=${estadoId}`);
    return response.data;
  },
};

// Exportar todo como un objeto único
export const publicApi = {
  categoria: categoriaPublicApi,
  ingrediente: ingredientePublicApi,
  tamano: tamanoPublicApi,
  opcion: opcionPublicApi,
  adicional: adicionalPublicApi,
  estadoPedido: estadoPedidoPublicApi,
  producto: productoPublicApi,
  pedido: pedidoPublicApi,
};

export default publicApi;
