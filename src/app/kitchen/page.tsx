'use client';
// En el componente padre que usa KitchenTabs
import { useState, useEffect, useCallback } from 'react';
import { publicApi } from '@/lib/public-api';
import { Pedido } from '@/lib/public-api';
import { KitchenTabs } from './componets/KitchenTabs';

const KitchenPage = () => {
  const [activeTab, setActiveTab] = useState('PENDIENTE');
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para cargar los pedidos
  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const pedidos = await publicApi.pedido.findAll();
      setOrders(pedidos);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar pedidos al montar el componente
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: number, newStatusId: number) => {
    try {
      // Actualizar el estado del pedido
      await publicApi.pedido.updateEstado(orderId, newStatusId);
      // Recargar los pedidos para reflejar el cambio
      await loadOrders();
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  if (isLoading) {
    return <div>Cargando pedidos...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <KitchenTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        orders={orders}
        onStatusChange={handleStatusChange}
        onRefreshOrders={loadOrders} // Pasar la función de actualización
      />
    </div>
  );
};

export default KitchenPage;