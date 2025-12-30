const { PrismaClient } = require('../generated/prisma');
require('dotenv').config();

const prisma = new PrismaClient();

// Função para gerar slug a partir do nome
function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
}

async function seedCategories() {
  const categories = [
    {
      name: 'Política',
      color: '#D62828',
      description: 'Acompanhe decisões do governo, eleições, debates e tudo que molda o cenário político do país e do mundo.'
    },
    {
      name: 'Economia',
      color: '#4361EE',
      description: 'Notícias sobre mercado financeiro, inflação, empregos, investimentos e tendências econômicas.'
    },
    {
      name: 'Mundo',
      color: '#2A9D8F',
      description: 'Os acontecimentos mais relevantes do planeta: diplomacia, conflitos, cultura global e grandes eventos.'
    },
    {
      name: 'Brasil / Nacional',
      color: '#264653',
      description: 'Os fatos mais importantes do país: sociedade, governo, educação, segurança e cotidiano nacional.'
    },
    {
      name: 'Tecnologia',
      color: '#3A0CA3',
      description: 'Novidades sobre inovação, IA, startups, gadgets, softwares e o futuro digital.'
    },
    {
      name: 'Esportes',
      color: '#F77F00',
      description: 'Resultados, competições, atletas, análises e tudo que movimenta o universo esportivo.'
    },
    {
      name: 'Entretenimento',
      color: '#E63946',
      description: 'Filmes, séries, música, celebridades, cultura pop e os temas que mais repercutem no entretenimento.'
    },
    {
      name: 'Cultura',
      color: '#9D4EDD',
      description: 'Literatura, artes, teatro, patrimônio cultural e movimentos culturais em destaque.'
    },
    {
      name: 'Saúde',
      color: '#2EC4B6',
      description: 'Bem-estar, medicina, pesquisas, prevenção e temas que impactam a qualidade de vida.'
    },
    {
      name: 'Ciência',
      color: '#7209B7',
      description: 'Descobertas, espaço, biodiversidade e avanços da pesquisa científica mundial.'
    },
    {
      name: 'Educação',
      color: '#118AB2',
      description: 'Notícias sobre escolas, universidades, ensino, políticas educacionais e tendências na área.'
    },
    {
      name: 'Negócios',
      color: '#1D3557',
      description: 'Inovação corporativa, startups, gestão, investimentos e movimentações empresariais.'
    },
    {
      name: 'Justiça / Polícia',
      color: '#6C757D',
      description: 'Casos policiais, julgamentos, investigações e atualizações do sistema de justiça.'
    },
    {
      name: 'Meio Ambiente',
      color: '#2A9D00',
      description: 'Mudanças climáticas, preservação, energia limpa, sustentabilidade e biodiversidade.'
    },
    {
      name: 'Agricultura / Agro',
      color: '#8D99AE',
      description: 'Safras, tecnologias agrícolas, pecuária, mercado agro e tendências do campo.'
    },
    {
      name: 'Carros / Motor',
      color: '#495057',
      description: 'Lançamentos automotivos, testes, mobilidade, mercado de carros e inovações do setor.'
    },
    {
      name: 'Opinião',
      color: '#5F0F40',
      description: 'Artigos, colunas, análises e comentários especializados sobre temas em alta.'
    }
  ];

  console.log('🌱 Iniciando seed das categorias...\n');

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const category of categories) {
    const slug = generateSlug(category.name);
    
    try {
      const existingCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { name: category.name },
            { slug: slug }
          ]
        }
      });

      if (!existingCategory) {
        await prisma.category.create({
          data: {
            name: category.name,
            slug: slug,
            description: category.description,
            color: category.color,
            isActive: true
          }
        });
        console.log(`✅ Categoria '${category.name}' criada com slug '${slug}'`);
        created++;
      } else {
        // Atualiza a categoria existente se necessário
        if (existingCategory.name === category.name) {
          await prisma.category.update({
            where: { id: existingCategory.id },
            data: {
              description: category.description,
              color: category.color,
              isActive: true
            }
          });
          console.log(`🔄 Categoria '${category.name}' atualizada`);
          updated++;
        } else {
          console.log(`⚠️  Categoria '${category.name}' já existe com slug diferente (slug: ${existingCategory.slug})`);
          skipped++;
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao processar categoria '${category.name}':`, error.message);
    }
  }

  console.log('\n📊 Resumo:');
  console.log(`   ✅ Criadas: ${created}`);
  console.log(`   🔄 Atualizadas: ${updated}`);
  console.log(`   ⚠️  Ignoradas: ${skipped}`);
  console.log('\n🎉 Seed das categorias concluído!');
}

async function main() {
  try {
    await seedCategories();
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

