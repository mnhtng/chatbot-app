"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CircleChevronRight, Lightbulb, Send, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useResponse from "@/hooks/useResponse";
import { useChat } from "@/components/ui/chat";
import Image from "next/image";
import { AutoCloseAlert } from "@/utils/alertUtil";
import useConversation from "@/hooks/useConversation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoadingDots } from "@/components/icon/animate";
import { useLiveQuery } from "dexie-react-hooks";
import db from "@/db/db";
import {
    codeBlockLookBack,
    findCompleteCodeBlock,
    findPartialCodeBlock,
} from "@llm-ui/code";
import { markdownLookBack } from "@llm-ui/markdown";
import { throttleBasic, useLLMOutput } from "@llm-ui/react";
import Markdown from "@/components/llm/markdown";
import CodeBlock from "@/components/llm/block";

type LLMMessageContentProps = {
    content: string;
    isStreamFinished?: boolean;
};

const LLMMessageContent = ({ content, isStreamFinished = true }: LLMMessageContentProps) => {
    const throttle = useMemo(() => throttleBasic({
        readAheadChars: 10,
        targetBufferChars: 7,
        adjustPercentage: 0.35,
        frameLookBackMs: 10000,
        windowLookBackMs: 2000,
    }), []);

    const { blockMatches } = useLLMOutput({
        llmOutput: content,
        fallbackBlock: {
            component: Markdown,
            lookBack: markdownLookBack(),
        },
        blocks: [
            {
                component: CodeBlock,
                findCompleteMatch: findCompleteCodeBlock(),
                findPartialMatch: findPartialCodeBlock(),
                lookBack: codeBlockLookBack(),
            },
        ],
        isStreamFinished,
        throttle,
    });

    return (
        <div className="space-y-2">
            {blockMatches.map((blockMatch, index) => {
                const Component = blockMatch.block.component;
                return <Component key={index} blockMatch={blockMatch} />;
            })}
        </div>
    );
};

