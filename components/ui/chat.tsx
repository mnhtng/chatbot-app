"use client"

import { createContext, useCallback, useContext, useState } from "react"

interface ChatStateProps {
    state: "creating" | "idle" | "deleting"
    inbox?: number | null
}

interface ChatContextProps {
    state: "creating" | "idle" | "deleting"
    inbox?: number | null
    setChatState: ({ state, inbox }: ChatStateProps) => Promise<void>
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
    const [message, setMessage] = useState<string | null>(null)

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

    const setAlert = useCallback((message: string | null) => {
        setMessage(message)
    }, [])

    return (
        <ChatContext.Provider
            value={{
                state: chat.state,
                inbox: chat.inbox,
                setChatState,
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
