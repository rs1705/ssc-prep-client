import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flashcards",
  description: "Prepare smarter for SSC exams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
