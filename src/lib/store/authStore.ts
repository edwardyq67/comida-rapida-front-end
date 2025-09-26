import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService, User, LoginData } from "@/lib/auth-api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

    login: async (credentials: LoginData) => {
  set({ isLoading: true, error: null });

  try {
    const response = await authService.login(credentials);
    console.log("Respuesta del login:", response); // ← Agrega esto

    if (response.user && response.user.rol === "ADMIN") {
      console.log("Usuario es ADMIN, estableciendo autenticación"); // ← Esto
      set({
        user: response.user,
        isAuthenticated: true, 
        isLoading: false,
      });
    } else {
      console.log("Usuario NO es ADMIN o no tiene rol"); // ← Y esto
      set({
        error: "Acceso denegado: se requiere rol de administrador",
        isLoading: false,
      });
      throw new Error("Acceso denegado: se requiere rol de administrador");
    }
  } catch (error: any) {
    // ...
  }
},

      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });

        try {
          const response = await authService.verifyAuth();

          if (
            response.authenticated &&
            response.user &&
            response.user.rol === "ADMIN"
          ) {
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
