"use client"

import {
    ChevronsUpDown,
    LogOut,
    Sparkles,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { logout } from "@/app/api/auth"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { useChat } from "@/components/ui/chat"
// import { getSession } from "next-auth/react"
// import { useEffect, useState } from "react"
// import { Session } from "next-auth"

export function NavUser() {
    const { isMobile } = useSidebar()
    const { model, setModel, setChatState, setError, setMessage } = useChat()

    // const [session, setSession] = useState<Session>({
    //     user: {
    //         name: "",
    //         email: "",
    //         image: "",
    //     },
    //     expires: "",
    // })

    const { data: session } = useSession()

    // useEffect(() => {
    //     const fetchSession = async () => {
    //         const session = await getSession()

    //         if (session) {
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             setSession(session as any)
    //             console.log(">>> After Session: ", session)
    //         }
    //     }

    //     fetchSession()
    // }, [])

    const onLogout = async () => {
        setChatState({ state: "idle", inbox: null })
        setError(null)
        setMessage(null)

        await logout()
        window.location.href = "/"
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {session?.user?.image ? (
                                    <Image
                                        src={session?.user?.image}
                                        alt={session?.user?.name || ''}
                                        width={32}
                                        height={32}
                                        priority
                                    />
                                ) : (
                                    <AvatarFallback className="rounded-lg">
                                        US
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{session?.user?.name}</span>
                                <span className="truncate text-xs">{session?.user?.email}</span>
                            </div>

                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {session?.user?.image ? (
                                        <Image
                                            src={session?.user?.image}
                                            alt={session?.user?.name || ''}
                                            width={32}
                                            height={32}
                                            priority
                                        />
                                    ) : (
                                        <AvatarFallback className="rounded-lg">
                                            US
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{session?.user?.name}</span>
                                    <span className="truncate text-xs">{session?.user?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        {/* <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup> */}

                        <DropdownMenuSeparator />

                        <div
                            className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 dark:focus:bg-accent/50"
                        >
                            <Sparkles />
                            AI Mode
                            <Switch
                                checked={model === "ai"}
                                onCheckedChange={(checked) => setModel(checked ? "ai" : "chatbot")}
                                className="ml-auto"
                            />
                        </div>

                        <DropdownMenuItem
                            onClick={onLogout}
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
