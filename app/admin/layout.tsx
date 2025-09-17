import { auth } from "@/_lib/auth";
import CmsMobileHeader from "@/components/admin/cms-mobile-header";
import { AdminSidebar } from "@/components/admin/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CmsProvider } from "@/contexts/cmsContext";
import Error from "@/app/error";
import { headers } from "next/headers";

import "@/styles/globals.css";
import "@/styles/styles.css";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth()

    if (!session || session.user.role !== "admin") {
        return (
            <Error statusCode={401} />
        )
    }

    const headersList = await headers()
    const pathname = headersList.get("x-pathname") || ""
    const isErrorPage = pathname.includes('error') || pathname.includes('not-found')

    return (
        <>
            {!isErrorPage ? (
                <SidebarProvider>
                    <CmsProvider>
                        <AdminSidebar />

                        <SidebarInset className="h-screen overflow-hidden">
                            <div className="h-full overflow-y-auto flex flex-col gap-5">
                                <CmsMobileHeader />

                                <div className="px-4 md:px-6">
                                    {children}
                                </div>
                            </div>
                        </SidebarInset>
                    </CmsProvider>
                </SidebarProvider>
            ) : (
                { children }
            )}
        </>
    )
}
