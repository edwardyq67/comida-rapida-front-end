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
import { adminApi } from "@/lib/admin-api";

interface ModalCrearIngredienteProps {
  isOpen: boolean;
  onClose: () => void;
  onIngredienteCreado: () => void;
}

export function ModalCrearIngrediente({
  isOpen,
  onClose,
  onIngredienteCreado,
}: ModalCrearIngredienteProps) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!nombre.trim()) {
        alert("El nombre del ingrediente es requerido");
        return;
      }

      await adminApi.ingrediente.create({
        nombre: nombre.trim(),
      });

      onIngredienteCreado();
      onClose();
      setNombre("");
    } catch (error) {
      console.error("Error creando ingrediente:", error);
      alert("Error al crear el ingrediente. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNombre("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] md:max-w-[500px] max-h-[95vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl md:text-2xl">
            Crear Nuevo Ingrediente
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Ingresa el nombre del nuevo ingrediente.
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
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Ajos, Queso Extra, Salsa BBQ, etc."
                className="text-base h-11"
                required
              />
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
              {loading ? "Creando..." : "Crear Ingrediente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}