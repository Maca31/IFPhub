"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/frontend/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/app/frontend/components/ui/sidebar"

export function NavMain({
  items,
  uid,
  sig
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: { title: string; url: string }[]
  }[],
  uid?: string | null,
  sig?: string | null
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menú</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item: any) => {
          const isDisabled = item.disabled;
          const url =
            uid && sig && !item.url.includes("?")
              ? `${item.url}?uid=${uid}&sig=${sig}`
              : item.url
          const isFP = item.title === "FP";

          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem className={isDisabled ? "opacity-50 grayscale pointer-events-none" : ""}>
                <SidebarMenuButton
                  asChild={!isFP && !isDisabled}
                  tooltip={item.title}
                  isActive={item.isActive}
                  disabled={isDisabled}
                >
                  {isFP ? (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  ) : isDisabled ? (
                    <div className="flex w-full items-center gap-2 cursor-not-allowed">
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  ) : (
                    <a href={url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  )}
                </SidebarMenuButton>

                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem: any) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a
                                href={`${subItem.url}?uid=${uid}&sig=${sig}`}
                              >
                                {subItem.title}
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
