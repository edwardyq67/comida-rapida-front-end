// withAuth.tsx - SOLUCIÓN URGENTE
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuthComponent = (props: P) => {
    const router = useRouter();
    const { isAuthenticated, checkAuth } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuthentication = async () => {
        // Primero confiar en el estado persistente de Zustand
        if (isAuthenticated) {
          setIsLoading(false);
          return;
        }
        
        // Si no está autenticado en el estado, intentar verificar
        try {
          await checkAuth();
        } catch (error) {
          console.error('Error verifying auth:', error);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuthentication();
    }, [isAuthenticated, checkAuth]);

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace('/login');
      }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-2">Verificando autenticación...</span>
        </div>
      );
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithAuthComponent;
};

export default withAuth;