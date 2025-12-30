const { chromium } = require('playwright');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Lista de notícias para cadastrar
const entretenimentoNews = [
  {
    title: "Filme brasileiro surpreende e vence prêmio internacional",
    subtitle: "Produção independente ganha destaque em festival europeu",
    content: "O longa-metragem produzido no interior de Minas Gerais conquistou o prêmio de Melhor Roteiro após emocionar público e crítica. A obra aborda relações familiares em comunidades rurais.",
    categories: ["Entretenimento", "Cultura"]
  },
  {
    title: "Nova série de fantasia domina plataformas de streaming",
    subtitle: "Produção estreia quebrando recordes na primeira semana",
    content: "Com cenários grandiosos e efeitos de última geração, a série rapidamente se tornou a mais assistida da plataforma. Fãs elogiam a narrativa complexa e personagens carismáticos.",
    categories: ["Entretenimento", "Tecnologia"]
  },
  {
    title: "Turnê de artista internacional confirma show extra no Brasil",
    subtitle: "Ingressos esgotaram em menos de duas horas",
    content: "A alta demanda fez com que a produção anunciasse uma apresentação adicional em São Paulo. Fãs celebram nas redes sociais.",
    categories: ["Entretenimento"]
  },
  {
    title: "Aplicativos de música registram maior crescimento dos últimos anos",
    subtitle: "Streaming impulsiona artistas independentes",
    content: "O mercado fonográfico comemora a expansão do consumo de música digital, que abriu portas para novos talentos e para a exportação de artistas brasileiros.",
    categories: ["Entretenimento", "Tecnologia", "Economia"]
  },
  {
    title: "Reality show brasileiro estreia nova temporada com regras inéditas",
    subtitle: "Mudanças prometem elevar o nível da disputa",
    content: "A edição contará com provas mais longas, votações relâmpago e desafios estratégicos. A expectativa do público é alta.",
    categories: ["Entretenimento"]
  },
  {
    title: "Festival cultural reúne música, artes e gastronomia",
    subtitle: "Evento atrai visitantes de todo o país",
    content: "Com atividades para todas as idades, o festival celebra a diversidade brasileira com shows, exposições e culinária típica de diversas regiões.",
    categories: ["Entretenimento", "Cultura", "Economia"]
  },
  {
    title: "Jogo eletrônico nacional ganha prêmio de inovação",
    subtitle: "Desenvolvedores celebram reconhecimento global",
    content: "O game utiliza física avançada e narrativa interativa. A equipe afirma que o prêmio abrirá portas para novos investimentos.",
    categories: ["Entretenimento", "Tecnologia"]
  },
  {
    title: "Teatro reabre após restauração histórica completa",
    subtitle: "Prédio centenário volta a receber espetáculos",
    content: "A restauração preservou detalhes arquitetônicos, modernizou o palco e ampliou o acesso para pessoas com deficiência.",
    categories: ["Entretenimento", "Cultura"]
  },
  {
    title: "Documentário sobre fauna brasileira é elogiado pela crítica",
    subtitle: "Produção destaca importância da conservação",
    content: "Com imagens impressionantes e narrativa envolvente, o documentário traz reflexões sobre preservação ambiental e biodiversidade.",
    categories: ["Entretenimento", "Meio Ambiente"]
  },
  {
    title: "Anime brasileiro é anunciado por grande estúdio internacional",
    subtitle: "Produção terá artistas do Japão e do Brasil",
    content: "A série animada trará elementos da cultura brasileira com estilo clássico dos animes japoneses. A previsão de estreia é para o próximo ano.",
    categories: ["Entretenimento", "Cultura", "Tecnologia"]
  }
];

