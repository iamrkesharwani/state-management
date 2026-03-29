import 'dotenv/config';
import { PrismaClient, Status } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { faker } from '@faker-js/faker';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing existing data...');
  await prisma.task.deleteMany();

  console.log('Seeding 50 random tasks...');

  const tasks = Array.from({ length: 50 }).map(() => ({
    title: faker.hacker.phrase(),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement([Status.PENDING, Status.COMPLETED]),
  }));

  await prisma.task.createMany({
    data: tasks,
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
