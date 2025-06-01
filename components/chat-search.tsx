"use client"

import * as React from "react"
import { CornerDownRight, MessageCircle, Search, SquarePen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useChat } from "@/components/ui/chat"
import { Label } from "@radix-ui/react-label"
import { useEffect, useState, useCallback, useMemo } from "react"
import { Separator } from "@/components/ui/separator"
import { SearchPoster } from "@/components/icon/illustration"
import debounce from "@/utils/performance/debounce"
import useInbox from "@/hooks/useInbox"
import { SearchResultPlaceholder } from "@/components/ui/placeholder"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "next-auth/react"
import NewChatButton from "@/components/new-chat-button"

export interface SearchProps {
    query?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results?: any[]
    loading?: boolean
}

export function ChatSearch() {
    const { data: session } = useSession()
    const { isMobile, open } = useSidebar()
    const { setChatState, setError } = useChat()
    const { searchChats } = useInbox()

    const [searchEngine, setSearchEngine] = useState<SearchProps>({
        query: "",
        results: [],
        loading: false,
    })

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault()
                e.stopPropagation()

                const dialogTrigger = document.querySelector("[data-slot='dialog-trigger']")
                if (dialogTrigger) {
                    (dialogTrigger as HTMLElement).click()
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    const handleSearch = useCallback(async (query: string) => {
        if (!query || query.trim() === "") {
            setSearchEngine((prev) => ({
                ...prev,
                results: [],
                loading: false,
            }))
            return
        }

        const res = await searchChats({
            query,
            conversationId: session?.user?.conversation as string,
        })

        if (res.error) {
            setError(res.error)
            return
        }

        setSearchEngine((prev) => ({
            ...prev,
            results: res || [],
            loading: false,
        }))
    }, [searchChats, session?.user?.conversation, setError])

    const debouncedSearch = useMemo(() => debounce(async (value: string) => {
        await handleSearch(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 500), [session?.user?.conversation])

    const handleRedirectAndCloseSearch = (chatId: string) => {
        const escapeEvent = new KeyboardEvent("keydown", {
            key: "Escape",
            bubbles: true,
            cancelable: true,
        })
        document.dispatchEvent(escapeEvent)

        setChatState({ state: "idle", inbox: chatId })
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    {isMobile || open ? (
                        <div className="flex justify-between items-center gap-2 px-2 cursor-pointer">
                            <Dialog modal={false}>
                                <DialogTrigger asChild>
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search..."
                                            className="pl-8 select-none"
                                            disabled
                                        />
                                        <Label className="absolute right-2 top-2.5 text-xs text-muted-foreground cursor-pointer">
                                            Ctrl + K
                                        </Label>
                                    </div>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-[min(calc(100vw),600px)] max-h-[max(500px, 50%)] border-accent-foreground">
                                    <DialogHeader>
                                        <DialogTitle className="max-w-[95%]">
                                            <Input
                                                placeholder="Search chats..."
                                                value={searchEngine.query}
                                                onChange={(e) => {
                                                    setSearchEngine((prev) => ({
                                                        ...prev,
                                                        query: e.target.value,
                                                        loading: true,
                                                    }))
                                                    debouncedSearch(e.target.value.trim());
                                                }}
                                                className="pl-2 border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                style={{ background: "transparent" }}
                                            />
                                        </DialogTitle>

                                        <Separator className="w-full bg-accent-foreground" />
                                    </DialogHeader>

                                    {searchEngine.loading ? (
                                        <SearchResultPlaceholder />
                                    ) : (searchEngine.results && searchEngine.results.length > 0) ? (
                                        <>
                                            <ScrollArea className="h-[min(calc(100vh-300px),290px)] w-full">
                                                {searchEngine.results.map((result, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between gap-3 p-2 hover:bg-accent rounded cursor-pointer group"
                                                        onClick={() => handleRedirectAndCloseSearch(result.id)}
                                                    >
                                                        <div className="flex items-center justify-between gap-3 p-2">
                                                            <MessageCircle />
                                                            <h3 className="text-sm font-semibold">{result.name}</h3>
                                                        </div>

                                                        <CornerDownRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </>
                                    ) : (
                                        <div className="md:w-[80%] w-[70%] py-9 m-auto flex flex-col gap-5">
                                            <p className="text-center text-muted-foreground">
                                                Search engine is ready to be used. Type your query in the input above.
                                            </p>
                                            <SearchPoster className="w-full h-auto" />
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>

                            <Button
                                size="icon"
                                variant="ghost"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                onClick={() => setChatState({ state: "creating" })}
                            >
                                <SquarePen />
                            </Button>
                        </div>
                    ) : (
                        <SidebarMenuButton tooltip="New Chat">
                            <NewChatButton />
                        </SidebarMenuButton>
                    )}
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    )
} 