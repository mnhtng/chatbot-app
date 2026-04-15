import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/chat-sidebar"
import { Separator } from "@/components/ui/separator"
import { ThemeSwitcher } from "@/components/theme-switcher";
import ChatInterface from "@/components/chat-interface";
import { ChatProvider } from "@/components/ui/chat";

export default function Home() {
  return (
    <>
      <SidebarProvider>
        <ChatProvider>
          <AppSidebar />

          <SidebarInset>
            <header className="sticky top-0 right-0 z-10 bg-(--revert-color) flex justify-between pr-3 h-16 shrink-0 items-center gap-2 border-b">
              <div className="flex items-center gap-2 px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>

              <div className="flex items-center gap-2 pr-3">
                <ThemeSwitcher />
              </div>
            </header>

            <ChatInterface />
          </SidebarInset>
        </ChatProvider>
      </SidebarProvider>
    </>
  );
}
