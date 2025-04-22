import { NextResponse } from 'next/server';

const tasks = [
    { id: 1, title: 'Task 1', description: 'Description of task 1' },
    { id: 2, title: 'Task 2', description: 'Description of task 2' },
    { id: 3, title: 'Task 3', description: 'Description of task 3' },
];

export async function GET() {
    return NextResponse.json(tasks);
}
