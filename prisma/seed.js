import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    await prisma.user.createMany({
        data: [
            {
                name: 'Lead User',
                email: 'lead@example.com',
                password,
                role: 'LEAD',
            },
            {
                name: 'Team User',
                email: 'team@example.com',
                password,
                role: 'TEAM',
            },
        ],
        skipDuplicates: true,
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
