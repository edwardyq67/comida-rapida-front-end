"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { adminApi } from "@/lib/admin-api";

interface ModalCrearCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriaCreada: () => void;
}

export function ModalCrearCategoria({
  isOpen,
  onClose,
  onCategoriaCreada,
}: ModalCrearCategoriaProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    imagen: "",
    activo: true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.nombre.trim()) {
        alert("El nombre de la categoría es requerido");
        return;
      }

      await adminApi.categoria.create({
        nombre: formData.nombre.trim(),
        imagen: formData.imagen.trim(),
        activo: formData.activo,
      });

      onCategoriaCreada();
      onClose();
      setFormData({ nombre: "", imagen: "", activo: true });
    } catch (error) {
      console.error("Error creando categoría:", error);
      alert("Error al crear la categoría. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ nombre: "", imagen: "", activo: true });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] md:max-w-[500px] max-h-[95vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl md:text-2xl">
            Crear Nueva Categoría
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Completa la información de la nueva categoría.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-base font-medium">
                Nombre *
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Ej: Bebidas, Postres, etc."
                className="text-base h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagen" className="text-base font-medium">
                URL de la imagen
              </Label>
              <Input
                id="imagen"
                value={formData.imagen}
                onChange={(e) => handleChange("imagen", e.target.value)}
                placeholder="https://ejemplo.com/imagen.png"
                className="text-base h-11"
              />
            </div>

            <div className="flex items-center space-x-3 py-2">
              <Switch
                checked={formData.activo}
                onCheckedChange={(checked) => handleChange("activo", checked)}
                className="scale-110"
              />
              <Label className="text-base font-medium cursor-pointer">
                Categoría activa
              </Label>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-11 text-base px-6 flex-1 md:flex-none"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-11 text-base px-6 flex-1 md:flex-none"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Categoría"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}