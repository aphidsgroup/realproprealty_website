import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up — Realprop Realty',
    description: 'Create a Realprop Realty account to save shortlists, track listings, and receive personalized property alerts.',
    alternates: {
        canonical: '/signup',
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

export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return children;
}
