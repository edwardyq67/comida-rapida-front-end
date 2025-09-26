// components/nav-projects.tsx
"use client"

import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { useAdminStore } from "@/navegacion/useAdminStore"

interface ProjectItem {
  name: string
  icon: LucideIcon
}

interface NavProjectsProps {
  projects: ProjectItem[]
}

export function NavProjects({ projects }: NavProjectsProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const setPage = useAdminStore((state) => state.setPage)
  const currentPage = useAdminStore((state) => state.currentPage)

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.name} className={currentPage === project.name.toLowerCase() ? "bg-gray-200 rounded" : ""}>
              <SidebarMenuButton asChild>
                <button
                  onClick={() => {
                    switch (project.name) {
                      case "Dashboard":
                        setPage("")
                        break
                      case "Productos":
                        setPage("Productos")
                        break
                      case "Categorías e Ingredientes":
                        setPage("Categorias")
                        break
                      case "Adicionales":
                        setPage("Adicionales")
                        break
                      default:
                        setPage("")
                    }
                  }}
                  className="flex items-center gap-2 w-full text-left p-2"
                >
                  <project.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{project.name}</span>}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
