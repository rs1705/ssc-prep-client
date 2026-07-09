import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Maths",
    description: "Maths section",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="mx-2">{children}</div>;
}