"use client"

import * as React from "react"
import {
  PieChart,
  Package,
  Settings2,
  PlusSquare,
  ShoppingCart,
  Tags,
  LucideIcon,
} from "lucide-react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"

// Tipos
interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

interface ProjectItem {
  name: string
  url: string
  icon: LucideIcon
}

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
    { name: "Dashboard", url: "/admin", icon: PieChart },
    { name: "Productos", url: "/admin/productos", icon: Package },
    { name: "Categorías e Ingredientes", url: "/admin/categorias", icon: Settings2 },
    { name: "Adicionales", url: "/admin/adicionales", icon: PlusSquare },
    { name: "Pedidos", url: "/admin/pedidos", icon: ShoppingCart },
    { name: "Menú del Día", url: "/admin/menu-dia", icon: Tags },
    { name: "Ofertas Especiales", url: "/admin/ofertas", icon: Tags },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Pasamos la prop isCollapsed al componente NavProjects */}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}