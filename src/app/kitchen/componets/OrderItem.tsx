import { PedidoItem } from "@/lib/public-api";

interface OrderItemProps {
  item: PedidoItem;
}

export const OrderItem = ({ item }: OrderItemProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3 mb-2 border">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
            {item.cantidad}x
          </span>
          <h4 className="font-semibold text-gray-900">
            {item.producto.nombre}
          </h4>
        </div>
        <span className="font-medium text-gray-900">
          S/ {item.subtotal.toFixed(2)}
        </span>
      </div>


      {/* Ingredientes incluidos */}
      {item.pedidoIngredientes.length > 0 && (
        <div className="text-sm">
          <span className="font-medium text-gray-600">Ingredientes:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {item.pedidoIngredientes.map((ingrediente) => (
              <span
                key={ingrediente.id}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800"
              >
                {ingrediente.ingrediente.nombre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
