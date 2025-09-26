"use client"

import * as React from "react"
import {
  PieChart,
  Package,
  Settings2,
  PlusSquare,
  ShoppingCart,
  Tags,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavProjects } from "./nav-projects"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth-api"
import { Button } from "@/components/ui/button"

// Datos
const data = {
  user: {
    name: "Administrador",
    email: "admin@comidarapida.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Restaurante Principal",
      logo: Package,
      plan: "Premium",
    },
  ],
  projects: [
    { name: "Dashboard", icon: PieChart },
    { name: "Productos", icon: Package },
    { name: "Categorías e Ingredientes", icon: Settings2 },
    { name: "Adicionales", icon: PlusSquare },
    { name: "Pedidos", icon: ShoppingCart },
    { name: "Menú del Día", icon: Tags },
    { name: "Ofertas Especiales", icon: Tags },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      router.push("/login")
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
