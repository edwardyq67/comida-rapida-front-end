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

interface ModalCrearOpcionProps {
  isOpen: boolean;
  onClose: () => void;
  onOpcionCreada: () => void;
}

export function ModalCrearOpcion({
  isOpen,
  onClose,
  onOpcionCreada,
}: ModalCrearOpcionProps) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!nombre.trim()) {
        alert("El nombre de la opción es requerido");
        return;
      }

      await adminApi.opcion.create({
        nombre: nombre.trim(),
      });

      onOpcionCreada();
      onClose();
      setNombre("");
    } catch (error) {
      console.error("Error creando opción:", error);
      alert("Error al crear la opción. Por favor, intente nuevamente.");
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
            Crear Nueva Opción
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Ingresa el nombre de la nueva opción.
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
                placeholder="Ej: Caliente, Frío, Picante, etc."
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
              {loading ? "Creando..." : "Crear Opción"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}