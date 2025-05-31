import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/chat-sidebar"
import { Separator } from "@/components/ui/separator"
import { ThemeSwitcher } from "@/components/theme-switcher";
import ChatInterface from "@/components/chat-interface";
import Link from "next/link";
import { auth } from "@/_lib/auth";
import { SessionProvider } from "next-auth/react";
import { ChatProvider } from "@/components/ui/chat";
import NewChatButton from "@/components/new-chat-button";

export interface Validation {
  error: string;
  loading: boolean;
}

export interface AuthErrors {
  success: boolean;
  error: string | null;
}

export interface AuthenticatedUser {
  id: string,
  name: string;
  email: string;
  image?: string;
}

export default async function Home() {
  const session = await auth();

  return (
    <>
      <SessionProvider>
        <SidebarProvider>
          <ChatProvider>
            {session && (
              <AppSidebar />
            )}

            <SidebarInset>
              <header className="sticky top-0 right-0 z-10 bg-(--revert-color) flex justify-between pr-3 h-16 shrink-0 items-center gap-2 border-b">
                <div className="flex items-center gap-2 px-3">
                  {session && (
                    <SidebarTrigger />
                  )}

                  <Separator orientation="vertical" className="mr-2 h-4" />

                  {!session && (
                    <NewChatButton className="cursor-pointer" />
                  )}
                </div>

                <div className="flex items-center gap-2 pr-3">
                  <ThemeSwitcher />

                  {!session && (
                    <div className="">
                      <Link
                        href="/login"
                        className="bg-foreground py-2 px-4 rounded-lg text-sm text-background font-semibold hover:bg-foreground/80 transition-colors duration-200"
                      >
                        Login
                      </Link>
                    </div>
                  )}
                </div>
              </header>

              <ChatInterface />
            </SidebarInset>
          </ChatProvider>
        </SidebarProvider>
      </SessionProvider>
    </>
  );
}
