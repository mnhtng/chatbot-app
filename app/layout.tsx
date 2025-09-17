import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import BProgressProviders from "@/contexts/progressbar";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@/styles/globals.css";
import "@/styles/styles.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Chatbot",
  description: "A simple chatbot application",
};

export const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <BProgressProviders>
              <main className="min-h-screen flex flex-col items-center">
                <div className="flex-1 w-full flex flex-col gap-20 items-center">
                  {children}
                </div>
              </main>

              <Toaster richColors />
            </BProgressProviders>
          </SessionProvider>
        </ThemeProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
