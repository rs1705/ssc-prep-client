import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/auth";
import { Providers } from "./provider";
import { ThemeProvider } from "@/components/theme-provider";
import PostHogProvider from "@/components/posthog-provider";
import { Toaster } from "react-hot-toast";

import { Sidebar } from "@/components/custom/sidebar";
import { TopBar } from "@/components/custom/topbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepPilot",
  description: "Your exam co-pilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Providers>
        <PostHogProvider>
          <body
            className={`${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable} font-sans antialiased`}
          >
            <Toaster position="top-center" />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                <div className="min-h-screen w-full lg:w-[95%] xl:w-[90%] mx-auto flex bg-background text-foreground">
                  {/* Left Sidebar Layout */}
                  <Sidebar />
                  
                  {/* Main Content Area */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <TopBar />
                    <main className="flex-1 px-6 md:px-10 pb-16">
                      {children}
                    </main>
                  </div>
                </div>
              </AuthProvider>
            </ThemeProvider>
          </body>
        </PostHogProvider>
      </Providers>
    </html>
  );
}
