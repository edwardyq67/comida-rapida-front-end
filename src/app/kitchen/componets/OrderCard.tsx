import { StatusBadge } from './StatusBadge';
import { OrderItem } from './OrderItem';
import { Pedido } from '@/lib/public-api';
import { pedidoPublicApi } from '@/lib/public-api'; // Importar la API

interface OrderCardProps {
  order: Pedido;
  onStatusChange: (orderId: number, newStatusId: number) => void;
}

export const OrderCard = ({ order, onStatusChange }: OrderCardProps) => {
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'Hora no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Hora inválida';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus.toUpperCase()) {
      case 'PENDIENTE':
        return { id: 2, name: 'COCINADO' };
      case 'COCINADO':
        return { id: 3, name: 'FALTA PAGAR' };
      case 'FALTA PAGAR':
        return { id: 4, name: 'PAGADO' };
      default:
        return null;
    }
  };

  // Calcular el total sumando los subtotales de los items
  const calculateTotal = () => {
    if (!order.pedidoItems || order.pedidoItems.length === 0) return 0;
    
    return order.pedidoItems.reduce((total, item) => {
      return total + (item.subtotal || 0);
    }, 0);
  };

  // Función para manejar el cambio de estado
  const handleStatusChange = async (orderId: number, newStatusId: number) => {
    try {
      // Llamar a la API para actualizar el estado
      await pedidoPublicApi.updateEstado(orderId, newStatusId);
      
      // Llamar a la función prop para notificar al componente padre
      onStatusChange(orderId, newStatusId);
      
      console.log(`Pedido ${orderId} actualizado a estado ${newStatusId}`);
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
      // Puedes agregar aquí un toast de error o alerta
      alert('Error al actualizar el estado del pedido');
    }
  };

  const total = calculateTotal();

  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
        <p className="text-red-500">Error: Pedido no disponible</p>
      </div>
    );
  }

  const nextStatus = order.estado ? getNextStatus(order.estado.nombre) : null;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Pedido #{order.id || 'N/A'}</h3>
            {order.estado && <StatusBadge status={order.estado.nombre} />}
          </div>
          <p className="text-sm text-gray-600">
            Cliente: <span className="font-medium">{order.cliente || 'No especificado'}</span>
          </p>
          <p className="text-xs text-gray-500">
            Hora: {formatDate(order.fecha_creacion)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            S/ {total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Notas del pedido */}
      {order.notas && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Nota del cliente:</span> {order.notas}
          </p>
        </div>
      )}

      {/* Items del pedido */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
        {order.pedidoItems && order.pedidoItems.length > 0 ? (
          order.pedidoItems.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No hay items en este pedido</p>
        )}
      </div>

      {/* Botón de cambio de estado */}
      {nextStatus && (
        <div className="flex justify-end">
          <button
            onClick={() => handleStatusChange(order.id, nextStatus.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Marcar como {nextStatus.name}
          </button>
        </div>
      )}
    </div>
  );
};