// stores/adminStore.ts
import { create } from "zustand";

interface AdminState {
  currentPage: "" | "Productos" | "Categorias" | "Adicionales";
  setPage: (page: AdminState["currentPage"]) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  currentPage: "",
  setPage: (page) => set({ currentPage: page }),
}));
