import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Log In — Realprop Realty',
    description: 'Log in to your Realprop Realty account to access saved shortlists and personalized property activity.',
    alternates: {
        canonical: '/login',
    },
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
