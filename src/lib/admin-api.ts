import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_ADMIN;

// Configuración base de axios con credenciales
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 👈 obligatorio para enviar cookies JWT
});

// Interceptor opcional para debug
apiClient.interceptors.request.use((config) => {
  console.log('➡️ Petición a:', config.url);
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Error en API:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// ================= TIPOS =================
export interface Categoria { id: number; nombre: string; imagen?: string; activo: boolean; }
export interface Ingrediente { id: number; nombre: string; }
export interface Tamano { id: number; nombre: string; }
export interface Opcion { id: number; nombre: string; }
export interface Adicional { id: number; nombre: string; precio: number; imagen?: string; activo: boolean; }
export interface EstadoPedido { id: number; nombre: string; }
export interface ProductoIngrediente { id: number; producto_id: number; ingrediente_id: number; opcional: boolean; por_defecto: boolean; ingrediente: Ingrediente; }
export interface ProductoTamano { id: number; producto_id: number; tamano_id: number; precio: number; tamano: Tamano; }
export interface ProductoOpcion { id: number; producto_id: number; opcion_id: number; precio: number; opcion: Opcion; }
export interface Producto { id: number; nombre: string; descripcion?: string; imagen?: string; precio?: number; activo: boolean; categoria_id: number; tamano_id?: number; categoria: Categoria; tamano?: Tamano; ingredientes: ProductoIngrediente[]; opciones: ProductoOpcion[]; tamanosDisponibles: ProductoTamano[]; }

// ================= DTOs =================
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

// ================= HELPERS =================
const handleResponse = <T>(response: any): T => response.data;

// ================= APIs =================
export const categoriaApi = {
  create: (dto: CreateCategoriaDto) => apiClient.post<Categoria>('/categoria', dto).then(handleResponse),
  update: (id: number, dto: UpdateCategoriaDto) => apiClient.patch<Categoria>(`/categoria/${id}`, dto).then(handleResponse),
};

export const ingredienteApi = {
  create: (dto: CreateIngredienteDto) => apiClient.post<Ingrediente>('/ingrediente', dto).then(handleResponse),
  update: (id: number, dto: UpdateIngredienteDto) => apiClient.patch<Ingrediente>(`/ingrediente/${id}`, dto).then(handleResponse),
};

export const tamanoApi = {
  create: (dto: CreateTamanoDto) => apiClient.post<Tamano>('/tamano', dto).then(handleResponse),
  update: (id: number, dto: UpdateTamanoDto) => apiClient.patch<Tamano>(`/tamano/${id}`, dto).then(handleResponse),
};

export const opcionApi = {
  create: (dto: CreateOpcionDto) => apiClient.post<Opcion>('/opciones', dto).then(handleResponse),
  update: (id: number, dto: UpdateOpcionDto) => apiClient.patch<Opcion>(`/opciones/${id}`, dto).then(handleResponse),
};

export const adicionalApi = {
  create: (dto: CreateAdicionalDto) => apiClient.post<Adicional>('/adicional', dto).then(handleResponse),
  update: (id: number, dto: UpdateAdicionalDto) => apiClient.patch<Adicional>(`/adicional/${id}`, dto).then(handleResponse),
};

export const estadoPedidoApi = {
  create: (dto: CreateEstadoPedidoDto) => apiClient.post<EstadoPedido>('/estado-pedido', dto).then(handleResponse),
  update: (id: number, dto: UpdateEstadoPedidoDto) => apiClient.patch<EstadoPedido>(`/estado-pedido/${id}`, dto).then(handleResponse),
};

export const productoApi = {
  create: (dto: CreateProductoDto) => apiClient.post<Producto>('/producto', dto).then(handleResponse),
  update: (id: number, dto: UpdateProductoDto) => apiClient.patch<Producto>(`/producto/${id}`, dto).then(handleResponse),
};

// ================= EXPORT =================
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
