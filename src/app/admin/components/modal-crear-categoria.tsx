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
import { Image, ImageIcon } from "lucide-react"; // 👈 Importar íconos
import { ModalImagen } from "./modal-imagen";

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
  const [showModalImagen, setShowModalImagen] = useState(false); // 👈 Estado para controlar el modal de imagen
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

  // 👇 Función para manejar la selección de imagen desde el modal
  const handleImageSelect = (imageUrl: string) => {
    handleChange("imagen", imageUrl);
    setShowModalImagen(false);
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
    <>
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

              {/* 👇 Sección de imagen mejorada */}
              <div className="space-y-2">
                <Label htmlFor="imagen" className="text-base font-medium">
                  URL de la imagen
                </Label>

                {/* Input con botón integrado */}
                <div className="flex gap-2">
                  <Input
                    id="imagen"
                    value={formData.imagen}
                    onChange={(e) => handleChange("imagen", e.target.value)}
                    placeholder="https://ejemplo.com/imagen.png"
                    className="text-base h-11 flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModalImagen(true)}
                    className="h-11 px-4 whitespace-nowrap"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Biblioteca
                  </Button>
                </div>

                {/* Vista previa de la imagen */}
                {formData.imagen && (
                  <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Vista previa:
                    </p>
                    <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={formData.imagen}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {!formData.imagen.startsWith("http") && (
                          <div className="text-center text-gray-500">
                            <Image className="h-8 w-8 mx-auto mb-1" />
                            <p className="text-xs">URL no válida</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleChange("imagen", "")}
                      className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Eliminar imagen
                    </Button>
                  </div>
                )}

                {/* Botón alternativo si no hay imagen */}
                {!formData.imagen && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModalImagen(true)}
                    className="w-full h-11 mt-1"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Seleccionar imagen de la biblioteca
                  </Button>
                )}
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

      {/* 👇 Modal de imagen */}
      <ModalImagen
        isOpen={showModalImagen}
        onClose={() => setShowModalImagen(false)}
        onImageSelect={handleImageSelect}
        currentImageUrl={formData.imagen}
      />
    </>
  );
}
