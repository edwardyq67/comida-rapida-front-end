"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModalEditarProducto } from "./modal-editar-producto";
import { Producto } from "@/lib/public-api";

// Columnas optimizadas para tablet
const createColumns = (
  onEditar: (producto: Producto) => void,
  onEliminar: (producto: Producto) => void
): ColumnDef<Producto>[] => [
  {
    accessorKey: "nombre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-medium text-xs md:text-sm"
        >
          Nombre
          <ArrowUpDown className="ml-2 h-3 w-3 md:h-4 md:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-sm md:text-base">{row.getValue("nombre")}</div>
    ),
    size: 150,
  },
  {
    accessorKey: "categoria.nombre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-medium text-xs md:text-sm"
        >
          Categoría
          <ArrowUpDown className="ml-2 h-3 w-3 md:h-4 md:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const categoria = row.original.categoria;
      return (
        <div className="capitalize text-sm md:text-base">
          {categoria?.nombre || "Sin categoría"}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => (
      <div className="max-w-[120px] md:max-w-[200px] truncate text-sm md:text-base">
        {row.getValue("descripcion") || "Sin descripción"}
      </div>
    ),
    size: 200,
  },
  {
    id: "tamanos_disponibles",
    header: "Tamaños",
    cell: ({ row }) => {
      const tamanos = row.original.tamanosDisponibles;
      const tamanosText = tamanos?.map(t => t.tamano?.nombre).filter(Boolean).join(", ") || "Único";
      return (
        <div className="max-w-[120px] md:max-w-[150px] truncate text-sm md:text-base">
          {tamanosText}
        </div>
      );
    },
    size: 150,
  },
  {
    id: "opciones",
    header: "Opciones",
    cell: ({ row }) => {
      const opciones = row.original.opciones;
      const opcionesText = opciones?.map(o => o.opcion?.nombre).filter(Boolean).join(", ") || "Sin opciones";
      return (
        <div className="max-w-[120px] md:max-w-[150px] truncate text-sm md:text-base">
          {opcionesText}
        </div>
      );
    },
    size: 150,
  },
  {
    id: "precio_base",
    header: () => <div className="text-right font-medium text-xs md:text-sm">Precio Base</div>,
    cell: ({ row }) => {
      const precio = row.original.precio;
      const formatted = precio ? new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
      }).format(precio) : "N/A";

      return <div className="text-right font-medium text-sm md:text-base">{formatted}</div>;
    },
    size: 100,
  },
  {
    id: "rango_precios",
    header: () => <div className="text-right font-medium text-xs md:text-sm">Rango Precios</div>,
    cell: ({ row }) => {
      const tamanos = row.original.tamanosDisponibles;
      if (!tamanos || tamanos.length === 0) {
        const precio = row.original.precio;
        return (
          <div className="text-right text-sm md:text-base">
            {precio ? new Intl.NumberFormat("es-PE", {
              style: "currency",
              currency: "PEN",
            }).format(precio) : "N/A"}
          </div>
        );
      }

      const precios = tamanos.map(t => t.precio).filter(price => price != null);
      if (precios.length === 0) return <div className="text-right text-sm md:text-base">N/A</div>;

      const minPrecio = Math.min(...precios);
      const maxPrecio = Math.max(...precios);

      return (
        <div className="text-right text-sm md:text-base">
          {minPrecio === maxPrecio ? (
            new Intl.NumberFormat("es-PE", {
              style: "currency",
              currency: "PEN",
            }).format(minPrecio)
          ) : (
            <div className="space-y-1">
              <div>{new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: "PEN",
              }).format(minPrecio)}</div>
              <div>- {new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: "PEN",
              }).format(maxPrecio)}</div>
            </div>
          )}
        </div>
      );
    },
    size: 120,
  },
  {
    id: "ingredientes",
    header: "Ingredientes",
    cell: ({ row }) => {
      const ingredientes = row.original.ingredientes;
      const ingredientesText = ingredientes?.map(ing => ing.ingrediente?.nombre).filter(Boolean).join(", ") || "Sin ingredientes";
      return (
        <div 
          className="max-w-[120px] md:max-w-[180px] truncate text-sm md:text-base"
          title={ingredientesText}
        >
          {ingredientesText}
        </div>
      );
    },
    size: 180,
  },
  {
    accessorKey: "activo",
    header: "Estado",
    cell: ({ row }) => {
      const activo = row.getValue("activo");
      return (
        <div className={`text-sm md:text-base font-medium ${activo ? "text-green-600" : "text-red-600"}`}>
          {activo ? "Activo" : "Inactivo"}
        </div>
      );
    },
    size: 80,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const producto = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onEditar(producto)} 
              className="text-sm cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onEliminar(producto)} 
              className="text-sm text-red-600 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 80,
  },
];