const ChatInterface = () => {
    const { inbox, error, message, setChatState, setError, setMessage } = useChat()
    const { sendMessage } = useResponse()
    const { createChat } = useConversation()

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputPromptRef = useRef<HTMLInputElement>(null)
    const [inputPrompt, setInputPrompt] = useState<string>("")
    const [streamingResponse, setStreamingResponse] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [conversationError, setConversationError] = useState<string | null>(null)

    const listMessage = useLiveQuery(() => {
        if (!inbox) return []

        return db.messages
            .where("conversationId")
            .equals(Number(inbox))
            .toArray()
    }, [inbox])

    const messages = [...(listMessage ?? [])].sort(
        (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    )

    //* Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const input = formData.get("prompt") as string || ""

        if (!input.trim()) return
        setInputPrompt(input)
        setStreamingResponse("")
        setIsLoading(true)
        setConversationError(null)

        try {
            let newInboxChat;

            // Create new chat if inbox is not set
            if (inbox === null) {
                const newChat = await createChat(input)

                if (newChat?.error) {
                    AutoCloseAlert({
                        onStart: () => {
                            setConversationError(newChat.error ?? null)
                            setIsLoading(false)
                        },
                        onClose: () => {
                            setConversationError(null)
                            setIsLoading(false)
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

            const conversationId = newInboxChat ?? inbox

            if (conversationId === null) {
                throw new Error("Conversation is not initialized")
            }

            const res = await sendMessage({
                prompt: input,
                sender: "guest",
                conversationId,
                onStream: (chunk) => {
                    setStreamingResponse((prev) => prev + chunk)
                },
            })

            if (res?.error) {
                AutoCloseAlert({
                    onStart: () => {
                        setConversationError(res.error as string)
                        setIsLoading(false)
                    },
                    onClose: () => {
                        setConversationError(null)
                        setIsLoading(false)
                    }
                })
                return
            }
        } catch (error) {
            AutoCloseAlert({
                onStart: () => {
                    setConversationError(error as string)
                    setIsLoading(false)
                },
                onClose: () => {
                    setConversationError(null)
                    setIsLoading(false)
                }
            })
        } finally {
            setInputPrompt("")
            setIsLoading(false)
            setConversationError(null)

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
    }, [listMessage, inputPrompt, isLoading])

    return (
        <>
            {(conversationError || (error !== null && error !== "")) && (
                <Alert variant="destructive" className="fixed top-16 right-0 z-50 w-[90vw] max-w-sm">
                    <AlertCircle className="h-4 w-4" />

                    <AlertTitle>Error</AlertTitle>

                    <AlertDescription>
                        {conversationError || error}

                        <Button
                            variant="link"
                            className="absolute top-0 right-2 rounded-sm p-0 opacity-70 hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-muted"
                            onClick={() => {
                                setConversationError(null)
                                setIsLoading(false)
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

            <div className="flex flex-1 flex-col overflow-auto gap-4 p-4 md:p-10">
                <div className="mx-auto w-full space-y-4">
                    {(messages.length === 0 && !inputPrompt) ? (
                        <div className="flex h-[60vh] items-center justify-center text-slate-500 flex-col gap-4">
                            <p className="text-lg font-medium">Start a conversation with our Assistant</p>
                            <p className="text-sm text-center max-w-md">
                                Ask a question or select a quick response below to get started.
                            </p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isAssistant = message.sender === "assistant"

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                                >
                                    <div className={`flex gap-3 max-w-[80%] ${isAssistant ? "" : "flex-row-reverse"}`}>
                                        <Avatar className="h-8 w-8">
                                            {isAssistant ? (
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
                                            ) : (
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
                                            )}
                                        </Avatar>

                                        <div
                                            className={`rounded-lg p-3 ${isAssistant ? "bg-muted text-foreground" : "bg-primary text-(--revert-color)"
                                                }`}
                                        >
                                            <div className="whitespace-pre-wrap">
                                                {isAssistant ? (
                                                    <LLMMessageContent content={message.message.trim()} />
                                                ) : (
                                                    <div>{message.message.trim()}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}

                    {inputPrompt ? (
                        <>
                            <div className="flex justify-end">
                                <div className="flex gap-3 max-w-[80%] flex-row-reverse">
                                    <Avatar className="h-8 w-8">
                                        <Image
                                            src="/avatar/user.png"
                                            alt="User Avatar"
                                            width={32}
                                            height={32}
                                            priority
                                        />
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
                                        {streamingResponse ? (
                                            <LLMMessageContent
                                                content={streamingResponse}
                                                isStreamFinished={!isLoading}
                                            />
                                        ) : (
                                            <LoadingDots />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : messages.length > 0 && isLoading && (
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
                                        className={`cursor-pointer group ${isLoading && "select-none pointer-events-none"}`}
                                    >
                                        <span className="flex items-center gap-2 group">
                                            <CircleChevronRight className="-ml-6 opacity-0 group-hover:ml-0 group-hover:opacity-100 transition-all duration-200" />
                                            Cách học tiếng Anh hiệu quả?
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleQuickChat("Quản lý thời gian trong công việc?")}
                                        className={`cursor-pointer group ${isLoading && "select-none pointer-events-none"}`}
                                    >
                                        <span className="flex items-center gap-2 group">
                                            <CircleChevronRight className="-ml-6 opacity-0 group-hover:ml-0 group-hover:opacity-100 transition-all duration-200" />
                                            Quản lý thời gian trong công việc?
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleQuickChat("Cách giảm stress?")}
                                        className={`cursor-pointer group ${isLoading && "select-none pointer-events-none"}`}
                                    >
                                        <span className="flex items-center gap-2 group">
                                            <CircleChevronRight className="-ml-6 opacity-0 group-hover:ml-0 group-hover:opacity-100 transition-all duration-200" />
                                            Cách giảm stress?
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleQuickChat("Cải thiện kỹ năng giao tiếp?")}
                                        className={`cursor-pointer group ${isLoading && "select-none pointer-events-none"}`}
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
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex flex-col justify-end gap-2">
                            <Button type="submit" disabled={isLoading}>
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
