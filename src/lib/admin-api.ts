import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_ADMIN;

// Configuración base de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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

// DTOs para creación y actualización
export type CreateCategoriaDto = Omit<Categoria, 'id'>;
export type UpdateCategoriaDto = Partial<CreateCategoriaDto>;

export type CreateIngredienteDto = Omit<Ingrediente, 'id'>;
export type UpdateIngredienteDto = Partial<CreateIngredienteDto>;

export type CreateTamanoDto = Omit<Tamano, 'id'>;
export type UpdateTamanoDto = Partial<CreateTamanoDto>;

export type CreateOpcionDto = Omit<Opcion, 'id'>;
export type UpdateOpcionDto = Partial<CreateOpcionDto>;

export type CreateAdicionalDto = Omit<Adicional, 'id'>;
export type UpdateAdicionalDto = Partial<CreateAdicionalDto>;

export type CreateEstadoPedidoDto = Omit<EstadoPedido, 'id'>;
export type UpdateEstadoPedidoDto = Partial<CreateEstadoPedidoDto>;

export type CreateProductoDto = Omit<Producto, 'id' | 'categoria' | 'tamano' | 'ingredientes' | 'opciones' | 'tamanosDisponibles'> & {
  ingredientes?: { ingrediente_id: number; opcional: boolean; por_defecto: boolean }[];
  opciones?: { opcion_id: number; precio: number }[];
  tamanosDisponibles?: { tamano_id: number; precio: number }[];
};

export type UpdateProductoDto = Partial<CreateProductoDto>;

// ================= CATEGORIA API =================
export const categoriaApi = {
  create: async (dto: CreateCategoriaDto): Promise<Categoria> => {
    const response = await apiClient.post('/categoria', dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateCategoriaDto): Promise<Categoria> => {
    const response = await apiClient.patch(`/categoria/${id}`, dto);
    return response.data;
  },
};

// ================= INGREDIENTE API =================
export const ingredienteApi = {
  create: async (dto: CreateIngredienteDto): Promise<Ingrediente> => {
    const response = await apiClient.post('/ingrediente', dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateIngredienteDto): Promise<Ingrediente> => {
    const response = await apiClient.patch(`/ingrediente/${id}`, dto);
    return response.data;
  },
};

// ================= TAMANO API =================
export const tamanoApi = {
  create: async (dto: CreateTamanoDto): Promise<Tamano> => {
    const response = await apiClient.post('/tamano', dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateTamanoDto): Promise<Tamano> => {
    const response = await apiClient.patch(`/tamano/${id}`, dto);
    return response.data;
  },
};

// ================= OPCION API =================
export const opcionApi = {
  create: async (dto: CreateOpcionDto): Promise<Opcion> => {
    const response = await apiClient.post('/opciones', dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateOpcionDto): Promise<Opcion> => {
    const response = await apiClient.patch(`/opciones/${id}`, dto);
    return response.data;
  },
};

// ================= ADICIONAL API =================
export const adicionalApi = {
  create: async (dto: CreateAdicionalDto): Promise<Adicional> => {
    const response = await apiClient.post('/adicional', dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateAdicionalDto): Promise<Adicional> => {
    const response = await apiClient.patch(`/adicional/${id}`, dto);
    return response.data;
  },
};

// ================= ESTADO PEDIDO API =================
export const estadoPedidoApi = {
  create: async (dto: CreateEstadoPedidoDto): Promise<EstadoPedido> => {
    const response = await apiClient.post('/estado-pedido', dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateEstadoPedidoDto): Promise<EstadoPedido> => {
    const response = await apiClient.patch(`/estado-pedido/${id}`, dto);
    return response.data;
  },
};

// ================= PRODUCTO API =================
export const productoApi = {
create: async (dto: CreateProductoDto): Promise<Producto> => {
   const response = await apiClient.post('/producto', dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateProductoDto): Promise<Producto> => {
    const response = await apiClient.patch(`/producto/${id}`, dto);
    return response.data;
  },
};

// Exportar todo como un objeto único
export const adminApi = {
  categoria: categoriaApi,
  ingrediente: ingredienteApi,
  tamano: tamanoApi,
  opcion: opcionApi,
  adicional: adicionalApi,
  estadoPedido: estadoPedidoApi,
  producto: productoApi,
};

export default adminApi;