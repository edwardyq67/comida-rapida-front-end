// components/modal-imagen.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { imagesApi } from "@/lib/images-api";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  Folder,
  Trash2,
  Link,
  ExternalLink,
} from "lucide-react";

interface ModalImagenProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
  currentImageUrl?: string;
}

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
}

export function ModalImagen({
  isOpen,
  onClose,
  onImageSelect,
  currentImageUrl,
}: ModalImagenProps) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [folder, setFolder] = useState("products");
  const [urlUpload, setUrlUpload] = useState("");
  const [uploadingUrl, setUploadingUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");

  // Cargar imágenes al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, folder]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await imagesApi.list(folder);
      setImages(data.images?.resources || []);
    } catch (error) {
      console.error("Error cargando imágenes:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const result = await imagesApi.upload(selectedFile, folder);
      if (result.success) {
        await loadImages();
        setSelectedFile(null);
        // Limpiar input de archivo
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadFromUrl = async () => {
    if (!urlUpload.trim()) return;

    setUploadingUrl(true);
    try {
      const result = await imagesApi.uploadFromUrl(urlUpload, folder);
      if (result.success) {
        await loadImages();
        setUrlUpload("");
        setActiveTab("library");
      }
    } catch (error) {
      console.error("Error subiendo imagen desde URL:", error);
      alert("Error al subir la imagen desde la URL");
    } finally {
      setUploadingUrl(false);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    onImageSelect(imageUrl);
    onClose();
  };

  const handleDeleteImage = async (
    imageUrl: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    if (!confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      return;
    }

    try {
      await imagesApi.delete(imageUrl);
      await loadImages();
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      alert("Error al eliminar la imagen");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[65vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ImageIcon className="h-6 w-6" />
            Biblioteca de Imágenes
          </DialogTitle>
          <DialogDescription>
            Selecciona una imagen existente o sube una nueva
          </DialogDescription>
        </DialogHeader>

        <div className="flex-col gap-6 flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-full space-y-6 border-r pr-6">
            <div className="space-y-3">
              <Label
                htmlFor="folder"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Folder className="h-4 w-4" />
                Carpeta
              </Label>
              <select
                id="folder"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="w-full p-3 border rounded-lg bg-background transition-colors hover:bg-accent/50"
              >
                <option value="products">Productos</option>
                <option value="categories">Categorías</option>
                <option value="banners">Banners</option>
                <option value="general">General</option>
              </select>
            </div>

            <div className="space-y-3">
              <Button
                variant={activeTab === "library" ? "default" : "outline"}
                onClick={() => setActiveTab("library")}
                className="w-full justify-start h-11 text-sm font-medium"
              >
                <ImageIcon className="h-4 w-4 mr-3" />
                Biblioteca
              </Button>
              <Button
                variant={activeTab === "upload" ? "default" : "outline"}
                onClick={() => setActiveTab("upload")}
                className="w-full justify-start h-11 text-sm font-medium"
              >
                <Upload className="h-4 w-4 mr-3" />
                Subir Imagen
              </Button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 flex flex-col min-h-0 ">
            {activeTab === "library" ? (
              <div className="flex-1 overflow-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-medium mb-2">
                      No hay imágenes en esta carpeta
                    </p>
                    <p className="text-sm mb-4">
                      Comienza subiendo tu primera imagen
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setActiveTab("upload")}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Subir primera imagen
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-1">
                    {images.map((image) => (
                      <div
                        key={image.public_id}
                        className={`
                          relative group cursor-pointer border-2 rounded-md overflow-hidden 
                          transition-all duration-200 bg-card hover:shadow-lg hover:scale-105
                          ${
                            currentImageUrl === image.secure_url
                              ? "border-primary shadow-md ring-2 ring-primary/20"
                              : "border-border hover:border-primary/30"
                          }
                        `}
                        onClick={() => handleImageClick(image.secure_url)}
                      >
                        {/* Imagen */}
                        <div className="relative aspect-square bg-muted/20">
                          <img
                            src={image.secure_url}
                            alt={image.public_id}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />

                          {/* Overlay hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                          {/* Botón eliminar */}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 shadow-lg"
                            onClick={(e) =>
                              handleDeleteImage(image.secure_url, e)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          {/* Indicador de imagen actual */}
                          {currentImageUrl === image.secure_url && (
                            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                              Seleccionada
                            </div>
                          )}

                          {/* Preview rápido */}
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 shadow-lg bg-background/80"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(image.secure_url, "_blank");
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Efecto de selección */}
                        <div
                          className={`
                          absolute inset-0 rounded-xl border-2 pointer-events-none transition-all
                          ${
                            currentImageUrl === image.secure_url
                              ? "border-primary"
                              : "border-transparent"
                          }
                        `}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Subir desde archivo */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Subir desde archivo</h3>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="cursor-pointer"
                      />
                    </div>
                    <Button
                      onClick={handleUpload}
                      disabled={!selectedFile || uploading}
                      className="flex items-center gap-2 min-w-[120px]"
                      size="lg"
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {uploading ? "Subiendo..." : "Subir"}
                    </Button>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Archivo seleccionado:{" "}
                      <span className="font-medium">{selectedFile.name}</span>
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-4 text-muted-foreground font-medium">
                      O
                    </span>
                  </div>
                </div>

                {/* Subir desde URL */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Subir desde URL</h3>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <Input
                        type="url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={urlUpload}
                        onChange={(e) => setUrlUpload(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleUploadFromUrl}
                      disabled={!urlUpload.trim() || uploadingUrl}
                      className="flex items-center gap-2 min-w-[120px]"
                      size="lg"
                    >
                      {uploadingUrl ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Link className="h-4 w-4" />
                      )}
                      {uploadingUrl ? "Subiendo..." : "Subir"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
