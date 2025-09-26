// app/restaurante/components/Bienvenidos.tsx
export default function Bienvenidos() {
  return (
    <div className="text-center py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          🍕 ¡Bienvenidos!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Descubre nuestros deliciosos platillos
        </p>
        <div className="">
          <p className="text-gray-700">
            Selecciona una categoría del menú superior para explorar nuestros productos
          </p>
        </div>
      </div>
    </div>
  );
}