// components/nav-projects.tsx
"use client"

import * as React from "react"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { useSidebar } from "@/components/ui/sidebar"

interface ProjectItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavProjectsProps {
  projects: ProjectItem[]
}

export function NavProjects({ projects }: NavProjectsProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton asChild>
                <Link href={project.url} className="flex items-center gap-2">
                  <project.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{project.name}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}