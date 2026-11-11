import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/auth";
import { PreferencesProvider } from "@/lib/preferences";
import { Providers } from "./provider";
import { ThemeProvider } from "@/components/theme-provider";
import PostHogProvider from "@/components/posthog-provider";
import { Toaster } from "react-hot-toast";

import { AppLayout } from "@/components/custom/app-layout";
import { ServiceWorker } from "@/components/custom/service-worker";

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

// Headings only (h1-h4 and `font-display`); body text stays on Geist.
const displayFont = Plus_Jakarta_Sans({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EptSsc · Elite Prep Training",
  description: "Elite Prep Training & Precision Transformation for SSC CGL Aspirants",
  applicationName: "EptSsc",
  appleWebApp: { capable: true, title: "EptSsc", statusBarStyle: "default" },
  icons: { apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
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
            className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} font-sans antialiased`}
          >
            <Toaster position="top-center" />
            <ServiceWorker />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <PreferencesProvider>
              <AuthProvider>
                <AppLayout>
                  {children}
                </AppLayout>
              </AuthProvider>
              </PreferencesProvider>
            </ThemeProvider>
          </body>
        </PostHogProvider>
      </Providers>
    </html>
  );
}
