"use client"

import { SquarePen } from 'lucide-react'
import React from 'react'
import { useChat } from '@/components/ui/chat'

const NewChatButton = ({
    className = '',
}: React.ComponentPropsWithoutRef<'button'> & {
    className?: string
}) => {
    const { state, setChatState } = useChat()

    const handleNewChat = () => {
        setChatState({ state: state === 'creating' ? 'idle' : 'creating' })
    }

    return (
        <SquarePen
            className={`w-4 h-4 ${className}`}
            onClick={handleNewChat}
        />
    )
}

export default NewChatButton
