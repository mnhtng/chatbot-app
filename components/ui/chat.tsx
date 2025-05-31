"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

interface ChatStateProps {
    state: "creating" | "idle" | "deleting"
    inbox?: string | null
}

interface ChatContextProps {
    state: "creating" | "idle" | "deleting"
    inbox?: string | null
    setChatState: ({ state, inbox }: ChatStateProps) => Promise<void>
    model: "ai" | "chatbot"
    setModel: (model: "ai" | "chatbot") => void
    error: string | null
    setError: (error: string | null) => void
    message: string | null
    setMessage: (message: string | null) => void
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined)

export function useChat() {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}

export function ChatProvider({
    children,
    ...props
}: React.ComponentProps<"div">) {
    const [chat, setChat] = useState<ChatStateProps>({
        state: "idle",
        inbox: null
    })
    const [error, setError] = useState<string | null>(null)
    const [model, setModel] = useState<"ai" | "chatbot">("chatbot")
    const [message, setMessage] = useState<string | null>(null)

    useEffect(() => {
        const savedModel = localStorage.getItem("chat-model") as "ai" | "chatbot"

        if (savedModel) {
            setModel(savedModel)
        }
    }, [])

    const setChatState = useCallback(async ({
        state,
        inbox = null
    }: ChatStateProps) => {
        try {
            setChat({ state, inbox })
        } catch (error) {
            console.error('Error creating chat:', error)
        }
    }, [])

    const setChatError = useCallback((error: string | null) => {
        setError(error)
    }, [])

    const setChatModel = useCallback((model: "ai" | "chatbot") => {
        localStorage.setItem("chat-model", model)
        setModel(model)
    }, [])

    const setAlert = useCallback((message: string | null) => {
        setMessage(message)
    }, [])

    return (
        <ChatContext.Provider
            value={{
                state: chat.state,
                inbox: chat.inbox,
                setChatState,
                model,
                setModel: setChatModel,
                error,
                setError: setChatError,
                message,
                setMessage: setAlert,
            }}
            {...props}
        >
            {children}
        </ChatContext.Provider>
    )
}
