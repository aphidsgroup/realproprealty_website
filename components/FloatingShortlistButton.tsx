'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FloatingShortlistButton() {
    const [count, setCount] = useState(0);
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user && data.user.role === 'user') {
                    setIsUser(true);
                    return fetch('/api/shortlist');
                }
                return null;
            })
            .then(res => res?.json())
            .then(data => {
                if (data?.shortlists) setCount(data.shortlists.length);
            })
            .catch(() => { });
    }, []);

    if (!isUser) return null;

    return (
        <Link
            href="/dashboard/shortlists"
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-red-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 px-5 py-3"
        >
            <span className="text-lg">❤️</span>
            <span className="font-bold">{count}</span>
            <span className="text-sm font-medium hidden sm:inline">Shortlisted</span>
        </Link>
    );
}
