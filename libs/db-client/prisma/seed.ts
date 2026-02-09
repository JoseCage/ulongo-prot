import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'ekulu' },
    update: {},
    create: {
      slug: 'ekulu',
      name: 'Instituto de Luanda Demo',
      type: 'K12',
    },
  });

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash('123456', salt);

  // 3. Criar Usuário Admin
  await prisma.user.upsert({
    where: { email: 'admin@ekulu.ao' },
    update: {},
    create: {
      email: 'admin@ekulu.ao',
      name: 'Diretor Geral',
      passwordHash: hash,
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });

  console.log('Seed realizado: admin@ekulu.ao / 123456');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
