import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    const lead = await prisma.user.upsert({
        where: { email: 'lead@example.com' },
        create: {
            update: {},
            name: 'Lead User',
            email: 'lead@example.com',
            password,
            role: 'LEAD',
        },
    });

    const team = await prisma.user.upsert({
        where: { email: 'team@example.com' },
        update: {},
        create: {
            name: 'Team User',
            email: 'team@example.com',
            password,
            role: 'TEAM',
        },
    });

    console.log({ lead, team });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
