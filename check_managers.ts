import { prisma } from './lib/db';

async function checkManagers() {
  const managers = await prisma.manager.findMany();
  console.log('Managers found:', managers.length);
  console.log(JSON.stringify(managers, null, 2));
}

checkManagers()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
