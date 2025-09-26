// components/withAuth.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth-api';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const authResult = await authService.verifyAuth();
          
          if (!authResult.authenticated) {
            router.replace('/login');
            return;
          }
          
          setIsAuthenticated(true);
          setIsLoading(false);
        } catch (error) {
          console.error('Error verifying auth:', error);
          router.replace('/login');
        }
      };

      checkAuth();
    }, [router]);

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
};

export default withAuth;