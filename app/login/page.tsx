'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.token);
            router.push('/dashboard');
        } else {
            const data = await res.json();
            setError(data.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">
                    Login
                </h1>
                {error && (
                    <p className="text-red-500 text-sm text-center">
                        {error}
                    </p>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
