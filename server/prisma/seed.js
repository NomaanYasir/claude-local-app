const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main(){
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const user = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: passwordHash,
      name: 'Seed Student'
    }
  });

  const tasksData = [
    {
      title: 'Linear Algebra Review',
      course: 'MATH101',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: 'Matrices, determinants, eigenvalues, and vector spaces. Focus on solving systems and eigen decomposition.',
      userId: user.id
    },
    {
      title: 'Organic Chemistry Summary',
      course: 'CHEM201',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      notes: 'Reaction mechanisms, common functional groups, and NMR interpretation. Create quick reference sheets.',
      userId: user.id
    }
  ];

  for (const t of tasksData) {
    await prisma.task.upsert({ where: { title: t.title }, update: {}, create: t });
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
