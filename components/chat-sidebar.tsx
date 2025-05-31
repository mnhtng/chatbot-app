"use client"

import * as React from "react"

import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { ChatSearch } from "@/components/chat-search"
import { ChatHistory } from "./chat-history"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <ChatSearch />
            </SidebarHeader>

            <SidebarContent>
                <ChatHistory />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            {/* The same function with SidebarTrigger SidebarTrigger SidebarTrigger component */}
            {/* <SidebarRail /> */}
        </Sidebar>
    )
}
