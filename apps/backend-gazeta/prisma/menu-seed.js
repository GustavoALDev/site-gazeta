async function seedMenus(prisma) {
  console.log('Seeding menus...');

  const menus = [
    {
      order: 1,
      name: 'Início',
      type: 'internal',
      routerLink: '/'
    },
    {
      order: 2,
      name: 'Notícias',
      type: 'internal',
      routerLink: '/noticias'
    },
    {
      order: 3,
      name: 'Política',
      type: 'category',
      slug: 'politica'
    },
    {
      order: 4,
      name: 'Esportes',
      type: 'category',
      slug: 'esportes'
    },
    {
      order: 5,
      name: 'Tecnologia',
      type: 'category',
      slug: 'tecnologia'
    },
    {
      order: 6,
      name: 'Sobre',
      type: 'internal',
      routerLink: '/sobre'
    },
    {
      order: 7,
      name: 'Contato',
      type: 'internal',
      routerLink: '/contato'
    }
  ];

  for (const menu of menus) {
    const existingMenu = await prisma.menu.findUnique({
      where: { order: menu.order }
    });

    if (!existingMenu) {
      await prisma.menu.create({
        data: menu
      });
      console.log(`Menu criado: ${menu.name}`);
    } else {
      console.log(`Menu já existe: ${menu.name}`);
    }
  }

  console.log('Menu seeding completed!');
}

module.exports = { seedMenus };

if (require.main === module) {
  const { PrismaClient } = require('../generated/prisma');
  const prisma = new PrismaClient();
  
  seedMenus(prisma)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} 