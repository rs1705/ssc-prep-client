import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quant",
  description: "Quantitative Aptitude section",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
