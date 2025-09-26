"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  adminApi,
  type Categoria,
  type Ingrediente,
  type Tamano,
  type Opcion,
  type UpdateProductoDto,
} from "@/lib/admin-api";
import publicApi from "@/lib/public-api";
import { CheckIcon, ImageIcon, Settings } from "lucide-react";

// Importar los modales de creación
import { ModalCrearCategoria } from "./modal-crear-categoria";
import { ModalCrearTamano } from "./modal-crear-tamano";
import { ModalCrearOpcion } from "./modal-crear-opcion";
import { ModalCrearIngrediente } from "./modal-crear-ingrediente";
import { ModalImagen } from "./modal-imagen";

interface ModalEditarProductoProps {
  isOpen: boolean;
  onClose: () => void;
  onProductoActualizado: () => void;
  productoId: number | null;
}

export function ModalEditarProducto({
  isOpen,
  onClose,
  onProductoActualizado,
  productoId,
}: ModalEditarProductoProps) {
  const [loading, setLoading] = useState(false);
  const [cargandoProducto, setCargandoProducto] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [tamanos, setTamanos] = useState<Tamano[]>([]);
  const [opciones, setOpciones] = useState<Opcion[]>([]);

  // Estados para controlar la apertura de los modales
  const [modalImagenOpen, setModalImagenOpen] = useState(false);
  const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false);
  const [modalTamanoOpen, setModalTamanoOpen] = useState(false);
  const [modalOpcionOpen, setModalOpcionOpen] = useState(false);
  const [modalIngredienteOpen, setModalIngredienteOpen] = useState(false);

  const [formData, setFormData] = useState<UpdateProductoDto>({
    nombre: "",
    descripcion: "",
    imagen: "",
    precio: 0,
    activo: true,
    categoria_id: 0,
    ingredientes: [],
    opciones: [],
    tamanosDisponibles: [],
  });

  // Función para cargar los datos del producto
  const cargarProducto = async (id: number) => {
    try {
      setCargandoProducto(true);
      const producto = await publicApi.producto.findOne(id);
      
      // Mapear los datos del producto al formato correcto del formulario
      setFormData({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        imagen: producto.imagen || "",
        precio: producto.precio || 0,
        activo: producto.activo,
        categoria_id: producto.categoria?.id || producto.categoria_id || 0,
        tamano_id: producto.tamano?.id || producto.tamano_id || undefined,

        // Mapear ingredientes correctamente
        ingredientes: producto.ingredientes?.map((ing) => ({
          ingrediente_id: ing.ingrediente?.id || ing.ingrediente_id,
          opcional: ing.opcional || false,
          por_defecto: ing.por_defecto !== undefined ? ing.por_defecto : true,
        })) || [],

        // Mapear opciones correctamente
        opciones: producto.opciones?.map((op) => ({
          opcion_id: op.opcion?.id || op.opcion_id,
        })) || [],

        // Mapear tamaños disponibles correctamente
        tamanosDisponibles: producto.tamanosDisponibles?.map((tam) => ({
          tamano_id: tam.tamano?.id || tam.tamano_id,
          precio: tam.precio || producto.precio || 0,
        })) || [],
      });
    } catch (error) {
      console.error("Error cargando producto:", error);
      alert("Error al cargar el producto. Por favor, intente nuevamente.");
    } finally {
      setCargandoProducto(false);
    }
  };

  // Función para recargar los datos
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [categoriasData, ingredientesData, tamanosData, opcionesData] =
        await Promise.all([
          publicApi.categoria.findAll(),
          publicApi.ingrediente.findAll(),
          publicApi.tamano.findAll(),
          publicApi.opcion.findAll(),
        ]);

      setCategorias(categoriasData);
      setIngredientes(ingredientesData);
      setTamanos(tamanosData);
      setOpciones(opcionesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && productoId) {
      cargarDatos();
      cargarProducto(productoId);
    } else if (isOpen) {
      // Reset form cuando se abre para crear nuevo
      setFormData({
        nombre: "",
        descripcion: "",
        imagen: "",
        precio: 0,
        activo: true,
        categoria_id: 0,
        ingredientes: [],
        opciones: [],
        tamanosDisponibles: [],
      });
      cargarDatos();
    }
  }, [isOpen, productoId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Manejar ingredientes
  const handleIngredienteClick = (ingredienteId: number, checked: boolean) => {
    setFormData((prev) => {
      const ingredientesActuales = prev.ingredientes || [];

      if (checked) {
        if (!ingredientesActuales.find((ing) => ing.ingrediente_id === ingredienteId)) {
          return {
            ...prev,
            ingredientes: [
              ...ingredientesActuales,
              {
                ingrediente_id: ingredienteId,
                opcional: false,
                por_defecto: true,
              },
            ],
          };
        }
      } else {
        return {
          ...prev,
          ingredientes: ingredientesActuales.filter((ing) => ing.ingrediente_id !== ingredienteId),
        };
      }

      return prev;
    });
  };

  // Manejar cambios en propiedades de ingredientes
  const handleIngredientePropChange = (
    ingredienteId: number,
    field: "opcional" | "por_defecto",
    value: boolean
  ) => {
    setFormData((prev) => {
      const nuevosIngredientes = (prev.ingredientes || []).map((ing) => {
        if (ing.ingrediente_id === ingredienteId) {
          return { ...ing, [field]: value };
        }
        return ing;
      });

      return {
        ...prev,
        ingredientes: nuevosIngredientes,
      };
    });
  };

  // Manejar opciones
  const handleOpcionClick = (opcionId: number, checked: boolean) => {
    setFormData((prev) => {
      const opcionesActuales = prev.opciones || [];

      if (checked) {
        if (!opcionesActuales.find((o) => o.opcion_id === opcionId)) {
          return {
            ...prev,
            opciones: [
              ...opcionesActuales,
              {
                opcion_id: opcionId,
              },
            ],
          };
        }
      } else {
        return {
          ...prev,
          opciones: opcionesActuales.filter((o) => o.opcion_id !== opcionId),
        };
      }

      return prev;
    });
  };

  // Manejar tamaños disponibles
  const handleTamanoDisponibleClick = (tamanoId: number, checked: boolean) => {
    setFormData((prev) => {
      const tamanosActuales = prev.tamanosDisponibles || [];

      if (checked) {
        if (!tamanosActuales.find((t) => t.tamano_id === tamanoId)) {
          return {
            ...prev,
            tamanosDisponibles: [
              ...tamanosActuales,
              {
                tamano_id: tamanoId,
                precio: formData.precio || 0,
              },
            ],
          };
        }
      } else {
        return {
          ...prev,
          tamanosDisponibles: tamanosActuales.filter((t) => t.tamano_id !== tamanoId),
        };
      }

      return prev;
    });
  };

  // Actualizar precio de un tamaño disponible
  const handlePrecioTamanoChange = (tamanoId: number, precio: number) => {
    setFormData((prev) => {
      const nuevosTamanos = (prev.tamanosDisponibles || []).map((t) => {
        if (t.tamano_id === tamanoId) {
          return { ...t, precio };
        }
        return t;
      });

      return {
        ...prev,
        tamanosDisponibles: nuevosTamanos,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoId) return;

    setLoading(true);

    try {
      if (!formData.nombre.trim()) {
        alert("El nombre del producto es requerido");
        setLoading(false);
        return;
      }

      if (!formData.categoria_id) {
        alert("Debe seleccionar una categoría");
        setLoading(false);
        return;
      }

      const productoData: UpdateProductoDto = {
        ...formData,
        precio: typeof formData.precio === "string" ? parseFloat(formData.precio) : formData.precio,
        categoria_id: typeof formData.categoria_id === "string" ? parseInt(formData.categoria_id) : formData.categoria_id,
        ingredientes: formData.ingredientes?.filter((ing) => ing) || [],
        opciones: formData.opciones?.filter((op) => op) || [],
        tamanosDisponibles: formData.tamanosDisponibles?.filter((t) => t) || [],
      };

      await adminApi.producto.update(productoId, productoData);
      onProductoActualizado();
      onClose();
    } catch (error) {
      console.error("Error actualizando producto:", error);
      alert("Error al actualizar el producto. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      imagen: "",
      precio: 0,
      activo: true,
      categoria_id: 0,
      ingredientes: [],
      opciones: [],
      tamanosDisponibles: [],
    });
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[800px] max-h-[95vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl md:text-2xl">
              Editar Producto
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Modifica la información del producto. Todos los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>

          {cargandoProducto ? (
            <div className="flex justify-center py-8 text-lg">
              Cargando producto...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="nombre" className="text-base font-medium">
                      Nombre *
                    </Label>
                  </div>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    placeholder="Nombre del producto"
                    className="text-base h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="categoria_id" className="text-base font-medium">
                      Categoría *
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setModalCategoriaOpen(true)}
                      className="h-8 w-8"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <select
                    id="categoria_id"
                    value={formData.categoria_id || ""}
                    onChange={(e) => handleChange("categoria_id", parseInt(e.target.value))}
                    className="w-full p-3 border rounded-md text-base h-11 bg-white"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-base font-medium">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  placeholder="Descripción del producto"
                  rows={3}
                  className="text-base min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precio" className="text-base font-medium">
                    Precio Base (PEN) *
                  </Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => handleChange("precio", e.target.value)}
                    placeholder="0.00"
                    className="text-base h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="imagen" className="text-base font-medium">
                      Imagen
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setModalImagenOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Biblioteca
                    </Button>
                  </div>
                  <Input
                    id="imagen"
                    value={formData.imagen}
                    onChange={(e) => handleChange("imagen", e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="text-base h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tamano_id" className="text-base font-medium">
                      Tamaño Principal
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setModalTamanoOpen(true)}
                      className="h-8 w-8"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <select
                    id="tamano_id"
                    value={formData.tamano_id || ""}
                    onChange={(e) => handleChange("tamano_id", e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full p-3 border rounded-md text-base h-11 bg-white"
                  >
                    <option value="">Seleccionar tamaño</option>
                    {tamanos.map((tamano) => (
                      <option key={tamano.id} value={tamano.id}>
                        {tamano.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Estado activo */}
              <div className="flex items-center space-x-3 py-2">
                <Switch
                  checked={formData.activo}
                  onCheckedChange={(checked) => handleChange("activo", checked)}
                  className="scale-110"
                />
                <Label className="text-base font-medium cursor-pointer">
                  Producto activo
                </Label>
              </div>

              {/* Tamaños disponibles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Tamaños Disponibles
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setModalTamanoOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Gestionar</span>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tamanos.map((tamano) => {
                    const tamanoDisponible = formData.tamanosDisponibles?.find(
                      (t) => t.tamano_id === tamano.id
                    );
                    const isSelected = !!tamanoDisponible;

                    return (
                      <div
                        key={tamano.id}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleTamanoDisponibleClick(tamano.id, !isSelected)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="peer h-5 w-5 shrink-0 rounded-[4px] border border-gray-300 shadow-xs transition-all 
                                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/50
                                       disabled:cursor-not-allowed disabled:opacity-50
                                       bg-white checked:bg-gray-600 checked:border-gray-600
                                       appearance-none"
                            />
                            <div className="absolute left-0.5 top-0.5 h-4 w-4 pointer-events-none hidden peer-checked:flex items-center justify-center">
                              <CheckIcon className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <Label className="text-base font-medium cursor-pointer">
                            {tamano.nombre}
                          </Label>
                        </div>

                        {isSelected && (
                          <div
                            className="flex items-center space-x-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Label className="text-sm whitespace-nowrap font-medium">
                              Precio:
                            </Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={tamanoDisponible?.precio || 0}
                              onChange={(e) => handlePrecioTamanoChange(tamano.id, parseFloat(e.target.value))}
                              className="w-20 h-8 text-sm"
                              placeholder="0.00"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Opciones */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Opciones</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setModalOpcionOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Gestionar</span>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {opciones.map((opcion) => {
                    const isSelected = formData.opciones?.some(
                      (o) => o.opcion_id === opcion.id
                    );

                    return (
                      <div
                        key={opcion.id}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleOpcionClick(opcion.id, !isSelected)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="peer h-5 w-5 shrink-0 rounded-[4px] border border-gray-300 shadow-xs transition-all 
                                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/50
                                       disabled:cursor-not-allowed disabled:opacity-50
                                       bg-white checked:bg-gray-600 checked:border-gray-600
                                       appearance-none"
                            />
                            <div className="absolute left-0.5 top-0.5 h-4 w-4 pointer-events-none hidden peer-checked:flex items-center justify-center">
                              <CheckIcon className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <Label className="text-base font-medium cursor-pointer">
                            {opcion.nombre}
                          </Label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ingredientes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Ingredientes</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setModalIngredienteOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Gestionar</span>
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Seleccionar ingredientes
                    </Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                      {ingredientes.map((ingrediente) => {
                        const isSelected = formData.ingredientes?.some(
                          (ing) => ing.ingrediente_id === ingrediente.id
                        );
                        return (
                          <div
                            key={ingrediente.id}
                            className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => handleIngredienteClick(ingrediente.id, !isSelected)}
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="peer h-5 w-5 shrink-0 rounded-[4px] border border-gray-300 shadow-xs transition-all 
                                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/50
                                         disabled:cursor-not-allowed disabled:opacity-50
                                         bg-white checked:bg-gray-600 checked:border-gray-600
                                         appearance-none"
                              />
                              <div className="absolute left-0.5 top-0.5 h-4 w-4 pointer-events-none hidden peer-checked:flex items-center justify-center">
                                <CheckIcon className="h-4 w-4 text-white" />
                              </div>
                            </div>
                            <Label className="text-base cursor-pointer">
                              {ingrediente.nombre}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Configurar ingredientes seleccionados
                    </Label>
                    <div className="space-y-3 max-h-48 overflow-y-auto border rounded-lg p-3">
                      {formData.ingredientes?.map((ingredienteProducto) => {
                        const ingredienteInfo = ingredientes.find(
                          (ing) => ing.id === ingredienteProducto.ingrediente_id
                        );

                        if (!ingredienteInfo) return null;

                        return (
                          <div
                            key={ingredienteProducto.ingrediente_id}
                            className="space-y-3 p-3 border rounded-lg"
                          >
                            <div className="font-medium text-base">
                              {ingredienteInfo.nombre}
                            </div>
                            <div className="flex flex-col space-y-2">
                              <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => handleIngredientePropChange(ingredienteProducto.ingrediente_id, "opcional", !ingredienteProducto.opcional)}
                              >
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    checked={ingredienteProducto.opcional}
                                    readOnly
                                    className="peer h-4 w-4 shrink-0 rounded-[4px] border border-gray-300 shadow-xs transition-all 
                                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/50
                                             disabled:cursor-not-allowed disabled:opacity-50
                                             bg-white checked:bg-gray-600 checked:border-gray-600
                                             appearance-none"
                                  />
                                  <div className="absolute left-0.5 top-0.5 h-3 w-3 pointer-events-none hidden peer-checked:flex items-center justify-center">
                                    <CheckIcon className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                                <Label className="text-sm cursor-pointer">
                                  Opcional
                                </Label>
                              </div>
                              <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => handleIngredientePropChange(ingredienteProducto.ingrediente_id, "por_defecto", !ingredienteProducto.por_defecto)}
                              >
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    checked={ingredienteProducto.por_defecto}
                                    readOnly
                                    className="peer h-4 w-4 shrink-0 rounded-[4px] border border-gray-300 shadow-xs transition-all 
                                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/50
                                             disabled:cursor-not-allowed disabled:opacity-50
                                             bg-white checked:bg-gray-600 checked:border-gray-600
                                             appearance-none"
                                  />
                                  <div className="absolute left-0.5 top-0.5 h-3 w-3 pointer-events-none hidden peer-checked:flex items-center justify-center">
                                    <CheckIcon className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                                <Label className="text-sm cursor-pointer">
                                  Por defecto
                                </Label>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {(!formData.ingredientes || formData.ingredientes.length === 0) && (
                        <div className="text-base text-gray-500 text-center py-4">
                          No hay ingredientes seleccionados
                        </div>
                      )}
                    </div>
                  </div>
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
                  {loading ? "Actualizando..." : "Actualizar Producto"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modales para crear nuevas entidades */}
      <ModalCrearCategoria
        isOpen={modalCategoriaOpen}
        onClose={() => setModalCategoriaOpen(false)}
        onCategoriaCreada={cargarDatos}
      />

      <ModalCrearTamano
        isOpen={modalTamanoOpen}
        onClose={() => setModalTamanoOpen(false)}
        onTamanoCreado={cargarDatos}
      />

      <ModalCrearOpcion
        isOpen={modalOpcionOpen}
        onClose={() => setModalOpcionOpen(false)}
        onOpcionCreada={cargarDatos}
      />

      <ModalCrearIngrediente
        isOpen={modalIngredienteOpen}
        onClose={() => setModalIngredienteOpen(false)}
        onIngredienteCreado={cargarDatos}
      />

      {/* Modal de imágenes - MOVIDO FUERA del Dialog principal */}
      <ModalImagen
        isOpen={modalImagenOpen}
        onClose={() => setModalImagenOpen(false)}
        onImageSelect={(imageUrl) => {
          handleChange("imagen", imageUrl);
          setModalImagenOpen(false);
        }}
        currentImageUrl={formData.imagen}
      />
    </>
  );
}