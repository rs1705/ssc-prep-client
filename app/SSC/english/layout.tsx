import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "English",
  description: "English section",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