interface DataTableProductosProps {
  data: Producto[];
  onProductoEditado: () => void;
}

export function DataTableProductos({ data, onProductoEditado }: DataTableProductosProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [productoEditando, setProductoEditando] = React.useState<Producto | null>(null);

  // Configuración de columnas visibles por defecto para tablet
  React.useEffect(() => {
    const handleResize = () => {
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      if (isTablet) {
        setColumnVisibility({
          nombre: true,
          "categoria.nombre": true,
          precio_base: true,
          rango_precios: true,
          activo: true,
          actions: true,
          descripcion: false,
          tamanos_disponibles: false,
          opciones: false,
          ingredientes: false,
        });
      } else {
        // Para desktop, mostrar más columnas
        setColumnVisibility({
          nombre: true,
          "categoria.nombre": true,
          descripcion: true,
          tamanos_disponibles: true,
          opciones: true,
          precio_base: true,
          rango_precios: true,
          ingredientes: true,
          activo: true,
          actions: true,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditarProducto = (producto: Producto) => {
    setProductoEditando(producto);
    setIsModalOpen(true);
  };

  const handleEliminarProducto = async (producto: Producto) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el producto "${producto.nombre}"?`)) {
      try {
        // Aquí iría tu llamada a la API para eliminar
        console.log("Eliminando producto:", producto.id);
        // await adminApi.producto.delete(producto.id);
        onProductoEditado(); // Recargar la tabla
      } catch (error) {
        console.error("Error eliminando producto:", error);
        alert("Error al eliminar el producto");
      }
    }
  };

  const handleProductoActualizado = () => {
    setIsModalOpen(false);
    setProductoEditando(null);
    onProductoEditado(); // Recargar la tabla
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductoEditando(null);
  };

  const columns = React.useMemo(
    () => createColumns(handleEditarProducto, handleEliminarProducto),
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* Header responsive */}
      <div className="flex flex-col md:flex-row gap-4 py-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Filtrar por nombre..."
            value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nombre")?.setFilterValue(event.target.value)
            }
            className="pl-10 pr-4 py-2 text-sm md:text-base h-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-0 md:ml-auto h-10">
              <span className="hidden md:inline">Columnas</span>
              <span className="md:hidden">Vista</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-sm"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "actions" ? "Acciones" : 
                     column.id === "precio_base" ? "Precio Base" :
                     column.id === "rango_precios" ? "Rango Precios" :
                     column.id === "tamanos_disponibles" ? "Tamaños" :
                     column.id === "descripcion" ? "Descripción" :
                     column.id === "ingredientes" ? "Ingredientes" :
                     column.id === "opciones" ? "Opciones" : 
                     column.id === "activo" ? "Estado" : 
                     column.id === "categoria.nombre" ? "Categoría" : column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabla con scroll horizontal para tablets */}
      <div className="overflow-x-auto rounded-md border bg-white">
        <div className="min-w-[800px] md:min-w-0">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead 
                        key={header.id}
                        className="text-xs md:text-sm font-medium whitespace-nowrap bg-gray-50"
                        style={{ width: `${header.getSize()}px` }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50 border-b"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className="text-xs md:text-sm py-3 px-4"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-sm md:text-base"
                  >
                    No hay productos encontrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginación responsive */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-gray-600">
          Mostrando {table.getFilteredRowModel().rows.length} de {data.length} producto(s)
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-xs md:text-sm h-9 px-3"
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600 mx-2">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-xs md:text-sm h-9 px-3"
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* Modal de edición */}
      {productoEditando && (
        <ModalEditarProducto
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onProductoActualizado={handleProductoActualizado}
          productoId={productoEditando.id}
        />
      )}
    </div>
  );
}