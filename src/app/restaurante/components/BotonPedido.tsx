// app/restaurante/components/BotonPedido.tsx
'use client';

import { useRestauranteStore } from '@/stores/useRestauranteStore';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export default function BotonPedido() {
  const { totalItems, setPedidoAbierto } = useRestauranteStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all z-50"
          size="icon"
          onClick={() => setPedidoAbierto(true)}
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
    </Sheet>
  );
}