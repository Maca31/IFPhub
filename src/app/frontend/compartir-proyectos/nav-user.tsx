"use client"

import { ChevronsUpDown } from "lucide-react"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/frontend/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/frontend/components/ui/sidebar"

export function NavUser({
  user,
  uid,
  sig,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  uid?: string | null;
  sig?: string | null;
}) {
  const avatarSrc =
    user.avatar && user.avatar.trim() !== ""
      ? user.avatar
      : `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(
          user.name
        )}`

  const query = uid && sig ? `?uid=${uid}&sig=${sig}` : ""

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href={`/perfil${query}`}>
            <span className="flex w-full items-center gap-2">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarSrc} alt={user.name} />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
