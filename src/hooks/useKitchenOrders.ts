import publicApi, { Pedido } from '@/lib/public-api';
import { useState, useEffect } from 'react';

export const useKitchenOrders = () => {
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await publicApi.pedido.findAll();
      setOrders(allOrders);
      setError(null);
    } catch (err) {
      setError('Error al cargar los pedidos');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatusId: number) => {
    try {
      const updatedOrder = await publicApi.pedido.updateEstado(orderId, newStatusId);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, estado_id: newStatusId, estado: updatedOrder.estado }
            : order
        )
      );
      return true;
    } catch (err) {
      console.error('Error updating order status:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Opcional: Refrescar automáticamente cada 30 segundos
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    orders,
    loading,
    error,
    refetchOrders: fetchOrders,
    updateOrderStatus,
  };
};