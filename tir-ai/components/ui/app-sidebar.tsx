"use client"

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Logo from "./Logo"

// Static menu items
const staticItems = [
  {
    title: "Home",
    url: "./",
    icon: Home,
  },
  {
    title: "Settings",
    url: "./settings",
    icon: Settings,
  },
]

type ClassItem = {
  id: string
  title: string
  url: string
}

type AppSidebarProps = {
  classes: ClassItem[]
}

export function AppSidebar({ classes }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Static Dashboard Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {staticItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dynamic Classes Section */}
        <SidebarGroup>
          <SidebarGroupLabel>My Classes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {classes.length > 0 ? (
                classes.map((classItem) => (
                  <SidebarMenuItem key={classItem.id}>
                    <SidebarMenuButton asChild>
                      <Link href={classItem.url}>
                        <Calendar /> {/* Default icon */}
                        <span>{classItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <span className="text-sm text-gray-500">No classes found</span>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* Add footer content if needed */}
      </SidebarFooter>
    </Sidebar>
  )
}