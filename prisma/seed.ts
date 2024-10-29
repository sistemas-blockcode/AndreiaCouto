const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('root', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Pietro Menezes',
      email: 'pietrosantos@blockcode.online',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '11980141941'
    },
  });

  console.log('Admin criado:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
