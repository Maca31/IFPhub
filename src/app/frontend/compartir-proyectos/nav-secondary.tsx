"use client"

import { type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/frontend/components/ui/sidebar"

export function NavSecondary({
  items,
  uid,
  sig,
  ...props
}: {
  items: { title: string; url: string; icon: LucideIcon }[],
  uid?: string | null,
  sig?: string | null
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a href={`${item.url}?uid=${uid}&sig=${sig}`}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
