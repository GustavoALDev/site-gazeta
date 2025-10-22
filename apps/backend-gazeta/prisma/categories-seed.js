async function seedCategories(prisma) {
  const categories = [
    {
      name: 'Tecnologia',
      description: 'Notícias sobre tecnologia, inovação, startups e mundo digital',
      slug: 'tecnologia'
    },
    {
      name: 'Política',
      description: 'Notícias e análises sobre o cenário político nacional e internacional',
      slug: 'politica'
    },
    {
      name: 'Esportes',
      description: 'Cobertura esportiva completa: futebol, olimpíadas e outros esportes',
      slug: 'esportes'
    },
    {
      name: 'Economia',
      description: 'Notícias sobre economia, mercado financeiro e negócios',
      slug: 'economia'
    },
    {
      name: 'Saúde',
      description: 'Informações sobre saúde, medicina e bem-estar',
      slug: 'saude'
    },
    {
      name: 'Cultura',
      description: 'Arte, música, cinema, literatura e eventos culturais',
      slug: 'cultura'
    },
    {
      name: 'Educação',
      description: 'Notícias sobre educação, ensino e desenvolvimento acadêmico',
      slug: 'educacao'
    }
  ];

  console.log('🌱 Iniciando seed das categorias...');

  for (const category of categories) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: category.name },
          { slug: category.slug }
        ]
      }
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: category
      });
      console.log(`✅ Categoria '${category.name}' criada`);
    } else {
      console.log(`⚠️  Categoria '${category.name}' já existe`);
    }
  }

  console.log('🎉 Seed das categorias concluído!');
}

module.exports = { seedCategories };

if (require.main === module) {
  const { PrismaClient } = require('../generated/prisma');
  const prisma = new PrismaClient();
  
  async function main() {
    try {
      await seedCategories(prisma);
    } catch (error) {
      console.error('❌ Erro durante o seed:', error);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
  }
  main();
} 