const miscNews = [
  {
    title: "Novo telescópio espacial revela exoplanetas com condições habitáveis",
    subtitle: "Descobertas podem alterar compreensão sobre formação de sistemas planetários",
    content: "Cientistas anunciaram a descoberta de cinco exoplanetas que orbitam estrelas semelhantes ao Sol, com características que sugerem potencial habitabilidade. O estudo utilizará espectroscopia avançada para analisar atmosfera e composição química, abrindo caminho para futuras missões de exploração.",
    categories: ["Ciência", "Mundo"]
  },
  {
    title: "Universidades lançam programa de bolsas para pesquisa em educação digital",
    subtitle: "Iniciativa busca formar professores aptos a integrar tecnologia em sala de aula",
    content: "O programa oferece bolsas integrais para mestrado e doutorado voltados à inovação pedagógica, com foco em métodos digitais e híbridos. Especialistas afirmam que a medida pode transformar a qualidade do ensino em diversas regiões.",
    categories: ["Educação", "Tecnologia"]
  },
  {
    title: "Novo tratamento genético mostra eficácia em pacientes com doença rara",
    subtitle: "Ensaios clínicos indicam recuperação parcial de funções perdidas",
    content: "Pesquisadores desenvolveram terapia genética que corrige mutações responsáveis por uma doença neuromuscular rara. Pacientes tratados apresentaram melhoria significativa na mobilidade e qualidade de vida, com efeitos colaterais mínimos.",
    categories: ["Saúde", "Ciência"]
  },
  {
    title: "Empresa nacional lança linha de carros elétricos compactos",
    subtitle: "Modelo busca popularizar veículos sustentáveis no mercado urbano",
    content: "A fabricante apresentou dois modelos elétricos com autonomia de até 350 km e preço competitivo. O lançamento faz parte do programa de incentivo à mobilidade sustentável e redução de emissão de poluentes.",
    categories: ["Carros / Motor", "Tecnologia", "Meio Ambiente"]
  },
  {
    title: "Brasil assume liderança em exportação de soja para a Ásia",
    subtitle: "Safra recorde impulsiona receita do agronegócio",
    content: "O país se tornou o principal fornecedor de soja para mercados asiáticos, aproveitando alta demanda e preços favoráveis. Produtores investem em logística e tecnologia para atender contratos internacionais.",
    categories: ["Agricultura / Agro", "Economia", "Mundo"]
  },
  {
    title: "Tribunal reforça combate à corrupção com nova plataforma digital",
    subtitle: "Sistema permite acompanhamento de processos em tempo real",
    content: "A justiça implementou uma plataforma online que centraliza informações sobre investigações e processos, com auditoria independente e transparência total. Especialistas destacam que a ferramenta reduzirá prazos e aumentará eficiência.",
    categories: ["Justiça / Polícia", "Tecnologia", "Política"]
  },
  {
    title: "Festival internacional de cinema terá sessões ao ar livre",
    subtitle: "Evento busca democratizar acesso à cultura audiovisual",
    content: "O festival contará com exibições gratuitas em praças públicas e centros culturais, além de workshops com diretores renomados. A iniciativa reforça a importância da arte como instrumento de inclusão e educação.",
    categories: ["Cultura", "Entretenimento"]
  },
  {
    title: "Estudo revela aumento da poluição em rios urbanos",
    subtitle: "Pesquisadores alertam para impactos na saúde e biodiversidade",
    content: "Pesquisas realizadas em cinco grandes rios apontam aumento significativo de resíduos químicos e sólidos. Autoridades ambientais estudam novas políticas de tratamento de água e educação ambiental para comunidades locais.",
    categories: ["Meio Ambiente", "Saúde", "Ciência"]
  },
  {
    title: "Startups brasileiras atraem investimentos internacionais",
    subtitle: "Setor de tecnologia lidera rodada de aportes de capital",
    content: "Empresas emergentes de fintech, saúde digital e inteligência artificial receberam aporte de fundos internacionais, fortalecendo ecossistema de inovação e criando oportunidades de emprego no país.",
    categories: ["Tecnologia", "Negócios", "Economia"]
  },
  {
    title: "Novos métodos de ensino remoto aumentam engajamento de estudantes",
    subtitle: "Plataformas interativas e gamificação mostram resultados positivos",
    content: "Escolas e universidades relatam melhoria no desempenho e motivação de alunos graças a ferramentas digitais e estratégias de gamificação. Pesquisadores afirmam que a tecnologia pode reduzir desigualdades de aprendizado.",
    categories: ["Educação", "Tecnologia", "Saúde"]
  },
  {
    title: "Pesquisa global aponta tendência de migração para cidades sustentáveis",
    subtitle: "Planejamento urbano prioriza energia limpa e mobilidade ativa",
    content: "Estudos indicam que jovens profissionais estão migrando para cidades que investem em transporte público eficiente, energia renovável e áreas verdes, estimulando políticas de urbanismo sustentável.",
    categories: ["Meio Ambiente", "Mundo"]
  },
  {
    title: "Feira de negócios internacionais destaca startups de impacto social",
    subtitle: "Projetos inovadores unem tecnologia e responsabilidade social",
    content: "Empreendedores apresentaram soluções em educação, saúde e inclusão financeira, atraindo investidores interessados em negócios que combinam lucro com impacto positivo.",
    categories: ["Negócios", "Tecnologia", "Educação"]
  },
  {
    title: "Nova lei fortalece proteção de dados pessoais",
    subtitle: "Empresas devem reforçar políticas de segurança e privacidade",
    content: "A legislação obriga companhias a implementar medidas de segurança cibernética mais rígidas, com penalidades para vazamento de dados. Especialistas destacam que a lei aumentará a confiança do consumidor e fomentará investimentos em TI.",
    categories: ["Tecnologia", "Política", "Negócios"]
  },
  {
    title: "Universidade lança programa de incentivo à pesquisa científica",
    subtitle: "Bolsas e laboratórios modernos estimulam inovação",
    content: "O programa oferece financiamento para projetos de ponta em áreas como biotecnologia, inteligência artificial e energias renováveis, promovendo intercâmbio internacional e parcerias industriais.",
    categories: ["Educação", "Ciência", "Tecnologia"]
  },
  {
    title: "Mercado de games cresce 25% e movimenta bilhões",
    subtitle: "Jogos digitais se consolidam como setor estratégico da economia",
    content: "Dados indicam que o consumo de games, incluindo mobile e eSports, impulsiona desenvolvimento tecnológico, publicidade e conteúdo audiovisual. Startups e grandes estúdios investem pesado em novas produções.",
    categories: ["Entretenimento", "Tecnologia", "Economia"]
  },
  {
    title: "Agricultores adotam técnicas sustentáveis para aumentar produtividade",
    subtitle: "Uso de drones e sensores reduz desperdício e otimiza colheita",
    content: "Produtores rurais utilizam agricultura de precisão para monitorar solo, irrigação e plantio, diminuindo impactos ambientais e aumentando eficiência econômica.",
    categories: ["Agricultura / Agro", "Tecnologia", "Meio Ambiente"]
  },
  {
    title: "Nova diretoria implementa políticas de transparência em grandes empresas",
    subtitle: "Relatórios financeiros passam a ser auditados por firmas independentes",
    content: "Companhias nacionais adotaram práticas internacionais de governança corporativa, aumentando confiança de investidores e fortalecendo a imagem institucional.",
    categories: ["Negócios", "Política", "Economia"]
  },
  {
    title: "Estudos indicam aumento da obesidade infantil em áreas urbanas",
    subtitle: "Especialistas pedem políticas públicas para incentivo à atividade física",
    content: "Pesquisas apontam que dietas inadequadas e sedentarismo estão elevando índices de obesidade infantil. Medidas sugeridas incluem programas escolares de educação alimentar e esportes.",
    categories: ["Saúde", "Educação", "Política"]
  },
  {
    title: "Cidades inteligentes adotam sensores para monitorar trânsito e poluição",
    subtitle: "Tecnologia ajuda na gestão urbana e na redução de acidentes",
    content: "Sensores de tráfego e qualidade do ar são integrados em plataformas digitais que permitem ajustes em tempo real, otimizando mobilidade urbana e qualidade de vida.",
    categories: ["Tecnologia", "Meio Ambiente", "Cultura"]
  },
  {
    title: "ONG internacional promove ações de preservação ambiental em florestas tropicais",
    subtitle: "Projetos combinam educação comunitária e tecnologias de monitoramento",
    content: "A ONG utiliza drones, sensores e aplicativos de monitoramento para proteger áreas de biodiversidade. As iniciativas também incluem workshops para comunidades locais sobre manejo sustentável.",
    categories: ["Meio Ambiente", "Educação", "Ciência"]
  }
];

