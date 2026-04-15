"use client"

import * as React from "react"

import {
    Sidebar,
    SidebarContent,
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
        </Sidebar>
    )
}
