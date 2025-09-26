"use client";

import { Pedido } from "@/lib/public-api";
import { OrderCard } from "./OrderCard";
import { useEffect, useState } from 'react';

interface KitchenTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  orders: Pedido[];
  onStatusChange: (orderId: number, newStatusId: number) => void;
  onRefreshOrders: () => Promise<void>;
}

const statusTabs = [
  { id: 'PENDIENTE', name: 'Pendientes', color: 'yellow' },
  { id: 'COCINADO', name: 'Cocinados', color: 'green' },
  { id: 'FALTA PAGAR', name: 'Falta Pagar', color: 'orange' },
  { id: 'PAGADO', name: 'Pagados', color: 'blue' },
];

export const KitchenTabs = ({ 
  activeTab, 
  onTabChange, 
  orders, 
  onStatusChange, 
  onRefreshOrders 
}: KitchenTabsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Asegurar que orders siempre sea un array
  const normalizedOrders = Array.isArray(orders) ? orders : [];

  // Effect para la actualización automática cada 10 segundos
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!isLoading) {
        setIsLoading(true);
        try {
          await onRefreshOrders();
          setLastUpdate(new Date());
        } catch (error) {
          console.error('Error actualizando pedidos:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [onRefreshOrders, isLoading]);

  const getOrdersByStatus = (status: string) => {
    return normalizedOrders.filter(order => 
      order.estado && order.estado.nombre.toUpperCase() === status
    );
  };

  const getTabColor = (color: string) => {
    const colors = {
      yellow: 'border-yellow-500 text-yellow-600 bg-yellow-50',
      green: 'border-green-500 text-green-600 bg-green-50',
      orange: 'border-orange-500 text-orange-600 bg-orange-50',
      blue: 'border-blue-500 text-blue-600 bg-blue-50',
    };
    return colors[color as keyof typeof colors] || 'border-gray-500 text-gray-600 bg-gray-50';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="w-full">
      {/* Header con información de actualización */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Gestión de Pedidos</h2>
        <div className="text-sm text-gray-500 flex items-center space-x-2">
          {isLoading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-2"></div>
              Actualizando...
            </span>
          ) : (
            <span>Última actualización: {formatTime(lastUpdate)}</span>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {statusTabs.map((tab) => {
            const ordersCount = getOrdersByStatus(tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? `${getTabColor(tab.color)} border-${tab.color}-500`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.name}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeTab === tab.id 
                    ? `bg-${tab.color}-100 text-${tab.color}-800`
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {ordersCount}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {statusTabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getOrdersByStatus(tab.id).map((order) => (
                <div key={order.id} className="h-full">
                  <OrderCard order={order} onStatusChange={onStatusChange} />
                </div>
              ))}
            </div>
            
            {getOrdersByStatus(tab.id).length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🍳</div>
                <p className="text-gray-500 text-lg">No hay pedidos {tab.name.toLowerCase()}</p>
                <p className="text-gray-400 text-sm">Los nuevos pedidos aparecerán aquí automáticamente</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};