// Lista de notícias para processar (combinando ambas as listas)
const noticiasParaCadastrar = [...entretenimentoNews, ...miscNews];

// Chave da API do Pexels
const PEXELS_API_KEY = '301rXRkLRNndwMrLSS2bVWqWAFvqaS7zVNpTHVUweFsdkl7mRgWURoXG';

// Mapeamento de categorias para termos de busca de imagem (termos visualmente descritivos)
const categoriaParaBusca = {
  'Política': 'politics',
  'Economia': 'economy',
  'Mundo': 'world',
  'Brasil / Nacional': 'brazil',
  'Tecnologia': 'technology',
  'Esportes': 'sports',
  'Entretenimento': 'entertainment',
  'Cultura': 'culture',
  'Saúde': 'health',
  'Ciência': 'science',
  'Educação': 'education',
  'Negócios': 'business',
  'Justiça / Polícia': 'justice',
  'Meio Ambiente': 'environment',
  'Agricultura / Agro': 'agriculture',
  'Carros / Motor': 'cars'
};

// Função para baixar imagem da internet
async function baixarImagemDaInternet(categoria, tituloNoticia = '') {
  const termoBase = categoriaParaBusca[categoria] || categoria.toLowerCase();
  
  // Extrair palavras-chave do título para tornar a busca mais específica e única
  let termoBusca = termoBase;
  
  if (tituloNoticia) {
    // Extrair palavras significativas do título (remover palavras comuns)
    const palavrasComuns = ['de', 'da', 'do', 'para', 'com', 'em', 'a', 'o', 'e', 'ou', 'que', 'um', 'uma', 'os', 'as', 'no', 'na', 'nos', 'nas', 'pelo', 'pela', 'pelos', 'pelas'];
    const palavrasTitulo = tituloNoticia
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remover pontuação
      .split(/\s+/)
      .filter(palavra => palavra.length > 3 && !palavrasComuns.includes(palavra))
      .slice(0, 2); // Pegar até 2 palavras significativas
    
    if (palavrasTitulo.length > 0) {
      // Combinar termo da categoria com palavras do título
      termoBusca = `${termoBase} ${palavrasTitulo.join(' ')}`;
    }
  }
  
  console.log(`🔍 Buscando imagem relacionada a "${categoria}" (termo base: "${termoBase}")...`);
  
  // Criar diretório temporário se não existir
  const tempDir = path.join(__dirname, 'temp_images');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Timestamp para garantir unicidade do arquivo
  const timestamp = Date.now();
  const fileName = `imagem_${categoria.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${timestamp}.jpg`;
  const filePath = path.join(tempDir, fileName);
  
  // Criar um hash único baseado no título e timestamp para garantir imagens diferentes
  const hashUnico = Math.abs(tituloNoticia.split('').reduce((acc, char) => acc + char.charCodeAt(0), timestamp)) % 1000;
  
  // Usar apenas o termo base da categoria para busca no Pexels (mais específico)
  // termoBusca já foi definido acima, mas vamos usar apenas o termo base para Pexels
  const termoPexels = termoBase; // Termo simples da categoria para busca no Pexels
  
  console.log(`📥 Buscando imagem relacionada a "${categoria}" usando termo: "${termoPexels}"...`);
  
  // Tentar primeiro com Pexels API (busca real por termo)
  try {
    console.log('🔄 Tentando Pexels API...');
    const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(termoPexels)}&per_page=20&page=${(hashUnico % 5) + 1}`;
    
    // Fazer requisição à API do Pexels
    const pexelsImageUrl = await buscarImagemPexels(pexelsUrl);
    
    if (pexelsImageUrl) {
      console.log(`📥 Baixando imagem do Pexels: ${pexelsImageUrl.substring(0, 80)}...`);
      await baixarImagemDeUrl(pexelsImageUrl, filePath, 15000);
      
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size > 0) {
          console.log(`✅ Imagem baixada do Pexels com sucesso! Tamanho: ${(stats.size / 1024).toFixed(2)} KB`);
          return filePath;
        }
      }
    }
  } catch (error) {
    console.log(`⚠️ Pexels API falhou: ${error.message}`);
  }
  
  // Fallback: tentar outras fontes
  const fontesImagens = [
    {
      nome: 'Unsplash Source',
      url: `https://source.unsplash.com/1920x1080/?${termoPexels}`,
      descricao: 'Unsplash Source API'
    },
    {
      nome: 'Picsum Photos (com seed)',
      url: `https://picsum.photos/seed/${hashUnico}/1920/1080`,
      descricao: 'Imagens aleatórias com seed único'
    }
  ];
  
  for (let i = 0; i < fontesImagens.length; i++) {
    const fonte = fontesImagens[i];
    console.log(`🔄 Tentativa fallback ${i + 1}/${fontesImagens.length}: ${fonte.nome}...`);
    
    try {
      const imagemBaixada = await baixarImagemDeUrl(fonte.url, filePath, 10000);
      if (imagemBaixada && fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size > 0) {
          console.log(`✅ Imagem baixada com sucesso usando ${fonte.nome}!`);
          console.log(`📊 Tamanho: ${(stats.size / 1024).toFixed(2)} KB`);
          return filePath;
        }
      }
    } catch (error) {
      console.log(`⚠️ ${fonte.nome} falhou: ${error.message}`);
      continue;
    }
  }
  
  // Se todas as fontes falharam, lançar erro
  throw new Error('Todas as fontes de imagem falharam');
}

