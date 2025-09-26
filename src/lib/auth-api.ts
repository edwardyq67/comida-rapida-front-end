// lib/auth-api.ts
import axios from 'axios';

const API_URL_AUTH = process.env.NEXT_PUBLIC_API_URL_AUTH|| 'https://comida-rapida-back-end-o5k9.vercel.app/auth';

const authApi = axios.create({
  baseURL: API_URL_AUTH,
  withCredentials: true,
});

export interface LoginData {
  email: string; // 👈 Cambiado de username a email
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
    rol: string; // 👈 Usa 'rol' en lugar de 'role'
  };
  token?: string;
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
      const response = await authApi.post<AuthResponse>('/login', loginData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/register', registerData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  }

  async logout(): Promise<{ message: string }> {
    try {
      const response = await authApi.post<{ message: string }>('/logout');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cerrar sesión');
    }
  }

  async verifyAuth(): Promise<VerifyResponse> {
    try {
      const response = await authApi.get<VerifyResponse>('/verify');
      return response.data;
    } catch (error) {
      return { authenticated: false };
    }
  }
}

export const authService = new AuthService();