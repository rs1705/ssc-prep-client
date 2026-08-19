import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/auth";
import { Providers } from "./provider";
import { ThemeProvider } from "@/components/theme-provider";
import PostHogProvider from "@/components/posthog-provider";
import { Toaster } from "react-hot-toast";

import { AppLayout } from "@/components/custom/app-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EptSsc · Elite Prep Training",
  description: "Elite Prep Training & Precision Transformation for SSC CGL Aspirants",
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
            className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
          >
            <Toaster position="top-center" />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                <AppLayout>
                  {children}
                </AppLayout>
              </AuthProvider>
            </ThemeProvider>
          </body>
        </PostHogProvider>
      </Providers>
    </html>
  );
}