// Função para buscar imagem no Pexels
async function buscarImagemPexels(apiUrl) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    };
    
    https.get(apiUrl, options, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            if (json.photos && json.photos.length > 0) {
              // Selecionar uma foto aleatória do resultado
              const randomIndex = Math.floor(Math.random() * json.photos.length);
              const photo = json.photos[randomIndex];
              // Usar a imagem em tamanho grande
              const imageUrl = photo.src?.large || photo.src?.original || photo.src?.medium;
              resolve(imageUrl);
            } else {
              reject(new Error('Nenhuma foto encontrada no Pexels'));
            }
          } catch (error) {
            reject(new Error(`Erro ao processar resposta do Pexels: ${error.message}`));
          }
        } else {
          reject(new Error(`Erro na API Pexels: ${response.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Função auxiliar para baixar imagem de uma URL
function baixarImagemDeUrl(imageUrl, filePath, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    const request = https.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          // Verificar se o arquivo foi realmente criado
          setTimeout(() => {
            if (fs.existsSync(filePath)) {
              const stats = fs.statSync(filePath);
              if (stats.size > 0) {
                resolve(true);
              } else {
                fs.unlink(filePath, () => {});
                reject(new Error('Arquivo baixado está vazio'));
              }
            } else {
              reject(new Error('Arquivo não foi criado'));
            }
          }, 100); // Pequeno delay para garantir que o sistema de arquivos atualizou
        });
      } else if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
        // Seguir redirect
        const redirectUrl = response.headers.location;
        https.get(redirectUrl, (redirectResponse) => {
          if (redirectResponse.statusCode === 200) {
            redirectResponse.pipe(file);
            file.on('finish', () => {
              file.close();
              // Verificar se o arquivo foi realmente criado
              setTimeout(() => {
                if (fs.existsSync(filePath)) {
                  const stats = fs.statSync(filePath);
                  if (stats.size > 0) {
                    resolve(true);
                  } else {
                    fs.unlink(filePath, () => {});
                    reject(new Error('Arquivo baixado está vazio'));
                  }
                } else {
                  reject(new Error('Arquivo não foi criado'));
                }
              }, 100);
            });
          } else {
            file.close();
            fs.unlink(filePath, () => {});
            reject(new Error(`Erro após redirect: ${redirectResponse.statusCode}`));
          }
        }).on('error', (err) => {
          file.close();
          fs.unlink(filePath, () => {});
          reject(err);
        });
      } else {
        file.close();
        fs.unlink(filePath, () => {});
        reject(new Error(`Erro HTTP: ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      file.close();
      fs.unlink(filePath, () => {});
      reject(err);
    });
    
    request.setTimeout(timeout, () => {
      request.destroy();
      file.close();
      fs.unlink(filePath, () => {});
      reject(new Error('Timeout'));
    });
  });
}

