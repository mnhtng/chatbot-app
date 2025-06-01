"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CircleChevronRight, Lightbulb, Send, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useResponse from "@/hooks/useResponse";
import { useChat } from "@/components/ui/chat";
import useMessage from "@/hooks/useMessage";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { AutoCloseAlert } from "@/utils/alertUtil";
import useInbox from "@/hooks/useInbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoadingDots } from "@/components/icon/animate";

export interface MessagesConversationProps {
    id?: string;
    role: string;
    content: string;
}

export interface ConversationProps {
    messages: MessagesConversationProps[];
    isLoading: boolean;
    error: string | null;
}

export interface GuestConversation {
    messages: MessagesConversationProps[];
    isLoading: boolean;
    error: string | null;
}

const ChatInterface = () => {
    const { data: session } = useSession()
    const { state, inbox, error, model, message, setChatState, setError, setMessage } = useChat()
    const { sendMessage, sendGuestMessage } = useResponse()
    const { getUserMessages } = useMessage()
    const { createNewChat } = useInbox()

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputPromptRef = useRef<HTMLInputElement>(null)
    const [inputPrompt, setInputPrompt] = useState<string>("")
    const [conversation, setConversation] = useState<ConversationProps>({
        messages: [],
        isLoading: false,
        error: null
    })
    const [guestConversation, setGuestConversation] = useState<GuestConversation>({
        messages: [],
        isLoading: false,
        error: null
    })

    const fetchMessages = async (inboxId = null) => {
        if (session?.user?.conversation) {
            const listMessage = await getUserMessages({
                conversationId: session.user.conversation,
                inboxId: inbox || inboxId || ""
            })

            if (listMessage?.error) {
                AutoCloseAlert({
                    onStart: () => {
                        setConversation(prev => ({
                            ...prev,
                            error: listMessage.error as string,
                            isLoading: false
                        }))
                    },
                    onClose: () => {
                        setConversation(prev => ({
                            ...prev,
                            error: null,
                            isLoading: false
                        }))
                    }
                })
                return
            }

            setConversation(prev => ({
                ...prev,
                messages: listMessage,
                isLoading: false,
                error: null
            }))
        }
    }

    const fetchUserMessage = async () => {
        await fetchMessages()
    }

    useEffect(() => {
        if (inbox === "" || inbox === null) {
            setConversation(prev => ({
                ...prev,
                messages: [],
                isLoading: false,
                error: null
            }))
            setGuestConversation(prev => ({
                ...prev,
                messages: [],
                isLoading: false,
                error: null
            }))
            return
        }

        fetchUserMessage()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inbox, state])

    //* Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const input = formData.get("prompt") as string || ""

        if (!input.trim()) return
        setInputPrompt(input)

        setConversation((prev) => ({
            ...prev,
            isLoading: true,
            error: null
        }))

        try {
            //! Guest user
            if (!session?.user.id) {
                setGuestConversation((prev) => ({
                    ...prev,
                    messages: [...prev.messages, { id: Math.random().toString(), role: "user", content: input }],
                    isLoading: true,
                    error: null
                }))

                const res = await sendGuestMessage(input)

                if (res?.error) {
                    AutoCloseAlert({
                        onStart: () => {
                            setGuestConversation((prev) => ({
                                ...prev,
                                error: res.error as string,
                                isLoading: false
                            }))
                        },
                        onClose: () => {
                            setGuestConversation((prev) => ({
                                ...prev,
                                error: null,
                                isLoading: false
                            }))
                        }
                    })
                    return
                }

                setGuestConversation((prev) => ({
                    ...prev,
                    messages: [...prev.messages, { id: Math.random().toString(), role: "assistant", content: res }],
                    isLoading: false,
                    error: null
                }))

                return
            }

            //! Authenticated user
            let newInboxChat;

            // Create new chat if inbox is not set
            if (inbox === "" || inbox === null) {
                const newChat = await createNewChat(session?.user?.conversation as string)

                if (newChat?.error) {
                    AutoCloseAlert({
                        onStart: () => {
                            setConversation((prev) => ({
                                ...prev,
                                error: newChat.error,
                                isLoading: false
                            }))
                        },
                        onClose: () => {
                            setConversation((prev) => ({
                                ...prev,
                                error: null,
                                isLoading: false
                            }))
                        }
                    })
                    return
                }

                setChatState({
                    state: "creating",
                    inbox: newChat.id
                })

                newInboxChat = newChat.id
            }

            const res = await sendMessage({
                model: model,
                prompt: input,
                sender: session?.user?.id as string,
                conversationId: session?.user?.conversation as string,
                inboxId: newInboxChat || inbox || "",
            })

            if (res?.error) {
                AutoCloseAlert({
                    onStart: () => {
                        setConversation((prev) => ({
                            ...prev,
                            error: res.error as string,
                            isLoading: false
                        }))
                    },
                    onClose: () => {
                        setConversation((prev) => ({
                            ...prev,
                            error: null,
                            isLoading: false
                        }))
                    }
                })
                return
            }

            await fetchMessages(newInboxChat)
        } catch (error) {
            AutoCloseAlert({
                onStart: () => {
                    setConversation((prev) => ({
                        ...prev,
                        error: error as string,
                        isLoading: false
                    }))
                },
                onClose: () => {
                    setConversation((prev) => ({
                        ...prev,
                        error: null,
                        isLoading: false
                    }))
                }
            })
        } finally {
            setInputPrompt("")

            setConversation((prev) => ({
                ...prev,
                isLoading: false,
                error: null
            }))

            if (inputPromptRef.current) {
                inputPromptRef.current.value = ""
            }
        }
    }

    const handleQuickChat = (prompt: string) => {
        if (inputPromptRef.current) {
            inputPromptRef.current.value = prompt

            document.querySelector("form#chat")?.dispatchEvent(new Event("submit", {
                bubbles: true,
                cancelable: true
            }))
        }
    }

    //* Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [conversation.messages, guestConversation.messages])

    // console.log("Session: ", session);
    // console.log("Chat Props:", {
    //     "inbox": inbox,
    //     "model": model,
    //     "message": message,
    //     "error": error,
    // });
    // console.log("Conversation State:", conversation);
    // console.log("Guest Conversation State:", guestConversation);

    return (
        <>
            {(conversation.error || guestConversation.error || (error !== null && error !== "")) && (
                <Alert variant="destructive" className="fixed top-16 right-0 z-50 w-[90vw] max-w-sm">
                    <AlertCircle className="h-4 w-4" />

                    <AlertTitle>Error</AlertTitle>

                    <AlertDescription>
                        {conversation.error || error}

                        <Button
                            variant="link"
                            className="absolute top-0 right-2 rounded-sm p-0 opacity-70 hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-muted"
                            onClick={() => {
                                setConversation({ ...conversation, error: null, isLoading: false })
                                setError(null)
                                return true
                            }}
                        >
                            <X size={16} className="text-red-400" />
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {(message !== null && message !== "") && (
                <Alert variant="default" className="fixed top-16 right-0 z-50 w-[90vw] max-w-sm">
                    <AlertCircle className="h-4 w-4" />

                    <AlertTitle>Message</AlertTitle>

                    <AlertDescription>
                        {message}

                        <Button
                            variant="link"
                            className="absolute top-0 right-2 rounded-sm p-0 opacity-70 hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-muted"
                            onClick={() => setMessage(null)}
                        >
                            <X size={16} className="" />
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex flex-1 flex-col overflow-auto gap-4 p-4">
                <div className="mx-auto w-full max-w-2xl space-y-4">
                    {(conversation.messages.length === 0 && guestConversation.messages.length === 0 && !inputPrompt) ? (
                        <div className="flex h-[60vh] items-center justify-center text-slate-500 flex-col gap-4">
                            <p className="text-lg font-medium">Start a conversation with our Assistant</p>
                            <p className="text-sm text-center max-w-md">
                                Ask a question or select a quick response below to get started.
                            </p>
                        </div>
                    ) : conversation.messages.length ? (
                        conversation.messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <Avatar className="h-8 w-8">
                                        {message.role === "user" ? (
                                            <>
                                                {session?.user.image ? (
                                                    <Image
                                                        src={session?.user.image}
                                                        alt="User Avatar"
                                                        width={32}
                                                        height={32}
                                                        priority
                                                    />
                                                ) : (
                                                    <Image
                                                        src="/avatar/user.png"
                                                        alt="User Avatar"
                                                        width={32}
                                                        height={32}
                                                        priority
                                                    />
                                                )}
                                                <AvatarFallback className="text-foreground">US</AvatarFallback>
                                            </>
                                        ) : (
                                            <>
                                                <Image
                                                    src="/avatar/chatbot.png"
                                                    alt="Chatbot Avatar"
                                                    width={32}
                                                    height={32}
                                                    priority
                                                />
                                                <AvatarFallback className="text-foreground">AI</AvatarFallback>
                                            </>
                                        )}
                                    </Avatar>

                                    {/* Content */}
                                    <div
                                        className={`rounded-lg p-3 ${message.role === "user" ? "bg-primary text-(--revert-color)" : "bg-muted text-foreground"
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap">
                                            {message.role === "user" ? (
                                                <div>{message.content.trim()}</div>
                                            ) : (
                                                <div dangerouslySetInnerHTML={{ __html: message.content.trim() }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : guestConversation.messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                                <Avatar className="h-8 w-8">
                                    {message.role === "user" ? (
                                        <>
                                            <Image
                                                src="/avatar/user.png"
                                                alt="User Avatar"
                                                width={32}
                                                height={32}
                                                priority
                                            />
                                            <AvatarFallback className="text-foreground">US</AvatarFallback>
                                        </>
                                    ) : (
                                        <>
                                            <Image
                                                src="/avatar/chatbot.png"
                                                alt="Chatbot Avatar"
                                                width={32}
                                                height={32}
                                                priority
                                            />
                                            <AvatarFallback className="text-foreground">AI</AvatarFallback>
                                        </>
                                    )}
                                </Avatar>

                                {/* Content */}
                                <div
                                    className={`rounded-lg p-3 ${message.role === "user" ? "bg-primary text-(--revert-color)" : "bg-muted text-foreground"
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">
                                        {message.role === "user" ? (
                                            <div>{message.content.trim()}</div>
                                        ) : (
                                            <div dangerouslySetInnerHTML={{ __html: message.content.trim() }} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {inputPrompt && session?.user ? (
                        <>
                            <div className="flex justify-end">
                                <div className="flex gap-3 max-w-[80%] flex-row-reverse">
                                    <Avatar className="h-8 w-8">
                                        {session?.user.image ? (
                                            <Image
                                                src={session?.user.image}
                                                alt="User Avatar"
                                                width={32}
                                                height={32}
                                                priority
                                            />
                                        ) : (
                                            <Image
                                                src="/avatar/user.png"
                                                alt="User Avatar"
                                                width={32}
                                                height={32}
                                                priority
                                            />
                                        )}
                                        <AvatarFallback className="text-foreground">US</AvatarFallback>
                                    </Avatar>

                                    <div className="rounded-lg bg-primary text-(--revert-color) p-3">
                                        {inputPrompt}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[80%]">
                                    <Avatar className="h-8 w-8">
                                        <Image
                                            src="/avatar/chatbot.png"
                                            alt="Chatbot Avatar"
                                            width={32}
                                            height={32}
                                            priority
                                        />
                                        <AvatarFallback className="text-foreground">AI</AvatarFallback>
                                    </Avatar>

                                    <div className="rounded-lg bg-muted text-foreground p-3">
                                        <LoadingDots />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (!session && guestConversation.messages.length > 0 && guestConversation.isLoading) && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[80%]">
                                <Avatar className="h-8 w-8">
                                    <Image
                                        src="/avatar/chatbot.png"
                                        alt="Chatbot Avatar"
                                        width={32}
                                        height={32}
                                        priority
                                    />
                                    <AvatarFallback className="text-foreground">AI</AvatarFallback>
                                </Avatar>

                                <div className="rounded-lg bg-muted text-foreground p-3">
                                    <LoadingDots />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            <footer className="sticky bottom-0 right-0 border-t p-4 z-10 bg-(--revert-color) shadow-lg">
                <form id="chat" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mx-auto flex align-center max-w-2xl gap-2">
                        <div className="flex flex-col h-full justify-end gap-2">
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Lightbulb className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem
                                        onClick={() => handleQuickChat("Cách học tiếng Anh hiệu quả?")}
                                        className={`cursor-pointer group ${(conversation.isLoading || guestConversation.isLoading) && "select-none pointer-events-none"}`}
                                    >
                                        <span className="flex items-center gap-2 group">
                                            <CircleChevronRight className="-ml-6 opacity-0 group-hover:ml-0 group-hover:opacity-100 transition-all duration-200" />
                                            Cách học tiếng Anh hiệu quả?
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleQuickChat("Quản lý thời gian trong công việc?")}
                                        className={`cursor-pointer group ${(conversation.isLoading || guestConversation.isLoading) && "select-none pointer-events-none"}`}
                                    >
                                        <span className="flex items-center gap-2 group">
                                            <CircleChevronRight className="-ml-6 opacity-0 group-hover:ml-0 group-hover:opacity-100 transition-all duration-200" />
                                            Quản lý thời gian trong công việc?
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleQuickChat("Cách giảm stress?")}
                                        className={`cursor-pointer group ${(conversation.isLoading || guestConversation.isLoading) && "select-none pointer-events-none"}`}
                                    >
                                        <span className="flex items-center gap-2 group">
                                            <CircleChevronRight className="-ml-6 opacity-0 group-hover:ml-0 group-hover:opacity-100 transition-all duration-200" />
                                            Cách giảm stress?
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleQuickChat("Cải thiện kỹ năng giao tiếp?")}
                                        className={`cursor-pointer group ${(conversation.isLoading || guestConversation.isLoading) && "select-none pointer-events-none"}`}
                                    >
                                        <span className="flex items-center gap-2 group">
                                            <CircleChevronRight className="-ml-6 opacity-0 group-hover:ml-0 group-hover:opacity-100 transition-all duration-200" />
                                            Cải thiện kỹ năng giao tiếp?
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex flex-1 flex-col items-center gap-2">
                            <Input
                                ref={inputPromptRef}
                                type="text"
                                name="prompt"
                                placeholder="Type your message..."
                                className="flex-1"
                                disabled={conversation.isLoading || guestConversation.isLoading}
                            />
                        </div>

                        <div className="flex flex-col justify-end gap-2">
                            <Button type="submit" disabled={conversation.isLoading || guestConversation.isLoading}>
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </div>
                </form>
            </footer>
        </>
    )
}

export default ChatInterface
