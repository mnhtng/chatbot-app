"use client"

import {
    Check,
    MoreHorizontal,
    PenTool,
    Trash2,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { useChat } from "@/components/ui/chat"
import useInbox from "@/hooks/useInbox"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { AutoCloseAlert } from "@/utils/alertUtil"

interface ActionProps {
    action: string | null
    isLoading: boolean
}

export function ChatHistory() {
    const { isMobile } = useSidebar()
    const { data: session } = useSession()
    const { state, inbox, setChatState, setError, setMessage } = useChat()
    const { getUserInboxes, renameChat, deleteChat } = useInbox()

    const [userInboxes, setUserInboxes] = useState([])
    const [inboxAction, setInboxAction] = useState<ActionProps>({
        action: null,
        isLoading: false
    })

    const fetchInboxes = async () => {
        if (session?.user.conversation) {
            const inboxes = await getUserInboxes(session.user.conversation)

            if (inboxes?.error) {
                AutoCloseAlert({
                    onStart: () => {
                        setError(inboxes.error)
                    },
                    onClose: () => {
                        setError(null)
                    }
                })
                return
            }

            setUserInboxes(inboxes)
        }
    }

    const fetchUserInboxes = async () => {
        await fetchInboxes()
    }

    useEffect(() => {
        fetchUserInboxes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, state, inbox])

    const onRenameMode = (inboxId: string) => {
        setInboxAction({
            action: inboxId,
            isLoading: false
        })
    }

    const handleRenameChat = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const newName = formData.get("chatName") as string

        if (!newName.trim()) {
            AutoCloseAlert({
                onStart: () => {
                    setError("Chat name cannot be empty")
                    setInboxAction({
                        action: null,
                        isLoading: false
                    })
                },
                onClose: () => {
                    setError(null)
                }
            })
            return
        }

        try {
            setInboxAction({
                action: inboxAction.action,
                isLoading: true
            })

            const res = await renameChat({
                inboxId: inboxAction.action as string,
                newName: newName.trim(),
            })

            if (res?.error) {
                AutoCloseAlert({
                    onStart: () => {
                        setError(res.error)
                    },
                    onClose: () => {
                        setError(null)
                    }
                })
                return
            }

            AutoCloseAlert({
                onStart: () => {
                    setMessage(res)
                },
                onClose: () => {
                    setMessage(null)
                }
            })

            await fetchInboxes()
        } catch (error) {
            AutoCloseAlert({
                onStart: () => {
                    setError(error instanceof Error ? error.message : "Failed to rename chat")
                },
                onClose: () => {
                    setError(null)
                }
            })
        } finally {
            setInboxAction({
                action: null,
                isLoading: false
            })
        }
    }

    const handleDeleteChat = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const inboxId = formData.get("chatId") as string

        try {
            setInboxAction({
                action: null,
                isLoading: true
            })

            const res = await deleteChat(inboxId)

            if (res?.error) {
                AutoCloseAlert({
                    onStart: () => {
                        setError(res.error)
                    },
                    onClose: () => {
                        setError(null)
                    }
                })
                return
            }

            AutoCloseAlert({
                onStart: () => {
                    setMessage(res)
                    setChatState({ state: "deleting" })
                },
                onClose: () => {
                    setMessage(null)
                }
            })

            await fetchInboxes()
        } catch (error) {
            AutoCloseAlert({
                onStart: () => {
                    setError(error instanceof Error ? error.message : "Failed to delete chat")
                },
                onClose: () => {
                    setError(null)
                }
            })
        } finally {
            setInboxAction({
                action: null,
                isLoading: false
            })
        }
    }

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="flex items-center gap-2 px-3 py-2 text-sidebar-foreground/90 sticky top-0 z-1000 bg-sidebar-background backdrop-opacity-100 backdrop-blur-2xl">
                <span className="text-sidebar-foreground/70">Chat History</span>
            </SidebarGroupLabel>

            <SidebarMenu>
                {userInboxes.length ? (userInboxes.map((ib: { id: string; name: string }) => (
                    <SidebarMenuItem
                        key={ib.id}
                        onClick={() => setChatState({ state: "idle", inbox: ib.id })}
                    >
                        {inboxAction.action === ib.id ? (
                            <form onSubmit={handleRenameChat}>
                                <div className="flex items-center gap-2 px-2">
                                    <Input
                                        type="text"
                                        name="chatName"
                                        defaultValue={ib.name}
                                        className="flex-1 bg-sidebar-background text-sidebar-foreground/90 text-sm font-medium px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-sidebar-accent"
                                        disabled={inboxAction.isLoading}
                                        required
                                    />
                                    <Button
                                        variant={"ghost"}
                                        type="submit"
                                        className="text-sidebar-accent hover:text-sidebar-accent-hover"
                                        disabled={inboxAction.isLoading}
                                        aria-label="Save chat name"
                                    >
                                        <Check className="text-emerald-500 hover:text-emerald-700" />
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <SidebarMenuButton
                                className={`${inbox === ib.id ? "bg-sidebar-border text-sidebar-accent-foreground" : ""} hover:bg-sidebar-border hover:text-sidebar-accent-foreground transition-colors duration-200 rounded-lg justify-between`}
                            >
                                <span className="truncate text-sidebar-foreground/90 text-sm font-medium">
                                    {ib.name}
                                </span>

                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <MoreHorizontal className="text-sidebar-foreground/70" />
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        className="rounded-lg"
                                        side={isMobile ? "bottom" : "right"}
                                        align={isMobile ? "end" : "start"}
                                    >
                                        <DropdownMenuItem
                                            onClick={() => onRenameMode(ib.id)}
                                            className="cursor-pointer"
                                        >
                                            <PenTool className="mr-2" />
                                            Rename
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full justify-start text-red-500 hover:text-red-500"
                                                >
                                                    <Trash2
                                                        className="mr-2"
                                                        stroke="#fb2c36"
                                                    />
                                                    Delete
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Delete Chat
                                                    </DialogTitle>

                                                    <DialogDescription>
                                                        Are you sure you want to delete this chat? This action cannot be undone.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <form onSubmit={handleDeleteChat}>
                                                    <DialogFooter className="sm:justify-end">
                                                        <DialogClose asChild>
                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                                disabled={inboxAction.isLoading}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>

                                                        <Input
                                                            type="hidden"
                                                            name="chatId"
                                                            value={ib.id}
                                                        />

                                                        <Button
                                                            type="submit"
                                                            variant="destructive"
                                                            className="ml-2"
                                                            disabled={inboxAction.isLoading}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))) : (
                    <div className="text-slate-500 px-3 py-2">
                        <p className="text-sm font-medium">No chat history available</p>
                    </div>
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}