async function fazerLogin(page) {
  // Verificar se já existe token no localStorage
  console.log('🔍 Verificando se já está logado...');
  await page.goto('http://localhost:4200/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  
  // Verificar se há token no localStorage
  const token = await page.evaluate(() => {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  });
  
  if (token) {
    console.log('✅ Token encontrado no localStorage/sessionStorage. Já está logado!');
    // Tentar navegar para uma página protegida para verificar se o token ainda é válido
    try {
      await page.goto('http://localhost:4200/news', { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      
      // Se não foi redirecionado para login, o token é válido
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Sessão válida! Continuando sem fazer login.');
        return;
      }
    } catch (error) {
      console.log('⚠️ Token pode estar inválido. Fazendo login novamente...');
    }
  }
  
  // Se chegou aqui, precisa fazer login
  console.log('🔐 Fazendo login...');
  
  // Preencher email
  console.log('✍️ Preenchendo email...');
  await page.locator('#email').waitFor({ state: 'visible', timeout: 10000 });
  await page.fill('#email', 'master@email.com');
  await page.waitForTimeout(300); // Delay entre campos
  
  // Preencher senha
  console.log('✍️ Preenchendo senha...');
  await page.fill('#password', '123456');
  await page.waitForTimeout(300); // Delay entre campos
  
  // Marcar checkbox "Lembrar-me"
  console.log('☑️ Marcando checkbox "Lembrar-me"...');
  const rememberCheckbox = page.locator('#remember');
  const isChecked = await rememberCheckbox.isChecked();
  if (!isChecked) {
    await rememberCheckbox.check();
    console.log('✅ Checkbox "Lembrar-me" marcado!');
  } else {
    console.log('✅ Checkbox "Lembrar-me" já estava marcado!');
  }
  await page.waitForTimeout(300); // Delay antes de clicar no botão
  
  // Clicar no botão de login
  console.log('🔑 Clicando no botão "Entrar"...');
  await page.locator('button.login-button').click();
  
  // Aguardar redirecionamento após login
  console.log('⏳ Aguardando redirecionamento após login...');
  await page.waitForURL('http://localhost:4200/**', { timeout: 10000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  
  // Verificar se o token foi salvo no localStorage
  const tokenSalvo = await page.evaluate(() => {
    return localStorage.getItem('access_token');
  });
  
  if (tokenSalvo) {
    console.log('✅ Token salvo no localStorage com sucesso!');
  } else {
    console.log('⚠️ Token não foi salvo no localStorage (pode estar em sessionStorage).');
  }
}

async function cadastrarNoticia(page, dadosNoticia, imagePath) {
  console.log(`\n📝 Cadastrando notícia: ${dadosNoticia.title}`);
  
  // Navegar para a página de notícias
  console.log('🌐 Navegando para http://localhost:4200/news...');
  await page.goto('http://localhost:4200/news', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Aguardar o formulário carregar
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  
  // Aguardar a aba "Informações" estar ativa (é a aba padrão)
  console.log('⏳ Aguardando formulário carregar...');
  await page.locator('#title').waitFor({ state: 'visible', timeout: 10000 });
  
  // Selecionar categorias (pode ser múltiplas)
  const categorias = dadosNoticia.categories || [dadosNoticia.categoria || 'Política'];
  console.log(`🏷️ Selecionando ${categorias.length} categoria(s): ${categorias.join(', ')}...`);
  
  for (const categoriaNome of categorias) {
    console.log(`\n📌 Processando categoria: "${categoriaNome}"`);
    
    const addCategoryBtn = page.locator('button.add-category-btn:has-text("Adicionar Categoria")');
    await addCategoryBtn.waitFor({ state: 'visible', timeout: 10000 });
    
    // Verificar se a categoria já foi selecionada (aparece como tag)
    const categoriaJaSelecionada = await page.locator('.category-tag').filter({ hasText: categoriaNome }).count() > 0;
    if (categoriaJaSelecionada) {
      console.log(`✅ Categoria "${categoriaNome}" já está selecionada!`);
      continue;
    }
    
    await addCategoryBtn.click();
    await page.waitForTimeout(500);
    
    // Aguardar o dropdown abrir
    await page.locator('.category-dropdown').waitFor({ state: 'visible', timeout: 5000 });
    
    // Procurar pela categoria no dropdown
    const todasOpcoes = page.locator('.category-option');
    const countOpcoes = await todasOpcoes.count();
    
    console.log(`📋 Encontradas ${countOpcoes} categorias no dropdown. Procurando "${categoriaNome}"...`);
    
    let categoriaOption = null;
    let categoriaEncontrada = false;
    
    for (let i = 0; i < countOpcoes; i++) {
      const opcao = todasOpcoes.nth(i);
      const nomeCategoria = await opcao.locator('.category-name').textContent();
      
      if (nomeCategoria && nomeCategoria.trim() === categoriaNome) {
        categoriaOption = opcao;
        categoriaEncontrada = true;
        console.log(`✅ Categoria "${categoriaNome}" encontrada na posição ${i + 1}`);
        break;
      }
    }
    
    if (categoriaEncontrada && categoriaOption) {
      console.log(`✅ Selecionando categoria "${categoriaNome}"...`);
      await categoriaOption.click();
      await page.waitForTimeout(500);
      
      // Verificar se a categoria foi selecionada (deve aparecer como tag)
      const categoriaSelecionada = await page.locator('.category-tag').filter({ hasText: categoriaNome }).count() > 0;
      if (categoriaSelecionada) {
        console.log(`✅ Categoria "${categoriaNome}" selecionada com sucesso!`);
      } else {
        console.log(`⚠️ Categoria pode não ter sido selecionada. Verificando...`);
        await page.waitForTimeout(1000);
        const categoriaAindaSelecionada = await page.locator('.category-tag').filter({ hasText: categoriaNome }).count() > 0;
        if (categoriaAindaSelecionada) {
          console.log(`✅ Categoria confirmada como selecionada!`);
        } else {
          console.log(`⚠️ Categoria não foi selecionada. Tentando novamente...`);
          // Tentar clicar novamente
          await addCategoryBtn.click();
          await page.waitForTimeout(500);
          await categoriaOption.click();
          await page.waitForTimeout(500);
        }
      }
    } else {
      console.log(`⚠️ Categoria "${categoriaNome}" não encontrada no dropdown.`);
      console.log('💡 Listando categorias disponíveis...');
      
      // Listar todas as categorias disponíveis para debug
      for (let i = 0; i < countOpcoes; i++) {
        const opcao = todasOpcoes.nth(i);
        const nome = await opcao.locator('.category-name').textContent();
        console.log(`   - ${nome}`);
      }
      
      // Fechar o dropdown
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
  }
  
  console.log(`✅ Processo de seleção de categorias concluído!`);
  
  // Preencher título
  console.log(`✍️ Preenchendo título: ${dadosNoticia.title}`);
  await page.fill('#title', dadosNoticia.title);
  await page.waitForTimeout(400); // Delay entre campos
  
  // Aguardar um pouco para o slug ser gerado automaticamente
  await page.waitForTimeout(500);
  
  // Preencher subtítulo
  console.log(`✍️ Preenchendo subtítulo: ${dadosNoticia.subtitle}`);
  await page.fill('#subtitle', dadosNoticia.subtitle);
  await page.waitForTimeout(400); // Delay entre campos
  
  // Verificar se o slug foi gerado automaticamente
  const slugValue = await page.locator('#slug').inputValue();
  console.log(`🔗 Slug gerado: ${slugValue}`);
  
  // Navegar para a aba "Conteúdo"
  console.log('📄 Navegando para a aba "Conteúdo"...');
  await page.waitForTimeout(300); // Delay antes de mudar de aba
  const contentTab = page.locator('button.tab-button:has-text("Conteúdo")');
  await contentTab.click();
  await page.waitForTimeout(1000);
  
  // Aguardar o editor de texto carregar (CKEditor 5)
  console.log('⏳ Aguardando editor de texto (CKEditor) carregar...');
  
  // Aguardar o elemento do editor aparecer
  try {
    await page.locator('.ck-editor, .ck-editor__editable, [contenteditable="true"]').first().waitFor({ 
      state: 'visible', 
      timeout: 10000 
    });
    console.log('✅ Editor detectado!');
  } catch (error) {
    console.log('⚠️ Editor não detectado automaticamente, aguardando mais tempo...');
  }
  
  await page.waitForTimeout(2000); // Aguardar mais um pouco para o CKEditor inicializar completamente
  
  // CKEditor 5 geralmente usa um div com contenteditable dentro de .ck-editor__editable
  console.log('📝 Procurando editor CKEditor...');
  
  // Tentar encontrar o editor CKEditor (várias estratégias)
  let editorPreenchido = false;
  
  // Estratégia 1: Procurar pelo div editável do CKEditor (dentro do container do CKEditor)
  const ckEditorContainer = page.locator('.ck-editor').first();
  const ckEditorContainerExists = await ckEditorContainer.count() > 0;
  
  let ckEditorEditable;
  if (ckEditorContainerExists) {
    ckEditorEditable = ckEditorContainer.locator('.ck-editor__editable, [contenteditable="true"]').first();
  } else {
    ckEditorEditable = page.locator('.ck-editor__editable, [contenteditable="true"]').first();
  }
  
  const ckEditorExists = await ckEditorEditable.count() > 0;
  
  if (ckEditorExists) {
    try {
      console.log('📝 Editor CKEditor encontrado (contenteditable). Preenchendo conteúdo...');
      await ckEditorEditable.waitFor({ state: 'visible', timeout: 5000 });
      await ckEditorEditable.click();
      await page.waitForTimeout(500);
      
      // Limpar conteúdo existente se houver
      await page.keyboard.press('Control+A');
      await page.waitForTimeout(200);
      
      // Preencher o conteúdo
      await ckEditorEditable.fill(dadosNoticia.content);
      await page.waitForTimeout(400); // Delay após preencher conteúdo
      editorPreenchido = true;
      console.log('✅ Conteúdo preenchido no CKEditor!');
    } catch (error) {
      console.log('⚠️ Erro ao preencher CKEditor (método 1):', error.message);
    }
  }
  
  // Estratégia 2: Se não funcionou, tentar usar type
  if (!editorPreenchido) {
    try {
      console.log('📝 Tentando método alternativo (keyboard.type)...');
      const editor = page.locator('.ck-editor__editable, [contenteditable="true"]').first();
      await editor.click();
      await page.waitForTimeout(500);
      await page.keyboard.press('Control+A');
      await page.waitForTimeout(200);
      await page.keyboard.type(dadosNoticia.content, { delay: 30 });
      await page.waitForTimeout(400); // Delay após preencher conteúdo
      editorPreenchido = true;
      console.log('✅ Conteúdo preenchido usando keyboard.type!');
    } catch (error) {
      console.log('⚠️ Erro ao preencher (método 2):', error.message);
    }
  }
  
  // Estratégia 3: Tentar encontrar textarea (fallback)
  if (!editorPreenchido) {
    try {
      console.log('📝 Tentando encontrar textarea...');
      const textarea = page.locator('textarea[formControlName="content"], textarea.ck-editor__editable');
      const textareaExists = await textarea.count() > 0;
      
      if (textareaExists) {
        await textarea.fill(dadosNoticia.content);
        await page.waitForTimeout(400); // Delay após preencher conteúdo
        editorPreenchido = true;
        console.log('✅ Conteúdo preenchido em textarea!');
      }
    } catch (error) {
      console.log('⚠️ Erro ao preencher textarea:', error.message);
    }
  }
  
  if (!editorPreenchido) {
    console.log('⚠️ Não foi possível preencher o editor automaticamente.');
    console.log('💡 Você precisará preencher o conteúdo manualmente no editor.');
  }
  
  // Aguardar um pouco para o conteúdo ser processado
  await page.waitForTimeout(1000);
  
  console.log('✅ Campos preenchidos com sucesso!');
  console.log('\n📋 Resumo dos dados preenchidos:');
  console.log(`   Título: ${dadosNoticia.title}`);
  console.log(`   Subtítulo: ${dadosNoticia.subtitle}`);
  console.log(`   Slug: ${slugValue || 'A ser gerado'}`);
  console.log(`   Conteúdo: ${dadosNoticia.content.substring(0, 100)}...`);
  
  // Navegar para a aba "Mídias"
  console.log('\n📸 Navegando para a aba "Mídias"...');
  await page.waitForTimeout(300); // Delay antes de mudar de aba
  const mediaTab = page.locator('button.tab-button:has-text("Mídias")');
  await mediaTab.click();
  await page.waitForTimeout(1000);
  
  // Verificar se o arquivo existe e tem conteúdo
  if (!fs.existsSync(imagePath)) {
    console.log(`⚠️ Arquivo não encontrado no caminho esperado: ${imagePath}`);
    console.log('🔍 Tentando encontrar arquivo alternativo...');
    
    // Tentar encontrar o arquivo mais recente no diretório temp_images
    const tempDir = path.join(__dirname, 'temp_images');
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir)
        .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
        .map(f => ({
          name: f,
          path: path.join(tempDir, f),
          time: fs.statSync(path.join(tempDir, f)).mtime
        }))
        .sort((a, b) => b.time - a.time);
      
      if (files.length > 0) {
        const latestFile = files[0];
        console.log(`📎 Arquivo mais recente encontrado: ${latestFile.name}`);
        imagePath = latestFile.path;
      }
    }
    
    // Se ainda não encontrou, verificar se é o placeholder
    if (!fs.existsSync(imagePath)) {
      const placeholderPath = 'C:\\Users\\zThanos\\Pictures\\placeholder\\Placeholder-gazeta.png';
      if (fs.existsSync(placeholderPath)) {
        console.log('💡 Usando imagem placeholder padrão...');
        imagePath = placeholderPath;
      } else {
        throw new Error(`Arquivo não encontrado: ${imagePath}`);
      }
    }
  }
  
  const stats = fs.statSync(imagePath);
  if (stats.size === 0) {
    throw new Error(`Arquivo de imagem está vazio: ${imagePath}`);
  }
  
  console.log(`📎 Usando imagem: ${imagePath} (${(stats.size / 1024).toFixed(2)} KB)`);
  
  // Método 1: Tentar definir o arquivo diretamente no input (sem abrir janela)
  console.log('📁 Tentando método direto (sem abrir janela)...');
  await page.waitForTimeout(300); // Delay antes de adicionar mídia
  const fileInput = page.locator('input[type="file"][accept="image/*"]');
  await fileInput.waitFor({ state: 'attached', timeout: 10000 });
  
  try {
    // Usar setInputFiles diretamente - isso NÃO abre a janela de seleção
    await fileInput.setInputFiles(imagePath);
    console.log('✅ Arquivo definido diretamente no input!');
    await page.waitForTimeout(300); // Delay após definir arquivo
    
    // Disparar o evento change manualmente para garantir que o Angular detecte
    await fileInput.evaluate((input) => {
      const event = new Event('change', { bubbles: true, cancelable: true });
      input.dispatchEvent(event);
    });
    
    console.log('✅ Evento change disparado!');
    await page.waitForTimeout(500);
  } catch (error) {
    // Se o método direto não funcionar, usar o filechooser listener
    console.log('⚠️ Método direto não funcionou. Usando filechooser listener...');
    
    // Configurar o listener para capturar e fechar o diálogo automaticamente
    const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 5000 });
    
    // Clicar no botão "Adicionar Foto"
    console.log('📷 Clicando no botão "Adicionar Foto"...');
    const addPhotoBtn = page.locator('button.btn-add-photo:has-text("Adicionar Foto")');
    await addPhotoBtn.click();
    
    // Aguardar o diálogo aparecer e selecionar o arquivo
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(imagePath);
    console.log('✅ Arquivo selecionado via filechooser!');
    await page.waitForTimeout(500);
  }
  
  // Aguardar o preview da imagem aparecer
  console.log('⏳ Aguardando preview da imagem...');
  await page.waitForTimeout(2000);
  
  // Verificar se a imagem foi adicionada
  const imagePreview = await page.locator('.image-preview.has-image, .media-item.photo').count() > 0;
  if (imagePreview) {
    console.log('✅ Imagem adicionada com sucesso!');
  } else {
    console.log('⚠️ Preview da imagem não detectado, mas continuando...');
  }
  
  // Aguardar um pouco mais para garantir que tudo foi processado
  await page.waitForTimeout(1000);
  
  // Clicar no botão "Criar notícia" ou "Salvar"
  console.log('\n💾 Procurando botão para criar a notícia...');
  
  // Procurar pelo botão de submit (pode ter diferentes textos)
  const submitButton = page.locator('button[type="submit"]:has-text("Criar"), button[type="submit"]:has-text("Salvar"), button[type="submit"]:has-text("Publicar")');
  const submitButtonExists = await submitButton.count() > 0;
  
  if (submitButtonExists) {
    console.log('✅ Botão de criar notícia encontrado!');
    
    // Verificar se o botão está habilitado
    const isEnabled = await submitButton.isEnabled();
    if (!isEnabled) {
      console.log('⚠️ Botão está desabilitado. Aguardando...');
      // Aguardar até que o botão esteja habilitado (máximo 10 segundos)
      for (let i = 0; i < 10; i++) {
        await page.waitForTimeout(1000);
        const enabled = await submitButton.isEnabled();
        if (enabled) {
          console.log('✅ Botão habilitado!');
          break;
        }
      }
    }
    
    // Scroll para o botão
    await submitButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Delay antes de clicar no botão de criar
    await page.waitForTimeout(300);
    
    // Clicar no botão
    console.log('🚀 Clicando em "Criar notícia"...');
    await submitButton.click();
    
    // Aguardar a notícia ser criada
    console.log('⏳ Aguardando notícia ser criada...');
    await page.waitForTimeout(3000);
    
    // Verificar se houve sucesso (procurar por mensagem de sucesso ou redirecionamento)
    const successMessage = await page.locator('text=/sucesso|notícia criada|notícia salva/i').count() > 0;
    if (successMessage) {
      console.log('🎉 Notícia criada com sucesso!');
    } else {
      console.log('✅ Processo de criação iniciado. Verificando resultado...');
    }
  } else {
    console.log('⚠️ Botão de criar notícia não encontrado.');
    console.log('💡 Você precisará clicar manualmente no botão para criar a notícia.');
  }
  
  // Aguardar um pouco para garantir que a notícia foi processada
  await page.waitForTimeout(2000);
}

async function cadastrarNoticiaAutomatica() {
  const browser = await chromium.launch({ 
    headless: false, // Mostra o navegador
    slowMo: 300 // Adiciona delay entre ações para visualizar melhor
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Fazer login uma vez no início
    console.log('\n🔐 Fazendo login inicial...');
    await fazerLogin(page);
    
    // Processar todas as notícias
    console.log(`\n📰 Processando ${noticiasParaCadastrar.length} notícia(s)...\n`);
    
    for (let i = 0; i < noticiasParaCadastrar.length; i++) {
      const noticia = noticiasParaCadastrar[i];
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📰 NOTÍCIA ${i + 1}/${noticiasParaCadastrar.length}`);
      console.log(`${'='.repeat(60)}`);
      
      let imagePath = null;
      let tempImageCreated = false;

      try {
        // Usar a primeira categoria para buscar a imagem
        const categorias = noticia.categories || [noticia.categoria || 'Política'];
        const categoriaPrincipal = categorias[0];
        const tituloNoticia = noticia.title || '';
        
        console.log(`\n🖼️  Baixando imagem relacionada à categoria "${categoriaPrincipal}"...`);
        
        try {
          imagePath = await baixarImagemDaInternet(categoriaPrincipal, tituloNoticia);
          
          // Verificar se o arquivo foi realmente criado e tem conteúdo
          if (!fs.existsSync(imagePath)) {
            throw new Error('Arquivo de imagem não foi criado');
          }
          
          const stats = fs.statSync(imagePath);
          if (stats.size === 0) {
            fs.unlinkSync(imagePath);
            throw new Error('Arquivo de imagem está vazio');
          }
          
          console.log(`✅ Imagem baixada com sucesso! Tamanho: ${(stats.size / 1024).toFixed(2)} KB`);
          console.log(`📁 Caminho completo: ${imagePath}`);
          
          // Verificar novamente antes de usar (garantir que ainda existe)
          await new Promise(resolve => setTimeout(resolve, 200));
          if (!fs.existsSync(imagePath)) {
            throw new Error(`Arquivo foi deletado antes de ser usado: ${imagePath}`);
          }
          
          // Marcar como criado apenas após confirmar que existe
          tempImageCreated = true;
          
          // Criar uma cópia de backup do arquivo para garantir que não seja perdido
          const backupPath = imagePath.replace('.jpg', '_backup.jpg');
          try {
            fs.copyFileSync(imagePath, backupPath);
            console.log(`💾 Backup criado: ${backupPath}`);
          } catch (error) {
            console.log(`⚠️ Não foi possível criar backup: ${error.message}`);
          }
        } catch (error) {
          console.log(`⚠️ Erro ao baixar imagem da internet: ${error.message}`);
          console.log('💡 Usando imagem placeholder padrão...');
          // Fallback para imagem placeholder
          imagePath = 'C:\\Users\\zThanos\\Pictures\\placeholder\\Placeholder-gazeta.png';
          if (!fs.existsSync(imagePath)) {
            throw new Error('Imagem placeholder padrão não encontrada!');
          }
        }
        
        // Verificar novamente o arquivo antes de passar para cadastrarNoticia
        // Aguardar um pouco para garantir que o sistema de arquivos atualizou
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verificar se o arquivo original existe, se não, tentar o backup
        let arquivoFinal = imagePath;
        if (!fs.existsSync(imagePath)) {
          console.log(`⚠️ Arquivo original não encontrado: ${imagePath}`);
          
          // Tentar usar o backup
          const backupPath = imagePath.replace('.jpg', '_backup.jpg');
          if (fs.existsSync(backupPath)) {
            console.log(`💾 Usando arquivo de backup: ${backupPath}`);
            arquivoFinal = backupPath;
          } else {
            console.log('💡 Verificando se arquivo existe em outro local...');
            
            // Tentar encontrar o arquivo no diretório temp_images
            const tempDir = path.join(__dirname, 'temp_images');
            if (fs.existsSync(tempDir)) {
              const files = fs.readdirSync(tempDir)
                .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
                .map(f => ({
                  name: f,
                  path: path.join(tempDir, f),
                  time: fs.statSync(path.join(tempDir, f)).mtime
                }))
                .sort((a, b) => b.time - a.time);
              
              console.log(`📁 Arquivos encontrados em temp_images: ${files.length}`);
              if (files.length > 0) {
                // Usar o arquivo mais recente
                const latestFile = files[0];
                console.log(`📎 Usando arquivo mais recente: ${latestFile.name}`);
                arquivoFinal = latestFile.path;
              }
            }
            
            // Se ainda não encontrou, usar placeholder
            if (!fs.existsSync(arquivoFinal)) {
              console.log('💡 Usando imagem placeholder padrão...');
              arquivoFinal = 'C:\\Users\\zThanos\\Pictures\\placeholder\\Placeholder-gazeta.png';
            }
          }
        }
        
        // Verificação final antes de usar
        if (!fs.existsSync(arquivoFinal)) {
          throw new Error(`Arquivo de imagem não encontrado: ${arquivoFinal}`);
        }
        
        console.log(`✅ Arquivo confirmado antes de cadastrar: ${arquivoFinal}`);
        
        // Atualizar imagePath para usar o arquivo encontrado
        imagePath = arquivoFinal;
        
        // Cadastrar notícia com a imagem baixada
        await cadastrarNoticia(page, noticia, imagePath);
        
        console.log(`\n✅ Notícia ${i + 1}/${noticiasParaCadastrar.length} cadastrada com sucesso!`);
        
        // Aguardar um pouco antes de processar a próxima notícia
        if (i < noticiasParaCadastrar.length - 1) {
          console.log('\n⏳ Aguardando 3 segundos antes da próxima notícia...');
          await page.waitForTimeout(3000);
        }
        
      } catch (error) {
        console.error(`❌ Erro ao cadastrar notícia ${i + 1}:`, error.message);
        console.error('Stack:', error.stack);
        console.log('\n⚠️ Continuando com a próxima notícia...');
        // Continuar com a próxima notícia mesmo se esta falhar
      }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Processo concluído! ${noticiasParaCadastrar.length} notícia(s) processada(s).`);
    console.log(`${'='.repeat(60)}\n`);
    
  } catch (error) {
    console.error('❌ Erro geral ao processar notícias:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Manter o navegador aberto por mais tempo para visualização final
    console.log('\n⏸️  Mantendo navegador aberto por 5 segundos para visualização...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

// Executar
cadastrarNoticiaAutomatica().catch(console.error);

