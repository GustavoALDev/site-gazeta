const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');
const { seedMenus } = require('./menu-seed');
const { seedCategories } = require('./categories-seed');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // 1. Criar usuário admin
  console.log('👤 Criando usuário administrador...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrador',
      password: hashedPassword,
    },
  });

  console.log(`✅ Usuário criado: ${user.email}\n`);

  // 2. Seed de categorias
  await seedCategories(prisma);
  console.log('');

  // 3. Seed de menus
  await seedMenus(prisma);
  console.log('');

  // 4. Seed de configuração da home (HomeCategoryConfig)
  console.log('🏠 Criando configurações da home...');
  const categories = await prisma.category.findMany({ take: 3 });
  
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const existingConfig = await prisma.homeCategoryConfig.findUnique({
      where: { categoryId: category.id }
    });

    if (!existingConfig) {
      await prisma.homeCategoryConfig.create({
        data: {
          categoryId: category.id,
          displayOrder: i + 1,
          isVisible: true,
          maxNews: 6,
          showTitle: true,
          createdBy: user.id,
        }
      });
      console.log(`✅ Config criada para categoria: ${category.name}`);
    } else {
      console.log(`⚠️  Config já existe para: ${category.name}`);
    }
  }
  console.log('');

  // 5. Seed de notícias de exemplo
  console.log('📰 Criando notícias de exemplo...');
  const techCategory = await prisma.category.findFirst({ where: { slug: 'tecnologia' } });
  
  if (techCategory) {
    const newsSlug = 'bem-vindo-ao-gazeta';
    const existingNews = await prisma.news.findUnique({ where: { slug: newsSlug } });

    if (!existingNews) {
      const news = await prisma.news.create({
        data: {
          title: 'Bem-vindo ao Gazeta',
          subtitle: 'Sua fonte de notícias confiável',
          content: '<p>Bem-vindo ao portal Gazeta! Aqui você encontrará as últimas notícias sobre tecnologia, política, esportes e muito mais.</p>',
          author: 'Admin',
          published: 'true',
          status: 'ACTIVE',
          slug: newsSlug,
          isEmphasis: true,
          authorId: user.id,
          newsCategories: {
            create: {
              categoryId: techCategory.id,
            }
          }
        }
      });
      console.log(`✅ Notícia criada: ${news.title}`);
    } else {
      console.log(`⚠️  Notícia já existe: Bem-vindo ao Gazeta`);
    }
  }
  console.log('');

  // 6. Seed de anúncio de exemplo
  console.log('📢 Criando anúncio de exemplo...');
  const existingAd = await prisma.advertisement.findFirst({
    where: { title: 'Anúncio de Boas-vindas' }
  });

  if (!existingAd) {
    await prisma.advertisement.create({
      data: {
        title: 'Anúncio de Boas-vindas',
        description: 'Anúncio de exemplo para o portal',
        imageUrl: '/img/announcement01.gif',
        position: 'top',
        placement: 'home',
        isActive: true,
        priority: 1,
        createdBy: user.id,
      }
    });
    console.log(`✅ Anúncio criado`);
  } else {
    console.log(`⚠️  Anúncio já existe`);
  }
  console.log('');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 