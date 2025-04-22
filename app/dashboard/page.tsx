'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
    id: string;
    title: string;
    description: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await fetch('/api/tasks');
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            } else if (res.status === 401) {
                router.push('/login');
            } else {
                console.error('Failed to fetch tasks');
            }
            setLoading(false);
        };

        fetchTasks();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen p-4 bg-gray-100">
            <h1 className="text-3xl font-bold text-center mb-4">
                Dashboard
            </h1>
            <button
                onClick={handleLogout}
                className="mb-4 bg-red-600 text-white py-2 px-4 rounded-md"
            >
                Logout
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <h2 className="text-xl font-semibold">
                            {task.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {task.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
