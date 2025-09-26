// app/kitchen/layout.tsx - CORREGIDO ✅
import React from "react";

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ✅ Solo contenido, sin html/body
    <main className="min-h-screen bg-background">
      {children}
    </main>
  );
}