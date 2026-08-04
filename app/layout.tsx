import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const SITE_URL = "https://www.realproprealty.com";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#FF6B35",
};

export const metadata: Metadata = {
    title: "Realprop Realty - 360° Property Tours",
    description: "Find your perfect property in Chennai with immersive 360° virtual tours. Premium Residential and Commercial properties.",
    metadataBase: new URL(SITE_URL),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Realprop Realty - 360° Property Tours",
        description: "Find your perfect property in Chennai with immersive 360° virtual tours. Premium Residential and Commercial properties.",
        url: SITE_URL,
        siteName: "Realprop Realty",
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Realprop Realty - 360° Property Tours",
        description: "Find your perfect property in Chennai with immersive 360° virtual tours. Premium Residential and Commercial properties.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    manifest: "/manifest.json",
    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
    },
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
