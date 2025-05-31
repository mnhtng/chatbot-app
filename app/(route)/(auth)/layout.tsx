import { ChatProvider } from '@/components/ui/chat';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function LoginLayout({ children }: PropsWithChildren) {
    const cookieStore = cookies();
    const user = (await cookieStore).get("user")?.value;

    if (user) {
        return redirect('/');
    }

    return (
        <>
            <ChatProvider>
                {children}
            </ChatProvider>
        </>
    );
}