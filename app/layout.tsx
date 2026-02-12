import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Realprop Realty - 360° Property Tours",
    description: "Find your perfect property in Chennai with immersive 360° virtual tours. Premium Residential and Commercial properties.",
    manifest: "/manifest.json",
    themeColor: "#FF6B35",
    viewport: "width=device-width, initial-scale=1, maximum-scale=5",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Realprop Realty",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
