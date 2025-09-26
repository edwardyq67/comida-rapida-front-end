// lib/images-api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_IMAGES;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Client específico para uploads (multipart/form-data)
const uploadClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const imagesApi = {
  // Subir imagen
  upload: async (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('image', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await uploadClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Listar imágenes
  list: async (folder?: string) => {
    const params = folder ? { folder } : {};
    console.log(apiClient)
    const response = await apiClient.get('/list', { params });
    return response.data;
  },

  // Eliminar imagen
  delete: async (imageUrl: string) => {
    const response = await apiClient.delete('/delete', {
      data: { imageUrl },
    });
    return response.data;
  },

  // Subir desde URL
  uploadFromUrl: async (url: string, folder?: string) => {
    const response = await apiClient.post('/upload-from-url', {
      url,
      folder,
    });
    return response.data;
  },
};