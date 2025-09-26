// lib/auth-api.ts
import axios from "axios";

const API_URL_AUTH = process.env.NEXT_PUBLIC_API_URL_AUTH;

// ✅ Configuración CORRECTA para trabajar con cookies 'jwt'
const authApi = axios.create({
  baseURL: API_URL_AUTH,
  withCredentials: true, // 👈 Esto envía automáticamente la cookie 'jwt'
});

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: {
    id: number;
    email: string;
    nombre?: string;
    rol: string;
    creadoEn?: string;
    actualizadoEn?: string;
  };
}

export interface User {
  id: number;
  email: string;
  nombre?: string;
  rol: string;
}

export interface VerifyResponse {
  authenticated: boolean;
  user?: {
    id: number;
    email: string;
    rol: string;
  };
}

class AuthService {
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      console.log("🔐 Iniciando sesión...");
      console.log("URL de login:", `${API_URL_AUTH}/login`);
      
      const response = await authApi.post<AuthResponse>("/login", loginData);
      console.log("✅ Login exitoso - Response:", response.data);
      console.log("✅ Cookie 'jwt' establecida automáticamente por el backend");
      
      return response.data;
    } catch (error: any) {
      console.error("❌ Error en login:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>("/register", registerData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al registrar usuario"
      );
    }
  }

  async logout(): Promise<{ message: string }> {
    try {
      console.log("🔒 Cerrando sesión...");
      const response = await authApi.post<{ message: string }>("/logout");
      console.log("✅ Logout exitoso");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al cerrar sesión"
      );
    }
  }

async verifyAuth(): Promise<VerifyResponse> {
  try {
    const response = await authApi.get<VerifyResponse>("/verify");
    return response.data;
  } catch (error: any) {
    return { authenticated: false };
  }
  }
}

export const authService = new AuthService();