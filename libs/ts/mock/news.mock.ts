import { News } from "../models/news.model";

export const mockNewsItems: News[] = [
  // TECNOLOGIA (id: 1)
  {
    id: 1,
    title: 'Startup paraense desenvolve app de inteligência artificial para agricultura',
    subtitle: 'Tecnologia promete aumentar produtividade agrícola na Amazônia',
    content:
      '<p>Uma startup de Belém lançou um aplicativo revolucionário que utiliza inteligência artificial para monitorar plantações e prever problemas antes que afetem a colheita. A ferramenta já está sendo testada em fazendas do interior do Pará com resultados promissores.</p>' +
      '<p>O aplicativo, chamado <strong>"AgroIA Amazônia"</strong>, foi desenvolvido pela startup TechFarm, incubada no Parque de Ciência e Tecnologia do Guamá. A solução utiliza algoritmos de machine learning combinados com imagens de satélite e drones para identificar pragas, doenças e deficiências nutricionais nas plantações em tempo real.</p>' +
      '<h3>Tecnologia de ponta a serviço do campo</h3>' +
      '<p>Segundo o CEO da empresa, Rafael Tavares, de 28 anos, a tecnologia consegue antecipar problemas com até 15 dias de antecedência. <em>"Nosso sistema analisa milhares de variáveis climáticas, do solo e das plantas. Quando detecta alguma anomalia, envia alertas imediatos ao produtor com recomendações específicas de tratamento"</em>, explica.</p>' +
      '<p>O funcionamento é simples: agricultores instalam o aplicativo em seus smartphones e cadastram suas propriedades. O sistema então passa a monitorar automaticamente as áreas através de:</p>' +
      '<ul><li>Imagens de satélite atualizadas diariamente</li><li>Análise de dados meteorológicos em tempo real</li><li>Integração com drones para inspeção detalhada</li><li>Sensores IoT instalados no campo</li><li>Histórico de cultivo e padrões de crescimento</li></ul>' +
      '<h3>Resultados impressionantes no campo</h3>' +
      '<p>Atualmente, o app está em fase de testes em 12 propriedades rurais nos municípios de Paragominas, Ulianópolis e Tomé-Açu. Os resultados preliminares mostram um aumento médio de <strong>23% na produtividade</strong> e redução de <strong>40% no uso de defensivos agrícolas</strong>.</p>' +
      '<p>O produtor rural José Carlos Miranda, que cultiva soja em Paragominas, é um dos beta testers. <em>"Antes eu perdia muitas plantas porque só percebia o problema quando já estava grave. Agora recebo alertas no celular e consigo agir rapidamente. Minha produção aumentou e gastei menos com insumos"</em>, relata entusiasmado.</p>' +
      '<blockquote>"Esta tecnologia está nivelando o campo de jogo. Pequenos produtores agora têm acesso a ferramentas que antes só grandes fazendas podiam pagar", destaca Maria Helena Costa, engenheira agrônoma da Embrapa.</blockquote>' +
      '<h3>Investimento e expansão</h3>' +
      '<p>A startup recebeu investimento de R$ 2,5 milhões de fundos de venture capital, incluindo participação da Amazônia Ventures e do Fundo Norte de Inovação. Com os recursos, a empresa pretende expandir para outros estados da Amazônia Legal ainda em 2025.</p>' +
      '<p>A equipe de 15 desenvolvedores também está trabalhando em funcionalidades específicas para culturas típicas da região amazônica, como açaí, cacau, cupuaçu e guaraná. A previsão é que o app esteja disponível comercialmente no primeiro trimestre de 2026, com planos a partir de R$ 149 mensais.</p>' +
      '<p><strong>Impacto social:</strong> Segundo projeções da empresa, a tecnologia pode beneficiar mais de 50 mil pequenos e médios agricultores na região amazônica, contribuindo para o aumento da produtividade sustentável e a redução do desmatamento.</p>',
    categoryId: [1],
    author: 'Redação Gazeta do Pará',
    mediaNews: [
      {
        id: 1,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200',
          small: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
          medium: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
          superSmall: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200',
        },
        author: 'Redação Gazeta do Pará',
        date: '2025-10-08T10:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-08T10:00:00Z',
    createdAt: '2025-10-08T10:00:00Z',
    updateAt: '2025-10-08T10:00:00Z',
    views: 8543,
    status: 'published',
    slug: 'startup-paraense-desenvolve-app-ia-agricultura',
    isEmphasis: true,
  },
  {
    id: 2,
    title: '5G chega a 15 novos municípios do Pará',
    subtitle: 'Expansão da rede de alta velocidade avança pelo interior',
    content:
      '<p>As principais operadoras de telefonia móvel do Brasil iniciaram nesta semana a ativação das antenas 5G em 15 municípios paraenses, marcando uma nova era de conectividade no estado. A tecnologia de quinta geração promete revolucionar a forma como pessoas e empresas se conectam à internet.</p>' +
      '<h3>Cidades contempladas</h3>' +
      '<p>Os novos municípios a receberem o sinal 5G são:</p>' +
      '<ul><li>Santarém</li><li>Marabá</li><li>Castanhal</li><li>Ananindeua</li><li>Parauapebas</li><li>Cametá</li><li>Bragança</li><li>Abaetetuba</li><li>Itaituba</li><li>Barcarena</li><li>Capanema</li><li>Paragominas</li><li>Tucuruí</li><li>Tailândia</li><li>Redenção</li></ul>' +
      '<h3>Velocidade sem precedentes</h3>' +
      '<p>A tecnologia 5G oferece <strong>velocidade de download de até 1 Gbps</strong>, latência ultrabaixa de apenas 1 milissegundo e capacidade para conectar simultaneamente milhares de dispositivos na mesma área. Segundo testes realizados em Belém, onde a rede já está ativa desde março deste ano, a velocidade média é 8 vezes superior ao 4G.</p>' +
      '<blockquote>"Esta é uma conquista histórica para o Pará. O 5G vai revolucionar diversos setores da economia, desde o agronegócio até a telemedicina. Municípios do interior poderão oferecer serviços digitais de alta qualidade aos seus cidadãos", declarou Paulo Henrique Santos, secretário estadual de Ciência e Tecnologia.</blockquote>' +
      '<h3>Impacto econômico</h3>' +
      '<p>Para as empresas, a nova tecnologia representa oportunidades significativas de crescimento e inovação. A Confederação Nacional da Indústria (CNI) estima que o 5G pode adicionar <strong>R$ 6,5 bilhões ao PIB paraense até 2030</strong>, com a criação de cerca de 35 mil empregos diretos e indiretos.</p>' +
      '<p>O setor de mineração, um dos mais importantes do estado, já planeja utilizar a tecnologia para implementar minas autônomas e sistemas de monitoramento em tempo real, aumentando a segurança e a eficiência operacional.</p>' +
      '<h3>Transformação em diversos setores</h3>' +
      '<p><strong>Saúde:</strong> Hospitais já planejam implementar cirurgias remotas assistidas por robôs e monitoramento em tempo real de pacientes críticos. A telemedicina ganhará novo impulso, permitindo consultas com qualidade de vídeo 4K e compartilhamento instantâneo de exames médicos de alta resolução.</p>' +
      '<p><strong>Agricultura:</strong> A tecnologia permitirá o uso massivo de IoT (Internet das Coisas) para automação de processos agrícolas, desde irrigação inteligente até monitoramento de rebanhos com coleiras conectadas.</p>' +
      '<p><strong>Educação:</strong> As universidades poderão expandir programas de ensino à distância com qualidade superior, incluindo aulas em realidade virtual e laboratórios remotos para experimentos científicos.</p>' +
      '<h3>Cobertura e disponibilidade</h3>' +
      '<p>Segundo as operadoras, a cobertura inicial se concentrará nos centros urbanos das cidades, expandindo gradualmente para áreas periféricas ao longo de 2026. Para utilizar o 5G, os usuários precisam ter aparelhos compatíveis com a tecnologia e contratar planos específicos que custam, em média, 20% a mais que os planos 4G tradicionais.</p>',
    categoryId: [1],
    author: 'João Silva',
    mediaNews: [
      {
        id: 2,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1200',
          small: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400',
          medium: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800',
          superSmall: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=200',
        },
        author: 'João Silva',
        date: '2025-10-07T09:30:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-07T09:30:00Z',
    createdAt: '2025-10-07T09:30:00Z',
    updateAt: '2025-10-07T09:30:00Z',
    views: 6234,
    status: 'published',
    slug: '5g-chega-15-novos-municipios-para',
    isEmphasis: false,
  },
  {
    id: 3,
    title: 'UFPA inaugura laboratório de robótica avançada',
    subtitle: 'Centro de pesquisa vai desenvolver tecnologias para a Amazônia',
    content:
      '<p>A Universidade Federal do Pará (UFPA) inaugurou nesta terça-feira um moderno laboratório de robótica avançada com investimento total de R$ 5 milhões. O espaço, localizado no campus do Guamá em Belém, é o mais completo da região Norte e vai se dedicar ao desenvolvimento de tecnologias robóticas voltadas para os desafios específicos da Amazônia.</p>' +
      '<h3>Infraestrutura de ponta</h3>' +
      '<p>O Laboratório de Robótica e Automação Amazônica (LabRAA) conta com equipamentos de última geração:</p>' +
      '<ul><li>10 estações de trabalho com computadores de alto desempenho</li><li>Impressoras 3D industriais para prototipagem</li><li>Braços robóticos colaborativos</li><li>Drones de pesquisa com sensores avançados</li><li>Tanque de testes para robôs aquáticos</li><li>Arena de testes para robôs terrestres</li><li>Câmara climática para simulação de condições amazônicas</li></ul>' +
      '<p>Os recursos vieram de uma parceria entre o Ministério da Ciência e Tecnologia, CNPq, Governo do Estado e empresas privadas interessadas em inovação regional.</p>' +
      '<h3>Projetos em desenvolvimento</h3>' +
      '<p>Segundo a coordenadora do laboratório, Profa. Dra. Amanda Rodrigues, diversos projetos já estão em andamento:</p>' +
      '<p><strong>1. Robôs de monitoramento ambiental:</strong> Desenvolvimento de drones autônomos capazes de sobrevoar a floresta detectando queimadas, desmatamento ilegal e mudanças na vegetação. Os equipamentos usam inteligência artificial para análise de imagens em tempo real.</p>' +
      '<p><strong>2. ROV (Veículo Operado Remotamente) aquático:</strong> Um robô submarino para exploração e pesquisa em rios amazônicos, capaz de coletar amostras de água, mapear o leito dos rios e monitorar a fauna aquática sem perturbá-la.</p>' +
      '<p><strong>3. Assistente robótico para comunidades ribeirinhas:</strong> Uma plataforma móvel que pode levar medicamentos e realizar teleconsultas médicas em áreas remotas, especialmente durante períodos de cheia quando muitas comunidades ficam isoladas.</p>' +
      '<blockquote>"Estamos desenvolvendo tecnologia genuinamente brasileira, pensada para resolver problemas locais. Não adianta importar soluções prontas que não consideram as particularidades da Amazônia", explica a professora Amanda.</blockquote>' +
      '<h3>Formação de recursos humanos</h3>' +
      '<p>Além da pesquisa, o laboratório receberá alunos de graduação e pós-graduação em Engenharia da Computação, Engenharia Elétrica e áreas correlatas. Estão previstas 30 vagas para iniciação científica e 15 vagas para mestrado e doutorado já em 2026.</p>' +
      '<p>A UFPA também firmou convênios com universidades internacionais, como MIT (Estados Unidos) e ETH Zurich (Suíça), para intercâmbio de pesquisadores e transferência de conhecimento.</p>' +
      '<h3>Impacto para a região</h3>' +
      '<p>O reitor da UFPA, Prof. Dr. Emmanuel Tourinho, destacou a importância do laboratório para o desenvolvimento regional: <em>"Este é um marco para a ciência paraense. Estamos provando que é possível fazer pesquisa de excelência aqui na Amazônia, formando profissionais qualificados e criando soluções inovadoras para nossa região"</em>.</p>' +
      '<p>Empresas de tecnologia já demonstraram interesse em parcerias, e há expectativa de que o laboratório se torne um polo de inovação, atraindo startups e investimentos para o estado.</p>',
    categoryId: [1, 7], // Tecnologia e Educação
    author: 'Maria Santos',
    mediaNews: [
      {
        id: 3,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200',
          small: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
          medium: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
          superSmall: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200',
        },
        author: 'Maria Santos',
        date: '2025-10-06T14:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-06T14:00:00Z',
    createdAt: '2025-10-06T14:00:00Z',
    updateAt: '2025-10-06T14:00:00Z',
    views: 4532,
    status: 'published',
    slug: 'ufpa-inaugura-laboratorio-robotica-avancada',
    isEmphasis: true,
  },
  {
    id: 4,
    title: 'Hackers paraenses vencem competição nacional de cibersegurança',
    subtitle: 'Equipe da UFPA conquista primeiro lugar em torneio',
    content:
      '<p>Um grupo de cinco estudantes de Ciência da Computação da UFPA conquistou o primeiro lugar na HackBR 2025, a maior competição de cibersegurança do Brasil. A equipe "Cyber Pará" superou mais de 200 times de universidades de todo o país e levou para casa o prêmio de R$ 50 mil.</p>' +
      '<h3>A competição</h3>' +
      '<p>O HackBR é um evento anual que reúne os melhores talentos em segurança da informação do país. Durante 48 horas ininterruptas, as equipes enfrentam desafios de:</p>' +
      '<ul><li>Invasão ética de sistemas (penetration testing)</li><li>Análise forense digital</li><li>Criptografia e quebra de códigos</li><li>Segurança de redes e aplicações web</li><li>Engenharia reversa de malwares</li><li>Defesa contra ataques DDoS</li></ul>' +
      '<p>A final aconteceu em São Paulo, reunindo as 20 melhores equipes classificadas nas etapas regionais. A Cyber Pará foi a única representante da região Norte entre os finalistas.</p>' +
      '<h3>A equipe campeã</h3>' +
      '<p>O time paraense é formado por:</p>' +
      '<ul><li><strong>Lucas Ferreira, 22 anos</strong> - Capitão da equipe, especialista em exploração de vulnerabilidades</li><li><strong>Amanda Costa, 21 anos</strong> - Expert em criptografia e análise de códigos</li><li><strong>Rafael Souza, 23 anos</strong> - Especialista em forense digital</li><li><strong>Juliana Santos, 20 anos</strong> - Focada em segurança de redes</li><li><strong>Pedro Oliveira, 22 anos</strong> - Engenharia reversa e análise de malwares</li></ul>' +
      '<blockquote>"Foi uma experiência incrível. Competimos com equipes de universidades renomadas como USP, Unicamp e ITA. Provar que estudantes da Amazônia podem vencer uma competição nacional em tecnologia é motivo de muito orgulho", celebra Lucas Ferreira, capitão da equipe.</blockquote>' +
      '<h3>O desafio final</h3>' +
      '<p>Na prova decisiva, as equipes precisaram defender uma infraestrutura crítica simulada contra ondas de ataques cibernéticos, enquanto simultaneamente tentavam invadir os sistemas das equipes adversárias. A Cyber Pará destacou-se pela estratégia equilibrada entre ataque e defesa.</p>' +
      '<p>Em uma das provas mais difíceis, os estudantes paraenses decifraram um código malicioso em apenas 47 minutos, enquanto a segunda colocada levou 1h23min. "Treinamos muito para este momento. Passamos meses estudando casos reais de ataques e desenvolvendo nossas próprias ferramentas", conta Amanda Costa.</p>' +
      '<h3>Reconhecimento e futuro</h3>' +
      '<p>Além do prêmio em dinheiro, a equipe recebeu propostas de estágio de empresas como Google, Microsoft e Banco do Brasil. Três membros já confirmaram que vão fazer intercâmbio em universidades americanas no próximo semestre.</p>' +
      '<p>O professor orientador, Dr. Carlos Mendes, comemora: <em>"Este é o resultado de anos de investimento em pesquisa e extensão. Nosso grupo de estudos em cibersegurança começou com apenas 5 alunos há 3 anos. Hoje temos mais de 50 estudantes engajados"</em>.</p>' +
      '<p>A vitória também chamou atenção para a necessidade de mais profissionais na área. Segundo dados da Associação Brasileira de Empresas de Tecnologia, o Brasil precisa formar 100 mil especialistas em cibersegurança até 2027 para atender a demanda do mercado.</p>',
    categoryId: [1],
    author: 'Carlos Mendes',
    mediaNews: [
      {
        id: 4,
        emphasis: false,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200',
          small: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
          medium: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
          superSmall: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200',
        },
        author: 'Carlos Mendes',
        date: '2025-10-05T11:20:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-05T11:20:00Z',
    createdAt: '2025-10-05T11:20:00Z',
    updateAt: '2025-10-05T11:20:00Z',
    views: 3876,
    status: 'published',
    slug: 'hackers-paraenses-vencem-competicao-nacional-ciberseguranca',
    isEmphasis: false,
  },

  // POLÍTICA (id: 2)
  {
    id: 5,
    title: 'Governador anuncia novo plano de desenvolvimento para o Pará',
    subtitle: 'Investimentos somam R$ 2 bilhões em infraestrutura',
    content:
      '<p>Em coletiva de imprensa realizada no Palácio do Governo nesta quinta-feira, o governador apresentou o "Pará 2030", um ambicioso plano estratégico de desenvolvimento que prevê investimentos de R$ 2 bilhões em infraestrutura, educação e saúde. O programa tem como meta transformar o estado em referência nacional em desenvolvimento sustentável.</p>' +
      '<h3>Eixos do programa</h3>' +
      '<p>O Pará 2030 está estruturado em cinco eixos principais:</p>' +
      '<p><strong>1. Infraestrutura e Logística (R$ 800 milhões)</strong></p>' +
      '<ul><li>Pavimentação de 1.200 km de rodovias estaduais</li><li>Modernização dos portos de Belém, Santarém e Marabá</li><li>Construção de 15 novos terminais rodoviários</li><li>Ampliação do aeroporto de Santarém</li><li>Implantação de corredores de transporte multimodal</li></ul>' +
      '<p><strong>2. Educação (R$ 500 milhões)</strong></p>' +
      '<ul><li>Construção de 50 novas escolas em tempo integral</li><li>Formação continuada de 20 mil professores</li><li>Programa de digitalização das escolas rurais</li><li>Expansão do ensino técnico profissionalizante</li><li>Bolsas de estudo para 10 mil estudantes universitários</li></ul>' +
      '<p><strong>3. Saúde (R$ 400 milhões)</strong></p>' +
      '<ul><li>Reforma e ampliação de 30 hospitais regionais</li><li>Aquisição de 100 novas ambulâncias</li><li>Implantação de telemedicina em 50 municípios</li><li>Construção de 3 novos centros de especialidades médicas</li></ul>' +
      '<p><strong>4. Desenvolvimento Sustentável (R$ 200 milhões)</strong></p>' +
      '<ul><li>Programa de reflorestamento com 5 milhões de mudas</li><li>Incentivos à bioeconomia e cadeias produtivas da floresta</li><li>Sistema de monitoramento ambiental em tempo real</li><li>Apoio a comunidades tradicionais e povos indígenas</li></ul>' +
      '<p><strong>5. Inovação e Tecnologia (R$ 100 milhões)</strong></p>' +
      '<ul><li>Criação de 3 parques tecnológicos no interior</li><li>Fundo de investimento em startups paraenses</li><li>Expansão da banda larga para zona rural</li><li>Programa de capacitação em tecnologia para jovens</li></ul>' +
      '<blockquote>"Este é o maior programa de investimentos da história recente do Pará. Vamos transformar nosso estado mantendo o compromisso com a preservação ambiental e a justiça social. O Pará pode e vai ser protagonista do desenvolvimento sustentável no Brasil", declarou o governador.</blockquote>' +
      '<h3>Parcerias e financiamento</h3>' +
      '<p>Os recursos virão de múltiplas fontes: R$ 1,2 bilhão do orçamento estadual, R$ 500 milhões de financiamentos federais, R$ 200 milhões de parcerias público-privadas e R$ 100 milhões de organismos internacionais como BID e Banco Mundial.</p>' +
      '<p>O governo estadual já assinou protocolo de intenções com o BNDES para financiamento de projetos de infraestrutura e com o Banco Mundial para ações de desenvolvimento sustentável.</p>' +
      '<h3>Cronograma e metas</h3>' +
      '<p>As primeiras obras começam em janeiro de 2026. A previsão é que até 2028 já se tenha:</p>' +
      '<ul><li>70% das rodovias contempladas concluídas</li><li>Todas as 50 escolas em funcionamento</li><li>Sistema de telemedicina operacional em todo o estado</li><li>Redução de 30% no tempo de deslocamento de cargas</li><li>Criação de 15 mil novos empregos diretos</li></ul>' +
      '<p>A oposição na Assembleia Legislativa reagiu com cautela. O deputado João Almeida (PSDB) afirmou: <em>"É um plano ambicioso, mas precisamos ver os detalhes de execução e garantir transparência total nos gastos públicos"</em>.</p>' +
      '<p>Entidades empresariais comemoraram o anúncio. A Federação das Indústrias do Estado do Pará destacou que os investimentos em logística são fundamentais para aumentar a competitividade da produção paraense.</p>',
    categoryId: [2],
    author: 'Ana Paula Rodrigues',
    mediaNews: [
      {
        id: 5,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200',
          small: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400',
          medium: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
          superSmall: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=200',
        },
        author: 'Ana Paula Rodrigues',
        date: '2025-10-08T08:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-08T08:00:00Z',
    createdAt: '2025-10-08T08:00:00Z',
    updateAt: '2025-10-08T08:00:00Z',
    views: 12345,
    status: 'published',
    slug: 'governador-anuncia-novo-plano-desenvolvimento-para',
    isEmphasis: true,
  },
  {
    id: 6,
    title: 'Assembleia Legislativa aprova lei de incentivo à inovação',
    subtitle: 'Medida prevê benefícios fiscais para empresas de tecnologia',
    content:
      '<p>Por unanimidade, a Assembleia Legislativa do Pará (Alepa) aprovou nesta quarta-feira o Projeto de Lei 3847/2025, que institui o Programa Paraense de Incentivo à Inovação (Para Inova). A medida concede benefícios fiscais a empresas de tecnologia e inovação instaladas no estado, visando atrair investimentos e fomentar o ecossistema de startups na região.</p>' +
      '<h3>Principais benefícios</h3>' +
      '<p>As empresas que aderirem ao programa terão acesso a:</p>' +
      '<ul><li><strong>Redução de até 75% no ICMS</strong> para operações interestaduais de produtos tecnológicos</li><li><strong>Isenção total de IPVA</strong> para veículos utilizados em P&D</li><li><strong>Redução de 50% no ISS</strong> para serviços de desenvolvimento de software</li><li><strong>Crédito presumido</strong> para importação de equipamentos tecnológicos</li><li><strong>Isenção de ITBI</strong> na aquisição de imóveis para parques tecnológicos</li></ul>' +
      '<p>Para ter direito aos incentivos, as empresas precisam comprovar investimento mínimo de 5% do faturamento em pesquisa e desenvolvimento, além de manter pelo menos 60% dos funcionários contratados residentes no Pará.</p>' +
      '<h3>Impacto esperado</h3>' +
      '<p>Segundo estudo técnico elaborado pela Secretaria de Desenvolvimento Econômico, o programa pode:</p>' +
      '<ul><li>Atrair R$ 500 milhões em investimentos nos próximos 3 anos</li><li>Gerar 8 mil empregos qualificados até 2028</li><li>Aumentar em 40% o número de startups no estado</li><li>Elevar a arrecadação tributária em R$ 120 milhões anuais a partir de 2027</li></ul>' +
      '<blockquote>"Esta lei posiciona o Pará no mapa da inovação nacional. Vamos competir de igual para igual com polos tecnológicos consolidados como São Paulo, Santa Catarina e Rio Grande do Sul", afirmou o deputado Roberto Lima (PT), autor do projeto.</blockquote>' +
      '<h3>Debate e aprovação</h3>' +
      '<p>O projeto tramitou por 8 meses na Alepa, passando por audiências públicas em Belém, Santarém e Marabá. Representantes de empresas de tecnologia, universidades e entidades empresariais participaram das discussões e sugeriram melhorias no texto original.</p>' +
      '<p>A deputada Marina Silva (PSOL) destacou a importância da inclusão de cláusulas sociais: <em>"Conseguimos incluir no texto a obrigatoriedade de programas de formação em parceria com escolas públicas. Isso garante que jovens de baixa renda tenham oportunidades no setor tech"</em>.</p>' +
      '<h3>Próximos passos</h3>' +
      '<p>A lei aguarda agora sanção do governador, que já sinalizou que vai assiná-la até o final do mês. A regulamentação ficará a cargo da Secretaria da Fazenda, que terá 90 dias para publicar as normas de adesão.</p>' +
      '<p>Empresas interessadas poderão se cadastrar a partir de janeiro de 2026 através do portal www.parainova.pa.gov.br. A previsão é que os primeiros benefícios fiscais comecem a valer em abril de 2026.</p>' +
      '<p><strong>Reação do setor:</strong> A Associação Brasileira de Startups (ABStartups) parabenizou a aprovação. "O Pará dá um passo importante para se tornar um hub de inovação na Amazônia. Esta lei cria um ambiente favorável para que empreendedores desenvolvam soluções tecnológicas com impacto regional e global", declarou Pedro Santos, diretor regional da entidade.</p>',
    categoryId: [2, 4], // Política e Economia
    author: 'Roberto Lima',
    mediaNews: [
      {
        id: 6,
        emphasis: false,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200',
          small: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400',
          medium: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800',
          superSmall: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=200',
        },
        author: 'Roberto Lima',
        date: '2025-10-07T16:30:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-07T16:30:00Z',
    createdAt: '2025-10-07T16:30:00Z',
    updateAt: '2025-10-07T16:30:00Z',
    views: 5678,
    status: 'published',
    slug: 'assembleia-legislativa-aprova-lei-incentivo-inovacao',
    isEmphasis: false,
  },
  {
    id: 7,
    title: 'Municípios paraenses assinam pacto pela transparência pública',
    subtitle: '50 cidades aderem à iniciativa de gestão aberta',
    content:
      '<p>Representantes de 50 municípios paraenses assinaram nesta sexta-feira o Pacto Pela Transparência Pública, um compromisso coletivo para aumentar a transparência e a participação cidadã na gestão pública. O evento aconteceu no Hangar Centro de Convenções, em Belém, e contou com a presença de prefeitos, secretários e representantes da sociedade civil.</p>' +
      '<h3>Compromissos assumidos</h3>' +
      '<p>As cidades signatárias se comprometem a implementar até dezembro de 2026:</p>' +
      '<ul><li><strong>Portais de Dados Abertos:</strong> Publicação de todas as despesas, contratos e licitações em formato acessível e compreensível</li><li><strong>Audiências Públicas Mensais:</strong> Prestação de contas regular com participação da população</li><li><strong>Ouvidoria Digital:</strong> Aplicativo para denúncias e solicitações com resposta em até 48 horas</li><li><strong>Orçamento Participativo:</strong> População decide sobre pelo menos 5% do orçamento municipal</li><li><strong>Conselho de Transparência:</strong> Grupo formado por cidadãos para fiscalizar a gestão</li></ul>' +
      '<h3>Iniciativa pioneira</h3>' +
      '<p>O pacto é uma iniciativa do Tribunal de Contas dos Municípios (TCM-PA) em parceria com o Ministério Público e a Associação dos Municípios do Pará. Segundo dados do TCM, apenas 15% das prefeituras paraenses tinham portais de transparência em pleno funcionamento antes da iniciativa.</p>' +
      '<blockquote>"A transparência não é um favor do gestor público, é um direito do cidadão. Este pacto marca uma nova era na relação entre governo e sociedade no Pará", declarou a conselheira do TCM, Rosa Egídia Lopes.</blockquote>' +
      '<p>Entre os municípios signatários estão capitais regionais como Santarém, Marabá, Castanhal e Parauapebas, além de 46 cidades de pequeno e médio porte espalhadas pelas 12 regiões de integração do estado.</p>' +
      '<h3>Ferramentas e capacitação</h3>' +
      '<p>Para apoiar a implementação, o TCM disponibilizará:</p>' +
      '<ul><li>Plataforma digital gratuita de gestão transparente</li><li>Capacitação para servidores municipais</li><li>Assessoria técnica durante 12 meses</li><li>Certificação digital para municípios que cumprirem todas as metas</li></ul>' +
      '<p>O prefeito de Paragominas, Paulo Pombo, destacou os benefícios práticos: <em>"Em Paragominas já temos portal de transparência há 5 anos. Posso afirmar que além de prevenir corrupção, a transparência melhora a gestão. Quando tudo é público, os gestores ficam mais atentos ao bom uso do dinheiro"</em>.</p>' +
      '<h3>Controle social</h3>' +
      '<p>Uma das inovações do pacto é a criação de uma rede de observatórios cidadãos. Organizações da sociedade civil de cada município vão monitorar o cumprimento dos compromissos e produzir relatórios trimestrais.</p>' +
      '<p>Maria do Socorro, presidente da Associação de Moradores do bairro do Tapanã em Belém, comemorou: <em>"Sempre lutamos por mais transparência. Agora teremos ferramentas concretas para acompanhar onde está sendo aplicado o dinheiro dos nossos impostos. Isso é cidadania de verdade"</em>.</p>' +
      '<h3>Reconhecimento nacional</h3>' +
      '<p>A iniciativa já repercutiu nacionalmente. A Controladoria Geral da União (CGU) manifestou interesse em replicar o modelo em outros estados. Representantes de governos estaduais do Amazonas, Acre e Rondônia participaram do evento como observadores.</p>' +
      '<p>O Pará pode se tornar o primeiro estado brasileiro a ter mais de 50% dos municípios com gestão certificadamente transparente, segundo projeções do TCM.</p>',
    categoryId: [2],
    author: 'Fernanda Costa',
    mediaNews: [
      {
        id: 7,
        emphasis: false,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
          small: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
          medium: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
          superSmall: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200',
        },
        author: 'Fernanda Costa',
        date: '2025-10-06T10:15:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-06T10:15:00Z',
    createdAt: '2025-10-06T10:15:00Z',
    updateAt: '2025-10-06T10:15:00Z',
    views: 3421,
    status: 'published',
    slug: 'municipios-paraenses-assinam-pacto-transparencia-publica',
    isEmphasis: false,
  },

  // ESPORTES (id: 3)
  {
    id: 8,
    title: 'Remo vence clássico Re-Pa e assume liderança do Parazão',
    subtitle: 'Leão Azul faz 2 a 0 no Paysandu no Mangueirão',
    content:
      '<p>Em partida emocionante disputada na noite deste domingo no Estádio Mangueirão, o Clube do Remo venceu o arquirrival Paysandu por 2 a 0 e assumiu a liderança isolada do Campeonato Paraense 2025. Os gols foram marcados por Pedro Henrique e Brenner no segundo tempo, diante de um público entusiasmado de 47.832 torcedores.</p>' +
      '<h3>A partida</h3>' +
      '<p>O clássico Re-Pa, um dos maiores derbies do futebol brasileiro, não decepcionou em emoção. O primeiro tempo foi equilibrado, com as duas equipes criando oportunidades mas pecando na finalização. O Paysandu teve mais posse de bola (58%), enquanto o Remo apostou nos contra-ataques rápidos.</p>' +
      '<p>A partida mudou aos 23 minutos do segundo tempo, quando o atacante <strong>Pedro Henrique</strong> recebeu cruzamento perfeito de Raimar pela direita e cabeceou sem chances para o goleiro Matheus Nogueira. O Mangueirão explodiu em festa azulina.</p>' +
      '<blockquote>"Trabalhamos a semana toda para este jogo. Sabíamos que o Paysandu viria pressionando, mas nossa estratégia funcionou perfeitamente. Estou muito feliz por marcar em um Re-Pa", declarou Pedro Henrique após a partida.</blockquote>' +
      '<p>O segundo gol saiu aos 41 minutos, em jogada de velocidade. <strong>Brenner</strong> arrancou do meio-campo, passou por dois marcadores e finalizou no canto direito de Matheus Nogueira, fechando o placar em 2 a 0.</p>' +
      '<h3>Números do jogo</h3>' +
      '<ul><li><strong>Posse de bola:</strong> Paysandu 58% x 42% Remo</li><li><strong>Finalizações:</strong> Paysandu 14 (4 no gol) x Remo 9 (5 no gol)</li><li><strong>Escanteios:</strong> Paysandu 7 x 3 Remo</li><li><strong>Faltas:</strong> Paysandu 18 x 15 Remo</li><li><strong>Cartões amarelos:</strong> 4 para cada equipe</li><li><strong>Público:</strong> 47.832 torcedores</li><li><strong>Renda:</strong> R$ 1,2 milhão</li></ul>' +
      '<h3>Classificação</h3>' +
      '<p>Com a vitória, o Remo chega aos <strong>19 pontos em 8 jogos</strong> e assume a liderança isolada do Parazão. O Paysandu fica em terceiro lugar com 14 pontos. O Águia de Marabá é o segundo colocado com 16 pontos.</p>' +
      '<p>Faltam apenas 4 rodadas para o fim da primeira fase. Os quatro primeiros colocados se classificam para as semifinais do estadual.</p>' +
      '<h3>Reações</h3>' +
      '<p>O técnico do Remo, Paulo Bonamigo, elogiou a atuação da equipe: <em>"Foi uma vitória construída com muita inteligência tática. Sabíamos que o Paysandu viria para cima, então nos organizamos defensivamente e aproveitamos as oportunidades no contra-ataque. Estou muito orgulhoso dos jogadores"</em>.</p>' +
      '<p>Do lado bicolor, o técnico Ricardo Gomes lamentou: <em>"Tivemos volume de jogo, criamos chances, mas faltou eficiência. No futebol moderno, quem não faz, leva. Vamos trabalhar para corrigir os erros e buscar a recuperação já no próximo jogo"</em>.</p>' +
      '<h3>Próximos jogos</h3>' +
      '<p><strong>Remo:</strong> Enfrenta o Caeté na quarta-feira, às 20h, no Baenão.<br><strong>Paysandu:</strong> Joga contra o Bragantino no sábado, às 17h, no Mangueirão.</p>' +
      '<p>Nas redes sociais, a torcida azulina comemorou intensamente. A hashtag #RemoCampeão ficou entre os trending topics nacionais no X (antigo Twitter) por mais de 3 horas após o jogo.</p>',
    categoryId: [3],
    author: 'Lucas Tavares',
    mediaNews: [
      {
        id: 8,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200',
          small: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
          medium: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
          superSmall: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200',
        },
        author: 'Lucas Tavares',
        date: '2025-10-08T18:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-08T18:00:00Z',
    createdAt: '2025-10-08T18:00:00Z',
    updateAt: '2025-10-08T18:00:00Z',
    views: 25678,
    status: 'published',
    slug: 'remo-vence-classico-repa-assume-lideranca-parazao',
    isEmphasis: true,
  },
  {
    id: 9,
    title: 'Atleta paraense conquista ouro no Campeonato Brasileiro de Judô',
    subtitle: 'Aos 19 anos, judoca de Belém brilha em competição nacional',
    content:
      '<p>A judoca Mariana Ferreira, de apenas 19 anos e natural de Belém, conquistou a medalha de ouro na categoria até 57kg do Campeonato Brasileiro de Judô, realizado em São Paulo. A atleta, que treina no Centro de Treinamento do Pará, dominou a competição e venceu todas as cinco lutas por ippon, a vitória mais contundente no judô.</p>' +
      '<h3>Trajetória vitoriosa</h3>' +
      '<p>Mariana iniciou sua campanha vencendo a paulista Ana Carolina Silva nas oitavas de final. Nas quartas, superou a carioca Beatriz Monteiro, atual vice-campeã pan-americana. Na semifinal, aplicou um golpe perfeito em Juliana Costa (MG), conquistando o ippon em apenas 1min23s de combate.</p>' +
      '<blockquote>"Estava muito focada. Sabia que era a competição mais importante da minha carreira até agora. Quando pisei no tatame para a final, senti uma energia incrível. Dedico essa medalha à minha família e ao meu sensei", declarou Mariana emocionada.</blockquote>' +
      '<p>A final foi contra a favorita Rafaela Santos (SP), tricampeã brasileira e medalhista de bronze nos Jogos Pan-Americanos de 2023. Em luta disputada, Mariana aplicou um ippon com harai-goshi aos 3min47s, surpreendendo analistas e torcida.</p>' +
      '<h3>Histórico e preparação</h3>' +
      '<p>Mariana começou no judô aos 7 anos, no projeto social "Judô para Todos" do bairro do Jurunas, em Belém. Descoberta pelo técnico Ronaldo Machado, ela passou a treinar no Centro de Treinamento de Alto Rendimento do Pará há 6 anos.</p>' +
      '<p>Sua rotina de preparação é intensa:</p>' +
      '<ul><li>Treinos técnicos: 4 horas por dia, 6 dias por semana</li><li>Musculação e condicionamento físico: 2 horas diárias</li><li>Acompanhamento nutricional e psicológico</li><li>Estudos de vídeo de adversárias</li><li>Competições mensais para ganhar experiência</li></ul>' +
      '<p>O sensei Ronaldo Machado comemora: <em>"Mariana é uma atleta extraordinária. Tem técnica refinada, força mental e humildade para continuar evoluindo. Sempre soube que ela chegaria longe"</em>.</p>' +
      '<h3>Próximos desafios</h3>' +
      '<p>Com o título brasileiro, Mariana garante vaga na seleção brasileira para o Sul-Americano de Judô, que acontece em novembro em Buenos Aires. Ela também está no radar da Confederação Brasileira para integrar a equipe que disputará o Mundial de 2026 no Japão.</p>' +
      '<p>A Secretaria de Estado de Esporte e Lazer (Seel) anunciou a concessão de uma bolsa-atleta no valor de R$ 3 mil mensais para apoiar a preparação de Mariana. "É um reconhecimento merecido. Queremos que ela tenha as melhores condições para representar o Pará e o Brasil", afirmou o secretário José Carlos Araújo.</p>' +
      '<h3>Inspiração para novos talentos</h3>' +
      '<p>A vitória de Mariana já repercute nas academias e projetos sociais de judô em Belém. No projeto onde ela começou, as inscrições aumentaram 40% na última semana. "Ela é a prova de que com dedicação e apoio, jovens da periferia podem chegar ao topo do esporte", destaca a coordenadora do projeto, professora Ana Lúcia Soares.</p>' +
      '<p>Mariana pretende conciliar a carreira esportiva com os estudos. Ela está no segundo ano de Educação Física na universidade e sonha em, no futuro, treinar novos atletas. "Quero retribuir tudo que o judô me deu, formando novos campeões paraenses", projeta.</p>',
    categoryId: [3],
    author: 'Pedro Augusto',
    mediaNews: [
      {
        id: 9,
        emphasis: false,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200',
          small: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400',
          medium: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800',
          superSmall: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=200',
        },
        author: 'Pedro Augusto',
        date: '2025-10-07T20:30:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-07T20:30:00Z',
    createdAt: '2025-10-07T20:30:00Z',
    updateAt: '2025-10-07T20:30:00Z',
    views: 4567,
    status: 'published',
    slug: 'atleta-paraense-conquista-ouro-brasileiro-judo',
    isEmphasis: false,
  },
  {
    id: 10,
    title: 'Corrida de Rua Circuito Belém reúne 5 mil participantes',
    subtitle: 'Evento promove saúde e movimenta turismo na capital',
    content:
      '<p>A 15ª edição da Corrida de Rua Circuito Belém reuniu cerca de 5 mil atletas amadores e profissionais na manhã deste domingo. O evento, que é um dos maiores do calendário esportivo paraense, teve largada às 6h da manhã na Praça da República e passou pelos principais pontos turísticos da capital.</p>' +
      '<h3>Percurso turístico</h3>' +
      '<p>O trajeto de 10 quilômetros foi cuidadosamente planejado para mostrar o melhor de Belém:</p>' +
      '<ul><li>Praça da República (largada)</li><li>Avenida Presidente Vargas</li><li>Complexo do Ver-o-Peso</li><li>Boulevard Castilhos França</li><li>Mercado de São Brás</li><li>Praça Batista Campos</li><li>Teatro da Paz</li><li>Retorno à Praça da República (chegada)</li></ul>' +
      '<p>Para corredores iniciantes, havia a opção de percurso de 5km, que atraiu 2.500 participantes, incluindo muitas famílias com crianças.</p>' +
      '<h3>Vencedores</h3>' +
      '<p><strong>Categoria Masculina (10km):</strong></p>' +
      '<ol><li>John Kipkoech (Quênia) - 29min47s - R$ 5.000</li><li>Paulo Santos (PA) - 30min12s - R$ 3.000</li><li>Carlos Andrade (SP) - 30min28s - R$ 2.000</li></ol>' +
      '<p><strong>Categoria Feminina (10km):</strong></p>' +
      '<ol><li>Jéssica Marques (PA) - 33min54s - R$ 5.000</li><li>Ana Paula Costa (PA) - 34min21s - R$ 3.000</li><li>Mariana Oliveira (RJ) - 34min45s - R$ 2.000</li></ol>' +
      '<blockquote>"Estou muito feliz com a vitória, mas o mais importante é ver tantas pessoas praticando esporte. Belém é uma cidade linda e correr por suas ruas históricas foi uma experiência incrível", declarou John Kipkoech, vencedor na categoria masculina.</blockquote>' +
      '<p>Destaque para o desempenho da paraense Jéssica Marques, que bateu o recorde da prova feminina. O tempo anterior era de 34min11s, estabelecido em 2022.</p>' +
      '<h3>Impacto econômico e turístico</h3>' +
      '<p>O evento movimentou a economia local. Segundo a Belemtur (órgão de turismo da capital), cerca de 1.200 atletas vieram de outros estados e países, ocupando hotéis, restaurantes e visitando atrações turísticas.</p>' +
      '<p>A estimativa é que o Circuito Belém tenha injetado R$ 2,5 milhões na economia da cidade durante o final de semana, considerando hospedagem, alimentação, transporte e compras.</p>' +
      '<h3>Saúde e bem-estar</h3>' +
      '<p>Além da competição, o evento ofereceu área de saúde com:</p>' +
      '<ul><li>Medição de pressão arterial e glicemia</li><li>Avaliação física e nutricional gratuita</li><li>Palestras sobre alimentação saudável</li><li>Distribuição de material educativo</li><li>Vacinação contra gripe</li></ul>' +
      '<p>A Secretaria Municipal de Saúde (Sesma) realizou 2.300 atendimentos durante o evento.</p>' +
      '<blockquote>"Eventos como este incentivam hábitos saudáveis e mostram que exercício físico pode ser prazeroso. Muitas pessoas que participam pela primeira vez acabam se tornando corredoras regulares", afirma Dr. Roberto Campos, diretor da Sesma.</blockquote>' +
      '<h3>Sustentabilidade</h3>' +
      '<p>A organização implementou diversas ações sustentáveis:</p>' +
      '<ul><li>Copos biodegradáveis nos postos de hidratação</li><li>Medalhas feitas com material reciclado</li><li>Coleta seletiva em todos os pontos do percurso</li><li>Compensação de carbono através de plantio de árvores</li></ul>' +
      '<p>No total, foram coletados 850kg de resíduos recicláveis durante o evento. A prefeitura se comprometeu a plantar 500 mudas de árvores nativas como forma de compensação ambiental.</p>' +
      '<h3>Próxima edição</h3>' +
      '<p>A 16ª edição do Circuito Belém já tem data marcada: 4 de outubro de 2026. As inscrições serão abertas em abril, com preços promocionais para os primeiros mil inscritos.</p>',
    categoryId: [3, 5], // Esportes e Saúde
    author: 'Juliana Martins',
    mediaNews: [
      {
        id: 10,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200',
          small: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400',
          medium: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
          superSmall: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=200',
        },
        author: 'Juliana Martins',
        date: '2025-10-06T07:45:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-06T07:45:00Z',
    createdAt: '2025-10-06T07:45:00Z',
    updateAt: '2025-10-06T07:45:00Z',
    views: 6789,
    status: 'published',
    slug: 'corrida-rua-circuito-belem-reune-5-mil-participantes',
    isEmphasis: true,
  },
  {
    id: 11,
    title: 'Paysandu contrata técnico campeão da Série B',
    subtitle: 'Clube bicolor busca reforço para temporada 2026',
    content:
      '<p>O Paysandu Sport Club anunciou oficialmente nesta quinta-feira a contratação do técnico Ricardo Gomes, campeão da Série B do Campeonato Brasileiro em 2024 pelo Goiás. O treinador de 51 anos assinou contrato até dezembro de 2026 e chega com a missão clara: conquistar o tão sonhado acesso à elite do futebol brasileiro.</p>' +
      '<h3>Currículo vencedor</h3>' +
      '<p>Ricardo Gomes traz em seu currículo conquistas importantes:</p>' +
      '<ul><li>Campeão da Série B - Goiás (2024)</li><li>Campeão Goiano - Goiás (2024)</li><li>Vice-campeão da Copa do Brasil - Goiás (2023)</li><li>Campeão Paranaense - Athletico-PR (2021)</li><li>Acesso à Série A - Botafogo-SP (2020)</li></ul>' +
      '<p>O técnico é conhecido por seu trabalho ofensivo e valorização de jovens talentos. Pelo Goiás, ele teve aproveitamento de 68% em 2024, com média de 2,1 gols marcados por partida.</p>' +
      '<blockquote>"É uma honra enorme vestir a camisa do Paysandu, um dos clubes mais tradicionais do Norte do Brasil. Venho com muita vontade de trabalhar e devolver o Papão ao lugar que merece, que é a Série A", afirmou Ricardo Gomes em sua apresentação.</blockquote>' +
      '<h3>Estrutura e planejamento</h3>' +
      '<p>O treinador chega acompanhado de sua comissão técnica completa:</p>' +
      '<ul><li>Marcelo Augusto - Auxiliar técnico</li><li>Fernando Lázaro - Preparador físico</li><li>Bruno Santos - Preparador de goleiros</li><li>Dr. Carlos Henrique - Fisiologista</li><li>Pedro Martins - Analista de desempenho</li></ul>' +
      '<p>A diretoria bicolor garantiu investimentos significativos para 2026. O orçamento destinado ao futebol é de R$ 18 milhões, 40% superior ao de 2025. Desse montante, R$ 8 milhões serão para contratações de jogadores.</p>' +
      '<h3>Metas e estratégia</h3>' +
      '<p>Ricardo Gomes traçou objetivos claros para sua gestão:</p>' +
      '<p><strong>Curto prazo (2026):</strong></p>' +
      '<ul><li>Conquistar o Campeonato Paraense</li><li>Boa campanha na Copa do Brasil</li><li>Montar elenco competitivo para a Série B</li></ul>' +
      '<p><strong>Médio prazo (2026-2027):</strong></p>' +
      '<ul><li>Buscar o acesso à Série A</li><li>Desenvolver base de jogadores locais</li><li>Implementar metodologia de jogo moderna</li><li>Profissionalizar ainda mais o clube</li></ul>' +
      '<p>"Não vamos prometer nada além de muito trabalho. O acesso à Série A é nosso objetivo principal, mas sabemos que é um caminho difícil. Vamos construir uma equipe competitiva, que jogue bonito e que a torcida bicolor se orgulhe", explicou o treinador.</p>' +
      '<h3>Primeiras contratações</h3>' +
      '<p>Aproveitando a chegada do novo técnico, o Paysandu já confirmou três reforços:</p>' +
      '<ul><li><strong>Marcelinho (atacante)</strong> - Estava no Goiás, artilheiro da Série B 2024 com 18 gols</li><li><strong>Zé Carlos (volante)</strong> - Ex-Ceará, conhecido pela marcação forte</li><li><strong>Bruno Alves (zagueiro)</strong> - Revelado no Paysandu, retorna após passagem por clubes do Sul</li></ul>' +
      '<p>Outros três nomes estão em negociação avançada, mas a diretoria prefere não divulgar antes de oficializar.</p>' +
      '<h3>Reação da torcida</h3>' +
      '<p>A Fiel Bicolor recebeu com entusiasmo a contratação. Nas redes sociais, hashtags como #BemVindoRicardoGomes e #RumoASerieA dominaram os trending topics paraenses. O clube ganhou 15 mil novos sócios-torcedores em apenas 48 horas após o anúncio.</p>' +
      '<p>Mauro Guimarães, presidente da maior torcida organizada do clube, comemorou: <em>"Ricardo Gomes tem tudo que a gente precisava: experiência em acesso, jogo ofensivo e conhece bem a Série B. Estamos confiantes que 2026 será nosso ano"</em>.</p>' +
      '<h3>Próximos passos</h3>' +
      '<p>Ricardo Gomes já iniciou o trabalho. Ele acompanhou os dois últimos jogos do Parazão 2025 para avaliar o elenco atual. A reapresentação está marcada para 2 de janeiro de 2026, com início da pré-temporada em Salinas (PA).</p>' +
      '<p>O primeiro jogo oficial sob seu comando será no dia 18 de janeiro, pela primeira rodada do Campeonato Paraense 2026.</p>',
    categoryId: [3],
    author: 'Marcos Vinícius',
    mediaNews: [
      {
        id: 11,
        emphasis: false,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
          small: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
          medium: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
          superSmall: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200',
        },
        author: 'Marcos Vinícius',
        date: '2025-10-05T15:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-05T15:00:00Z',
    createdAt: '2025-10-05T15:00:00Z',
    updateAt: '2025-10-05T15:00:00Z',
    views: 8932,
    status: 'published',
    slug: 'paysandu-contrata-tecnico-campeao-serie-b',
    isEmphasis: false,
  },

  // ECONOMIA (id: 4)
  {
    id: 12,
    title: 'Porto de Belém bate recorde de exportações em 2025',
    subtitle: 'Movimentação aumenta 35% em relação ao ano anterior',
    content:
      '<p>O Porto de Belém registrou um crescimento histórico de 35% na movimentação de cargas em 2025, totalizando 8,2 milhões de toneladas de produtos exportados. Os números, divulgados pela Companhia Docas do Pará (CDP), representam o melhor desempenho da história do porto e consolidam o Pará como um dos principais polos exportadores da região Norte.</p>' +
      '<h3>Produtos mais exportados</h3>' +
      '<p>A pauta de exportações foi diversificada:</p>' +
      '<ul><li><strong>Minério de ferro:</strong> 3,5 milhões de toneladas (+42%)</li><li><strong>Grãos (soja e milho):</strong> 2,1 milhões de toneladas (+38%)</li><li><strong>Madeira certificada:</strong> 850 mil toneladas (+28%)</li><li><strong>Produtos da bioeconomia (açaí, cacau, castanha):</strong> 420 mil toneladas (+52%)</li><li><strong>Alumínio e derivados:</strong> 380 mil toneladas (+15%)</li><li><strong>Outros produtos:</strong> 950 mil toneladas (+25%)</li></ul>' +
      '<h3>Principais destinos</h3>' +
      '<p>As exportações paraenses chegaram a 47 países em 2025:</p>' +
      '<ol><li>China - 38% do total</li><li>Estados Unidos - 18%</li><li>Países da União Europeia - 22%</li><li>Japão - 9%</li><li>Outros países - 13%</li></ol>' +
      '<blockquote>"Este resultado é fruto de investimentos em modernização e ampliação da capacidade operacional do porto. Conseguimos reduzir o tempo médio de embarque em 30% e aumentamos nossa competitividade", declarou João Carlos Mendes, presidente da CDP.</blockquote>' +
      '<h3>Investimentos e modernização</h3>' +
      '<p>Nos últimos 3 anos, o Porto de Belém recebeu investimentos de R$ 450 milhões em melhorias:</p>' +
      '<ul><li>Dragagem e aprofundamento do canal de navegação</li><li>Novos berços de atracação</li><li>Guindastes de última geração (Ship-to-Shore)</li><li>Sistema automatizado de controle de cargas</li><li>Armazéns climatizados para produtos especiais</li><li>Terminal especializado em contêineres</li></ul>' +
      '<p>O aprofundamento do canal permitiu que navios de maior calado, com capacidade até 100 mil toneladas, passassem a operar no porto, reduzindo custos logísticos.</p>' +
      '<h3>Impacto econômico</h3>' +
      '<p>O desempenho do porto gerou impactos positivos na economia paraense:</p>' +
      '<ul><li>Geração de 3.200 empregos diretos</li><li>12 mil empregos indiretos (transporte, armazenagem, serviços)</li><li>Arrecadação tributária de R$ 280 milhões em 2025</li><li>Movimentação financeira de R$ 4,5 bilhões</li></ul>' +
      '<p>Segundo dados da Secretaria de Desenvolvimento Econômico, a atividade portuária representa 8,5% do PIB estadual e é responsável por 15% das exportações totais do Pará.</p>' +
      '<h3>Sustentabilidade</h3>' +
      '<p>Um diferencial do Porto de Belém tem sido o compromisso com práticas sustentáveis:</p>' +
      '<ul><li>100% das madeiras exportadas possuem certificação FSC ou similar</li><li>Sistema de tratamento de efluentes e resíduos</li><li>Monitoramento ambiental contínuo</li><li>Programa de compensação ambiental com plantio de árvores</li><li>Parcerias com comunidades tradicionais para produtos da bioeconomia</li></ul>' +
      '<blockquote>"Queremos ser referência não apenas em volume, mas em responsabilidade ambiental e social. O futuro da exportação amazônica passa pela sustentabilidade", afirma Maria Helena Santos, diretora de Sustentabilidade da CDP.</blockquote>' +
      '<h3>Projeções para 2026</h3>' +
      '<p>Para 2026, as expectativas são ainda mais otimistas:</p>' +
      '<ul><li>Meta de 10 milhões de toneladas exportadas (+22%)</li><li>Início da operação do terminal de grãos expandido</li><li>Novos contratos com armadores internacionais</li><li>Ampliação das rotas para mercados asiáticos e africanos</li></ul>' +
      '<p>A CDP também anunciou novo pacote de investimentos de R$ 200 milhões para 2026-2027, incluindo a construção de um terminal de passageiros para receber cruzeiros internacionais que visitam a Amazônia.</p>' +
      '<p><strong>Nota do setor produtivo:</strong> A Federação das Indústrias do Pará (Fiepa) parabenizou o desempenho e destacou que a eficiência portuária é fundamental para a competitividade da produção estadual no mercado global.</p>',
    categoryId: [4],
    author: 'Sandra Oliveira',
    mediaNews: [
      {
        id: 12,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200',
          small: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400',
          medium: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800',
          superSmall: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=200',
        },
        author: 'Sandra Oliveira',
        date: '2025-10-08T11:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-08T11:00:00Z',
    createdAt: '2025-10-08T11:00:00Z',
    updateAt: '2025-10-08T11:00:00Z',
    views: 7654,
    status: 'published',
    slug: 'porto-belem-bate-recorde-exportacoes-2025',
    isEmphasis: true,
  },
  {
    id: 13,
    title: 'Banco do Pará anuncia linha de crédito para pequenos empreendedores',
    subtitle: 'Juros reduzidos e carência de 12 meses',
    content:
      '<p>O Banco do Estado do Pará (Banpará) lançou nesta terça-feira o programa "Credpará Empreendedor", uma nova linha de crédito especialmente voltada para microempreendedores individuais (MEI) e pequenas empresas. Com taxas de juros a partir de 0,8% ao mês e carência de até 12 meses, o programa visa fomentar o empreendedorismo e gerar emprego e renda no estado.</p>' +
      '<h3>Condições do financiamento</h3>' +
      '<p>O Credpará Empreendedor oferece condições diferenciadas:</p>' +
      '<ul><li><strong>Valores:</strong> De R$ 5 mil a R$ 150 mil</li><li><strong>Taxa de juros:</strong> A partir de 0,8% ao mês (9,6% ao ano)</li><li><strong>Prazo:</strong> Até 48 meses para pagar</li><li><strong>Carência:</strong> Até 12 meses (sem precisar pagar parcelas)</li><li><strong>Garantias:</strong> Simplificadas, aceita aval e bens como garantia</li><li><strong>Destinação:</strong> Capital de giro, compra de equipamentos, reforma ou expansão</li></ul>' +
      '<p>Os juros são progressivos: quem paga em dia tem desconto de 0,1% ao mês nas parcelas seguintes, podendo chegar a 0,6% ao mês para clientes adimplentes.</p>' +
      '<blockquote>"Queremos ser o banco do empreendedor paraense. Estas condições são as melhores do mercado e vão permitir que milhares de pequenos negócios cresçam e se desenvolvam", afirmou Ruth Pimentel, presidente do Banpará.</blockquote>' +
      '<h3>Público-alvo e requisitos</h3>' +
      '<p>Podem solicitar o crédito:</p>' +
      '<ul><li>Microempreendedores Individuais (MEI)</li><li>Microempresas (faturamento até R$ 360 mil/ano)</li><li>Pequenas empresas (faturamento até R$ 4,8 milhões/ano)</li><li>Empreendedores informais em processo de formalização</li></ul>' +
      '<p>Requisitos mínimos:</p>' +
      '<ul><li>Estar em atividade há pelo menos 6 meses</li><li>Não ter restrições graves no CPF/CNPJ</li><li>Apresentar plano de negócios simplificado</li><li>Comprovar capacidade de pagamento</li></ul>' +
      '<h3>Volume de recursos</h3>' +
      '<p>O Banpará destinou R$ 300 milhões para o programa em sua fase inicial. A expectativa é atender cerca de 12 mil empreendedores em 2026.</p>' +
      '<p>Do total, R$ 100 milhões serão direcionados especificamente para:</p>' +
      '<ul><li>Empreendedores de áreas periféricas e comunidades ribeirinhas (R$ 40 milhões)</li><li>Mulheres empreendedoras (R$ 35 milhões)</li><li>Jovens empresários com até 30 anos (R$ 25 milhões)</li></ul>' +
      '<h3>Como solicitar</h3>' +
      '<p>O processo de solicitação foi simplificado:</p>' +
      '<ol><li>Acessar o site www.banpara.b.br ou app Banpará</li><li>Preencher cadastro e enviar documentos digitalizados</li><li>Aguardar análise (prazo de até 5 dias úteis)</li><li>Se aprovado, assinar contrato digitalmente</li><li>Receber o crédito em conta (em até 48 horas após assinatura)</li></ol>' +
      '<p>Também é possível solicitar presencialmente em qualquer agência do Banpará. O banco montou equipes especializadas para atender empreendedores e orientar no preenchimento.</p>' +
      '<h3>Histórias de sucesso</h3>' +
      '<p>Durante a fase piloto do programa, alguns empreendedores já foram beneficiados:</p>' +
      '<p><strong>Maria da Conceição, 42 anos</strong> - Dona de salão de beleza no bairro do Tapanã, conseguiu R$ 30 mil para reformar e comprar novos equipamentos. <em>"Com o crédito, pude modernizar meu salão. Minhas clientes adoraram e consegui aumentar o faturamento em 60%"</em>, conta.</p>' +
      '<p><strong>João Pedro, 28 anos</strong> - Dono de hamburgueria artesanal, usou R$ 45 mil para comprar um food truck e ampliar as vendas. <em>"Estava vendendo só por delivery. Com o food truck, consigo atender em eventos e feiras. Foi fundamental para crescer"</em>.</p>' +
      '<h3>Apoio e capacitação</h3>' +
      '<p>Além do crédito, o Banpará firmou parcerias com:</p>' +
      '<ul><li><strong>Sebrae:</strong> Cursos gratuitos de gestão empresarial para tomadores de crédito</li><li><strong>Universidades:</strong> Mentorias com professores de administração e contabilidade</li><li><strong>Federações empresariais:</strong> Networking e oportunidades de negócios</li></ul>' +
      '<p>Todos os empreendedores que pegarem crédito terão acesso a uma plataforma digital com cursos sobre:</p>' +
      '<ul><li>Gestão financeira</li><li>Marketing digital</li><li>Atendimento ao cliente</li><li>Planejamento estratégico</li><li>Controle de estoque</li></ul>' +
      '<h3>Impacto econômico esperado</h3>' +
      '<p>Segundo projeções do banco:</p>' +
      '<ul><li>Criação de 15 mil novos empregos formais</li><li>Formalização de 3 mil empreendimentos informais</li><li>Aumento médio de 35% no faturamento dos beneficiados</li><li>Geração de R$ 450 milhões em movimentação econômica</li></ul>' +
      '<p>O secretário de Desenvolvimento Econômico, Adler Silveira, destacou: <em>"Este programa é estratégico para a economia paraense. Pequenos negócios representam 95% das empresas do estado e geram a maioria dos empregos. Fortalecer esse setor é fundamental"</em>.</p>',
    categoryId: [4],
    author: 'Rafael Souza',
    mediaNews: [
      {
        id: 13,
        emphasis: false,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200',
          small: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
          medium: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
          superSmall: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200',
        },
        author: 'Rafael Souza',
        date: '2025-10-07T13:20:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-07T13:20:00Z',
    createdAt: '2025-10-07T13:20:00Z',
    updateAt: '2025-10-07T13:20:00Z',
    views: 5432,
    status: 'published',
    slug: 'banco-para-anuncia-linha-credito-pequenos-empreendedores',
    isEmphasis: false,
  },
  {
    id: 14,
    title: 'Turismo no Pará movimenta R$ 800 milhões no terceiro trimestre',
    subtitle: 'COP 30 já aquece setor hoteleiro da capital',
    content:
      '<p>O setor de turismo paraense movimentou impressionantes R$ 800 milhões no terceiro trimestre de 2025, representando um crescimento de 45% em relação ao mesmo período do ano anterior. Os dados foram divulgados pela Secretaria de Estado de Turismo (Setur) e mostram que a expectativa para a COP 30, que será realizada em Belém em 2025, já está aquecendo significativamente o setor.</p>' +
      '<h3>Números do turismo</h3>' +
      '<p>O Pará recebeu entre julho e setembro de 2025:</p>' +
      '<ul><li><strong>1,8 milhão de turistas</strong> (sendo 220 mil estrangeiros)</li><li><strong>Taxa de ocupação hoteleira:</strong> 78% em Belém, 65% no interior</li><li><strong>Tempo médio de permanência:</strong> 4,2 dias</li><li><strong>Gasto médio por turista:</strong> R$ 1.850</li><li><strong>Geração de empregos:</strong> 8.500 novos postos de trabalho</li></ul>' +
      '<h3>Investimentos para a COP 30</h3>' +
      '<p>A expectativa para sediar a 30ª Conferência das Nações Unidas sobre Mudanças Climáticas impulsionou investimentos massivos em infraestrutura turística:</p>' +
      '<p><strong>Hotelaria:</strong></p>' +
      '<ul><li>15 novos hotéis inaugurados em Belém (total de 2.200 novos leitos)</li><li>Reformas em 40 hotéis existentes</li><li>Abertura de 3 hotéis internacionais de luxo (Hilton, Marriott e Radisson)</li><li>Investimento total de R$ 350 milhões no setor hoteleiro</li></ul>' +
      '<p><strong>Gastronomia:</strong></p>' +
      '<ul><li>120 novos restaurantes abertos nos últimos 6 meses</li><li>Qualificação de 2.500 profissionais em gastronomia regional</li><li>Roteiro gastronômico "Sabores da Amazônia" lançado</li></ul>' +
      '<p><strong>Infraestrutura:</strong></p>' +
      '<ul><li>Revitalização de áreas históricas (Cidade Velha, Complexo Ver-o-Peso)</li><li>Novo terminal de cruzeiros no porto de Belém</li><li>Ampliação do aeroporto internacional (capacidade para 12 milhões de passageiros/ano)</li><li>Implantação de sinalização turística bilíngue</li></ul>' +
      '<blockquote>"A COP 30 será um divisor de águas para o turismo paraense. Estamos nos preparando para receber cerca de 50 mil visitantes durante o evento e mostrar ao mundo as belezas e o potencial da Amazônia", afirma André Dias, secretário estadual de Turismo.</blockquote>' +
      '<h3>Destinos mais procurados</h3>' +
      '<p>No terceiro trimestre, os locais mais visitados foram:</p>' +
      '<ol><li><strong>Belém (capital):</strong> 780 mil visitantes - Atrativos: Centro histórico, Ver-o-Peso, Estação das Docas</li><li><strong>Alter do Chão (Santarém):</strong> 320 mil visitantes - "Caribe Amazônico"</li><li><strong>Ilha de Marajó:</strong> 180 mil visitantes - Praias e fazendas de búfalos</li><li><strong>Salinópolis:</strong> 290 mil visitantes - Praias e gastronomia</li><li><strong>Carajás:</strong> 95 mil visitantes - Turismo de negócios e aventura</li></ol>' +
      '<h3>Turismo sustentável</h3>' +
      '<p>Um dos destaques do setor tem sido o crescimento do turismo sustentável e comunitário:</p>' +
      '<ul><li>120 comunidades ribeirinhas capacitadas para receber turistas</li><li>Certificação de turismo responsável para 45 operadoras</li><li>Roteiros de ecoturismo cresceram 85%</li><li>Programa de compensação ambiental implementado</li></ul>' +
      '<p>A comunidade de Vila dos Cabanos, por exemplo, recebeu 8 mil turistas no trimestre, gerando renda de R$ 420 mil para os moradores locais através de hospedagem, passeios de barco e venda de artesanato.</p>' +
      '<h3>Turismo internacional</h3>' +
      '<p>Os turistas estrangeiros vieram principalmente de:</p>' +
      '<ol><li>Estados Unidos (28%)</li><li>Países da Europa (35%)</li><li>América Latina (22%)</li><li>Ásia (10%)</li><li>Outros (5%)</li></ol>' +
      '<p>O tempo médio de permanência dos turistas internacionais é de 6,5 dias, significativamente superior aos brasileiros (3,8 dias), e o gasto médio também é maior: R$ 3.200 por pessoa.</p>' +
      '<h3>Desafios e perspectivas</h3>' +
      '<p>Apesar do crescimento, o setor enfrenta desafios:</p>' +
      '<ul><li>Necessidade de mais profissionais qualificados em idiomas</li><li>Infraestrutura de transporte ainda limitada para alguns destinos</li><li>Sazonalidade (concentração em férias e finais de semana)</li></ul>' +
      '<p>Para 2026, as projeções são ainda mais otimistas:</p>' +
      '<ul><li>Meta de R$ 4 bilhões em movimentação anual</li><li>7 milhões de turistas esperados</li><li>15 mil novos empregos no setor</li><li>Consolidação como principal destino turístico da região Norte</li></ul>' +
      '<p><strong>Legado da COP 30:</strong> Segundo especialistas, mesmo após o evento, o Pará deve manter níveis elevados de turismo internacional, consolidando-se como referência em turismo sustentável na Amazônia. A visibilidade global gerada pelo evento é estimada em mais de R$ 2 bilhões em mídia espontânea.</p>',
    categoryId: [4],
    author: 'Patrícia Almeida',
    mediaNews: [
      {
        id: 14,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200',
          small: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400',
          medium: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
          superSmall: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200',
        },
        author: 'Patrícia Almeida',
        date: '2025-10-06T09:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-06T09:00:00Z',
    createdAt: '2025-10-06T09:00:00Z',
    updateAt: '2025-10-06T09:00:00Z',
    views: 9876,
    status: 'published',
    slug: 'turismo-para-movimenta-800-milhoes-terceiro-trimestre',
    isEmphasis: true,
  },

  // SAÚDE (id: 5)
  {
    id: 15,
    title: 'Hospital Oncológico de Belém inaugura centro de radioterapia',
    subtitle: 'Equipamento de última geração reduzirá fila de espera',
    content:
      '<p>O Hospital Oncológico Infantil Octávio Lobo inaugurou nesta quinta-feira um moderno Centro de Radioterapia com investimento de R$ 12 milhões. O novo setor conta com equipamentos de última geração e tem capacidade para realizar até 150 sessões de radioterapia por dia, o que deve reduzir significativamente a fila de espera para tratamento de câncer no estado.</p>' +
      '<h3>Equipamentos de ponta</h3>' +
      '<p>O centro recebeu tecnologia de ponta para tratamento oncológico:</p>' +
      '<ul><li><strong>Acelerador Linear Varian TrueBeam:</strong> Equipamento de última geração para radioterapia de alta precisão</li><li><strong>Sistema IGRT:</strong> Radioterapia guiada por imagem para maior precisão</li><li><strong>Tomógrafo dedicado:</strong> Para planejamento 3D dos tratamentos</li><li><strong>Sistema de imobilização customizada:</strong> Moldes personalizados para cada paciente</li><li><strong>Bunker com proteção radiológica total:</strong> Segurança máxima para pacientes e profissionais</li></ul>' +
      '<p>O acelerador linear é capaz de realizar técnicas avançadas como IMRT (radioterapia de intensidade modulada), VMAT (arcoterapia volumétrica) e SRS (radiocirurgia estereotáxica), permitindo tratamentos mais precisos e com menos efeitos colaterais.</p>' +
      '<blockquote>"Este equipamento é o mesmo utilizado nos melhores centros oncológicos do mundo. Agora, pacientes paraenses não precisam mais se deslocar para outros estados para ter acesso a tratamento de excelência", afirma Dr. Marcelo Santos, diretor técnico do hospital.</blockquote>' +
      '<h3>Impacto na fila de espera</h3>' +
      '<p>Atualmente, cerca de 850 pacientes aguardam por radioterapia no Pará. Com o novo centro:</p>' +
      '<ul><li>Capacidade aumenta de 50 para 150 atendimentos/dia (+200%)</li><li>Tempo médio de espera deve cair de 4 meses para 3 semanas</li><li>Atendimento de pacientes de todos os 144 municípios paraenses</li><li>Parceria com o SUS garante 100% das vagas para atendimento público</li></ul>' +
      '<p>A estimativa é que nos próximos 6 meses a fila seja zerada e o atendimento passe a ser programado conforme a necessidade médica de cada paciente, sem longas esperas.</p>' +
      '<h3>Equipe especializada</h3>' +
      '<p>Para operar o novo centro, foram contratados e capacitados:</p>' +
      '<ul><li>4 médicos radio-oncologistas</li><li>6 físicos médicos</li><li>12 técnicos em radioterapia</li><li>8 enfermeiros especializados</li><li>Equipe de apoio psicológico e nutricional</li></ul>' +
      '<p>Todos os profissionais passaram por treinamento de 3 meses nos Estados Unidos e no Hospital Sírio-Libanês (SP) para dominar as novas tecnologias.</p>' +
      '<h3>Tipos de câncer tratados</h3>' +
      '<p>O centro está preparado para tratar diversos tipos de câncer:</p>' +
      '<ul><li>Câncer de mama</li><li>Câncer de próstata</li><li>Tumores cerebrais</li><li>Câncer de pulmão</li><li>Câncer de colo de útero e outros ginecológicos</li><li>Tumores de cabeça e pescoço</li><li>Câncer infantil (leucemias, linfomas, tumores sólidos)</li></ul>' +
      '<h3>Histórias de esperança</h3>' +
      '<p>Maria José da Silva, 54 anos, foi uma das primeiras pacientes atendidas. Diagnosticada com câncer de mama, ela aguardava há 3 meses por radioterapia. <em>"Estava muito preocupada com a demora. Quando me ligaram dizendo que tinha vaga, chorei de alegria. O tratamento é moderno, rápido e os profissionais são muito atenciosos"</em>, relata emocionada.</p>' +
      '<p>João Pedro, 8 anos, diagnosticado com tumor cerebral, também começou o tratamento. Sua mãe, Ana Beatriz, conta: <em>"É muito difícil ver um filho doente. Mas saber que ele está recebendo o melhor tratamento possível, com equipamento de primeiro mundo, nos dá esperança e força para lutar"</em>.</p>' +
      '<h3>Investimentos futuros</h3>' +
      '<p>O hospital já planeja ampliar ainda mais a estrutura:</p>' +
      '<ul><li><strong>2026:</strong> Aquisição de segundo acelerador linear (investimento de R$ 8 milhões)</li><li><strong>2026:</strong> Implantação de serviço de medicina nuclear</li><li><strong>2027:</strong> Centro de pesquisas clínicas em oncologia</li><li><strong>2027:</strong> Unidade de cuidados paliativos</li></ul>' +
      '<h3>Parcerias e financiamento</h3>' +
      '<p>O investimento de R$ 12 milhões veio de múltiplas fontes:</p>' +
      '<ul><li>Governo do Estado: R$ 6 milhões</li><li>Ministério da Saúde: R$ 4 milhões</li><li>Doações de empresas privadas: R$ 1,5 milhão</li><li>Campanha "Um Real pela Vida" (doações populares): R$ 500 mil</li></ul>' +
      '<p>A secretária estadual de Saúde, Dra. Paula Mendes, destacou: <em>"Este é um exemplo de como parcerias entre governo, iniciativa privada e sociedade podem salvar vidas. O câncer é a segunda maior causa de morte no Pará, e estamos empenhados em oferecer o melhor tratamento possível à população"</em>.</p>' +
      '<h3>Como acessar o serviço</h3>' +
      '<p>Pacientes com indicação médica para radioterapia devem:</p>' +
      '<ol><li>Ter encaminhamento médico com diagnóstico</li><li>Procurar a Central de Regulação do SUS</li><li>Realizar consulta com radio-oncologista</li><li>Planejamento do tratamento (1-2 semanas)</li><li>Início das sessões</li></ol>' +
      '<p>Para mais informações: 0800-280-8280 ou através do site da Secretaria de Saúde.</p>',
    categoryId: [5],
    author: 'Dra. Beatriz Ferreira',
    mediaNews: [
      {
        id: 15,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200',
          small: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
          medium: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
          superSmall: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200',
        },
        author: 'Dra. Beatriz Ferreira',
        date: '2025-10-08T14:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-08T14:00:00Z',
    createdAt: '2025-10-08T14:00:00Z',
    updateAt: '2025-10-08T14:00:00Z',
    views: 6543,
    status: 'published',
    slug: 'hospital-oncologico-belem-inaugura-centro-radioterapia',
    isEmphasis: true,
  },
  {
    id: 16,
    title: 'Campanha de vacinação contra dengue começa na próxima semana',
    subtitle: 'Postos de saúde receberão 500 mil doses da vacina',
    content:
      '<p>A Secretaria Estadual de Saúde (Sespa) inicia na próxima segunda-feira, dia 14 de outubro, a maior campanha de vacinação contra a dengue já realizada no Pará. Serão disponibilizadas 500 mil doses da vacina Qdenga para imunização da população prioritária em todos os 144 municípios do estado.</p>' +
      '<h3>Público-alvo prioritário</h3>' +
      '<p>Nesta primeira fase, serão vacinados:</p>' +
      '<ul><li><strong>Crianças e adolescentes de 10 a 14 anos:</strong> Faixa etária com maior incidência de casos graves (250 mil doses)</li><li><strong>Profissionais de saúde:</strong> Expostos a maior risco ocupacional (80 mil doses)</li><li><strong>Moradores de áreas de alta incidência:</strong> Bairros e municípios com surtos recorrentes (120 mil doses)</li><li><strong>Pessoas com comorbidades:</strong> Diabetes, hipertensão e doenças renais (50 mil doses)</li></ul>' +
      '<p>A vacina será aplicada em esquema de 2 doses, com intervalo de 3 meses entre elas.</p>' +
      '<h3>Números da dengue no Pará</h3>' +
      '<p>Em 2025, até setembro, o Pará registrou:</p>' +
      '<ul><li>68.432 casos confirmados de dengue</li><li>142 casos graves</li><li>18 óbitos</li><li>Taxa de incidência: 782 casos por 100 mil habitantes</li></ul>' +
      '<p>Os municípios com maior número de casos foram:</p>' +
      '<ol><li>Belém: 22.450 casos</li><li>Ananindeua: 8.920 casos</li><li>Santarém: 5.670 casos</li><li>Marabá: 4.230 casos</li><li>Castanhal: 3.180 casos</li></ol>' +
      '<blockquote>"A dengue é um grave problema de saúde pública no Pará. Com esta campanha de vacinação, esperamos reduzir significativamente os casos graves e óbitos, especialmente entre crianças e adolescentes", afirma Dr. Rômulo Rodovalho, secretário estadual de Saúde.</blockquote>' +
      '<h3>Estrutura da campanha</h3>' +
      '<p>Para garantir ampla cobertura vacinal:</p>' +
      '<ul><li><strong>1.200 postos de vacinação</strong> em todo o estado</li><li><strong>Horário estendido:</strong> Das 8h às 20h em postos de grande movimento</li><li><strong>Sábados de vacinação:</strong> Atendimento em finais de semana</li><li><strong>Equipes volantes:</strong> Vacinação em escolas e comunidades distantes</li><li><strong>Transporte fluvial:</strong> Barcos-hospital para comunidades ribeirinhas</li></ul>' +
      '<p>A campanha contará com 3.500 profissionais de saúde capacitados, incluindo enfermeiros, técnicos de enfermagem e agentes comunitários.</p>' +
      '<h3>A vacina Qdenga</h3>' +
      '<p>A vacina utilizada na campanha é produzida pelo laboratório Takeda e aprovada pela Anvisa em 2023:</p>' +
      '<ul><li>Protege contra os 4 sorotipos do vírus da dengue (DENV-1, 2, 3 e 4)</li><li>Eficácia de 80,2% na prevenção de dengue sintomática</li><li>Eficácia de 90,4% na prevenção de hospitalização</li><li>Pode ser aplicada mesmo em quem nunca teve dengue</li><li>Efeitos colaterais leves: dor no local, febre baixa (em menos de 10% dos casos)</li></ul>' +
      '<h3>Documentos necessários</h3>' +
      '<p>Para receber a vacina, é necessário apresentar:</p>' +
      '<ul><li>Documento de identidade com foto (RG, CNH ou certidão de nascimento para menores)</li><li>Cartão do SUS ou CPF</li><li>Carteira de vacinação (se tiver)</li><li>Comprovante de residência (para vacinação em áreas prioritárias)</li></ul>' +
      '<h3>Contraindicações</h3>' +
      '<p>Não devem tomar a vacina:</p>' +
      '<ul><li>Gestantes e lactantes</li><li>Pessoas com imunodeficiência grave (HIV com CD4 baixo, em quimioterapia, etc.)</li><li>Quem teve reação alérgica grave à primeira dose</li><li>Pessoas com febre no momento da vacinação (devem aguardar melhora)</li></ul>' +
      '<h3>Ações integradas de combate</h3>' +
      '<p>Além da vacinação, o estado mantém ações de prevenção:</p>' +
      '<ul><li><strong>Eliminação de criadouros:</strong> Mutirões de limpeza em 500 bairros</li><li><strong>Fumacê:</strong> Nebulização em áreas de surto</li><li><strong>Agentes de endemias:</strong> 2.800 profissionais em ação casa a casa</li><li><strong>Educação em saúde:</strong> Campanhas nas escolas e mídias</li><li><strong>Monitoramento:</strong> Sistema de vigilância epidemiológica reforçado</li></ul>' +
      '<blockquote>"A vacina é muito importante, mas não substitui as medidas de prevenção. Todos precisam eliminar água parada em casa, usar repelente e procurar atendimento médico ao primeiro sinal de dengue", alerta a enfermeira epidemiologista Dra. Carmem Lúcia.</blockquote>' +
      '<h3>Sintomas e quando procurar ajuda</h3>' +
      '<p>Fique atento aos sinais de dengue:</p>' +
      '<p><strong>Sintomas comuns:</strong></p>' +
      '<ul><li>Febre alta (39-40°C)</li><li>Dor de cabeça intensa</li><li>Dor atrás dos olhos</li><li>Dores musculares e nas articulações</li><li>Manchas vermelhas na pele</li></ul>' +
      '<p><strong>Sinais de alarme (procure UPA/hospital imediatamente):</strong></p>' +
      '<ul><li>Dor abdominal intensa</li><li>Vômitos persistentes</li><li>Sangramento de mucosas</li><li>Sonolência ou irritabilidade</li><li>Diminuição da urina</li></ul>' +
      '<h3>Metas da campanha</h3>' +
      '<p>A Sespa estabeleceu as seguintes metas:</p>' +
      '<ul><li>Vacinar 85% do público-alvo prioritário (425 mil pessoas) até dezembro/2025</li><li>Reduzir em 40% os casos graves de dengue em 2026</li><li>Diminuir em 60% as hospitalizações entre crianças e adolescentes</li><li>Zero óbitos por dengue em menores de 18 anos em 2026</li></ul>' +
      '<p>Para mais informações sobre locais e horários de vacinação, acesse: www.saude.pa.gov.br/dengue ou ligue para o Disque Saúde: 136.</p>',
    categoryId: [5],
    author: 'Dr. Carlos Alberto',
    mediaNews: [
      {
        id: 16,
        emphasis: false,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=1200',
          small: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400',
          medium: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800',
          superSmall: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=200',
        },
        author: 'Dr. Carlos Alberto',
        date: '2025-10-07T10:30:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-07T10:30:00Z',
    createdAt: '2025-10-07T10:30:00Z',
    updateAt: '2025-10-07T10:30:00Z',
    views: 8765,
    status: 'published',
    slug: 'campanha-vacinacao-dengue-comeca-proxima-semana',
    isEmphasis: false,
  },

  // CULTURA (id: 6)
  {
    id: 17,
    title: 'Festival de Cinema da Amazônia recebe inscrições até novembro',
    subtitle: 'Evento premiará produções regionais e nacionais',
    content:
      '<p>Está oficialmente aberto o período de inscrições para a 12ª edição do Festival de Cinema da Amazônia (FICAM), um dos mais importantes eventos cinematográficos da região Norte. Realizadores de todo o Brasil e do mundo podem submeter seus filmes até o dia 30 de novembro através da plataforma oficial www.ficamazonia.com.br.</p>' +
      '<h3>Categorias e premiações</h3>' +
      '<p>O festival oferece diferentes categorias de competição:</p>' +
      '<p><strong>Competitiva Nacional:</strong></p>' +
      '<ul><li>Melhor Longa-metragem - R$ 50.000</li><li>Melhor Curta-metragem - R$ 25.000</li><li>Melhor Documentário - R$ 30.000</li><li>Melhor Direção - R$ 15.000</li><li>Melhor Roteiro - R$ 10.000</li></ul>' +
      '<p><strong>Competitiva Regional (Amazônia Legal):</strong></p>' +
      '<ul><li>Melhor Filme Amazônico - R$ 40.000</li><li>Revelação Regional - R$ 20.000</li><li>Melhor Filme sobre Povos Originários - R$ 25.000</li></ul>' +
      '<p><strong>Mostra Especial:</strong></p>' +
      '<ul><li>Filmes universitários</li><li>Animações</li><li>Produções indígenas</li><li>Vídeos experimentais</li></ul>' +
      '<blockquote>"O FICAM é uma vitrine fundamental para cineastas que abordam temáticas amazônicas. Queremos dar visibilidade às histórias da nossa região, contadas pela nossa gente, com nosso olhar", afirma Cristina Barbosa, diretora do festival.</blockquote>' +
      '<h3>Critérios de seleção</h3>' +
      '<p>Os filmes serão avaliados por uma curadoria especializada composta por críticos, acadêmicos e realizadores. Os critérios incluem:</p>' +
      '<ul><li>Qualidade técnica e artística</li><li>Relevância temática para a Amazônia</li><li>Originalidade narrativa</li><li>Impacto social e cultural</li><li>Representatividade de povos e comunidades tradicionais</li></ul>' +
      '<p>Para a categoria regional, é obrigatório que o diretor seja nascido ou residente há pelo menos 5 anos em estados da Amazônia Legal.</p>' +
      '<h3>Programação do evento</h3>' +
      '<p>O FICAM 2025 acontecerá de 5 a 12 de dezembro em Belém, com atividades em diversos espaços:</p>' +
      '<ul><li><strong>Teatro da Paz:</strong> Cerimônias de abertura e encerramento</li><li><strong>Estação das Docas:</strong> Exibições ao ar livre</li><li><strong>Cine Olympia:</strong> Mostra competitiva</li><li><strong>UFPA:</strong> Seminários e debates</li><li><strong>Mangal das Garças:</strong> Exibições infantis</li></ul>' +
      '<p>Além das exibições, o festival oferecerá:</p>' +
      '<ul><li>Masterclasses com cineastas renomados</li><li>Workshops de roteiro, fotografia e montagem</li><li>Rodadas de negócios para produtores</li><li>Feira de equipamentos cinematográficos</li><li>Sessões comentadas</li></ul>' +
      '<h3>Edições anteriores</h3>' +
      '<p>Em 2024, o festival recebeu 438 inscrições de 23 estados brasileiros e 12 países. Foram selecionados 87 filmes, que atraíram um público de 35 mil pessoas durante uma semana de programação.</p>' +
      '<p>O grande vencedor foi o longa "Águas Profundas", do diretor paraense Marcos Colares, que retrata a vida de pescadores no Marajó. O filme posteriormente foi selecionado para festivais internacionais em Rotterdam e Berlim.</p>' +
      '<h3>Impacto na economia criativa</h3>' +
      '<p>O festival movimenta a economia local:</p>' +
      '<ul><li>Ocupação hoteleira: 85% durante o evento</li><li>Geração de 300 empregos temporários</li><li>Movimentação estimada de R$ 2,5 milhões</li><li>Visibilidade internacional para o Pará</li></ul>' +
      '<h3>Júri internacional</h3>' +
      '<p>A comissão julgadora de 2025 contará com nomes importantes do cinema:</p>' +
      '<ul><li><strong>Walter Salles</strong> - Diretor brasileiro (Central do Brasil, Diários de Motocicleta)</li><li><strong>Karim Aïnouz</strong> - Cineasta cearense (Praia do Futuro, A Vida Invisível)</li><li><strong>Petra Costa</strong> - Documentarista (Democracia em Vertigem)</li><li><strong>Denis Villeneuve</strong> - Diretor canadense (Duna, Blade Runner 2049)</li><li><strong>Céline Sciamma</strong> - Diretora francesa (Retrato de uma Jovem em Chamas)</li></ul>' +
      '<h3>Como inscrever</h3>' +
      '<p>O processo de inscrição é simples:</p>' +
      '<ol><li>Acessar www.ficamazonia.com.br</li><li>Criar conta na plataforma</li><li>Preencher ficha técnica completa do filme</li><li>Fazer upload do filme (formatos aceitos: MP4, MOV, AVI)</li><li>Pagar taxa de inscrição (R$ 80 para brasileiros, US$ 30 para estrangeiros)</li></ol>' +
      '<p><strong>Isenção de taxa:</strong> Realizadores indígenas, estudantes de escolas públicas e moradores de comunidades tradicionais têm isenção total mediante comprovação.</p>' +
      '<h3>Ações de formação</h3>' +
      '<p>Paralelamente ao festival, acontecerá a "Semana do Audiovisual Amazônico" com:</p>' +
      '<ul><li>Oficinas gratuitas para 500 jovens de periferias</li><li>Curso de roteiro com roteiristas de Hollywood</li><li>Workshop de produção com celular</li><li>Mentoria para projetos em desenvolvimento</li></ul>' +
      '<p>As inscrições para as oficinas abrem em 15 de outubro e as vagas são limitadas.</p>' +
      '<p>Para mais informações: contato@ficamazonia.com.br ou @ficamazonia nas redes sociais.</p>',
    categoryId: [6],
    author: 'Cristina Barbosa',
    mediaNews: [
      {
        id: 17,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200',
          small: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
          medium: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
          superSmall: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200',
        },
        author: 'Cristina Barbosa',
        date: '2025-10-08T12:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-08T12:00:00Z',
    createdAt: '2025-10-08T12:00:00Z',
    updateAt: '2025-10-08T12:00:00Z',
    views: 4321,
    status: 'published',
    slug: 'festival-cinema-amazonia-recebe-inscricoes-ate-novembro',
    isEmphasis: true,
  },
  {
    id: 18,
    title: 'Círio de Nazaré 2025: mais de 2 milhões de fiéis esperados',
    subtitle: 'Maior festa religiosa do Norte se aproxima',
    content:
      '<p>A Diretoria da Festa de Nazaré (DFN) divulgou nesta terça-feira os preparativos finais para o Círio 2025, a maior manifestação religiosa católica do Brasil e uma das maiores procissões do mundo. A expectativa é que mais de 2 milhões de fiéis participem da romaria principal, que acontece no segundo domingo de outubro, dia 12, em Belém.</p>' +
      '<h3>Programação do Círio 2025</h3>' +
      '<p>O Círio de Nazaré não é apenas um dia, mas um ciclo de celebrações que dura todo o mês de outubro. Em 2025, serão 14 romarias e procissões:</p>' +
      '<p><strong>Principais romarias:</strong></p>' +
      '<ul><li><strong>Romaria Rodoviária (5 de outubro):</strong> Saída de Ananindeua até a Basílica</li><li><strong>Trasladação (11 de outubro - sábado à noite):</strong> Imagem sai da Catedral e vai até o Colégio Gentil</li><li><strong>Círio (12 de outubro - domingo):</strong> Procissão principal, Catedral até Basílica (3,6 km)</li><li><strong>Recírio (12 de outubro - noite de domingo):</strong> Retorno à Catedral</li><li><strong>Círio Fluvial (primeiro domingo):</strong> Procissão nos rios com centenas de embarcações</li></ul>' +
      '<p>Além destas, acontecem romarias específicas para: crianças, motociclistas, ciclistas, rodoviários, trabalhadores, pessoas com deficiência, jovens, irmandades, e romaria dos Carros.</p>' +
      '<h3>Estrutura e segurança</h3>' +
      '<p>Para garantir a segurança e o conforto dos romeiros, a DFN em parceria com órgãos públicos montou uma megaestrutura:</p>' +
      '<p><strong>Segurança:</strong></p>' +
      '<ul><li>8.500 policiais (militares, civis e federais)</li><li>2.000 agentes da Guarda Municipal</li><li>500 câmeras de monitoramento ao longo do percurso</li><li>Drones para monitoramento aéreo</li><li>Bloqueio de celular para evitar uso de drones não autorizados</li></ul>' +
      '<p><strong>Saúde:</strong></p>' +
      '<ul><li>25 ambulâncias ao longo do percurso</li><li>3 hospitais de campanha</li><li>150 médicos, 300 enfermeiros e 200 socorristas</li><li>2 helicópteros para remoção de emergências</li></ul>' +
      '<p><strong>Infraestrutura:</strong></p>' +
      '<ul><li>120 banheiros químicos</li><li>45 pontos de hidratação com água gratuita</li><li>Arquibancadas para 50 mil pessoas</li><li>Telões gigantes para transmissão ao vivo</li><li>Pontos de apoio com guarda-volumes</li></ul>' +
      '<blockquote>"O Círio é muito mais que fé, é cultura, é tradição, é identidade do povo paraense. Trabalhamos o ano todo para que todos possam viver esta experiência com segurança e devoção", declara Antônio Salame, coordenador da Diretoria da Festa.</blockquote>' +
      '<h3>Significado e história</h3>' +
      '<p>O Círio de Nazaré acontece há 230 anos, desde 1793. A festa celebra Nossa Senhora de Nazaré, padroeira do Pará. Segundo a tradição, em 1700, o caboclo Plácido José de Souza encontrou a imagem da santa às margens do igarapé Murucutu.</p>' +
      '<p>O nome "Círio" vem de círculo de cera, referência às velas que os fiéis levam em promessa. A corda, símbolo máximo do Círio, tem 400 metros de comprimento e simboliza a união entre o povo e Nossa Senhora.</p>' +
      '<h3>Impacto econômico e turístico</h3>' +
      '<p>O Círio movimenta intensamente a economia paraense:</p>' +
      '<ul><li><strong>Turismo:</strong> 400 mil turistas esperados de outros estados e países</li><li><strong>Hotelaria:</strong> 100% de ocupação em Belém e região metropolitana</li><li><strong>Gastronomia:</strong> Consumo de 15 mil patos, pratos típicos da festa</li><li><strong>Comércio:</strong> Vendas aumentam 200% em relação a meses normais</li><li><strong>Movimentação financeira:</strong> Estimativa de R$ 450 milhões durante o mês</li></ul>' +
      '<p>O mercado de artigos religiosos também se aquece: são vendidas cerca de 3 milhões de velas, 500 mil terços e incontáveis imagens, camisetas e brindes.</p>' +
      '<h3>Gastronomia círiana</h3>' +
      '<p>A culinária é parte fundamental da celebração. Os pratos típicos são:</p>' +
      '<ul><li><strong>Pato no tucupi:</strong> Prato tradicional servido no almoço do Círio</li><li><strong>Maniçoba:</strong> Prato de origem indígena, cozido por uma semana</li><li><strong>Tacacá:</strong> Iguaria vendida nas barraquinhas</li><li><strong>Caruru:</strong> Acompanhamento tradicional</li></ul>' +
      '<p>É tradição que famílias se reúnam para o "almoço do Círio" logo após a procissão, fortalecendo os laços familiares e comunitários.</p>' +
      '<h3>Manifestações culturais</h3>' +
      '<p>O Círio também é palco para manifestações culturais:</p>' +
      '<ul><li><strong>Auto do Círio:</strong> Apresentação teatral que conta a história da festa</li><li><strong>Arraial de Nazaré:</strong> Parque de diversões com comidas típicas e shows</li><li><strong>Festivais musicais:</strong> Apresentações de artistas paraenses</li><li><strong>Exposições de arte sacra:</strong> No Museu de Arte Sacra</li></ul>' +
      '<h3>Sustentabilidade</h3>' +
      '<p>Pela primeira vez, o Círio 2025 terá um plano de sustentabilidade completo:</p>' +
      '<ul><li>Copos e pratos biodegradáveis em todas as barracas</li><li>1.200 lixeiras para coleta seletiva</li><li>Equipes de limpeza atuando 24h</li><li>Campanhas de conscientização ambiental</li><li>Compensação de carbono com plantio de 10 mil árvores</li></ul>' +
      '<h3>Transmissão</h3>' +
      '<p>Para quem não puder acompanhar presencialmente:</p>' +
      '<ul><li>Transmissão ao vivo pela TV Nazaré</li><li>Cobertura de emissoras locais e nacionais</li><li>Streaming pelo YouTube e redes sociais</li><li>Aplicativo oficial com mapa, horários e informações em tempo real</li></ul>' +
      '<h3>Recomendações aos romeiros</h3>' +
      '<p>A DFN recomenda:</p>' +
      '<ul><li>Usar roupas leves e confortáveis</li><li>Levar água e protetor solar</li><li>Evitar levar crianças de colo devido à grande aglomeração</li><li>Chegar cedo para garantir lugar nas arquibancadas</li><li>Usar calçados adequados para longas caminhadas</li><li>Manter documento de identificação sempre à mão</li></ul>' +
      '<p><strong>Patrimônio Cultural:</strong> Em 2004, o Círio de Nazaré foi reconhecido como Patrimônio Cultural Brasileiro pelo IPHAN. Em 2013, recebeu o título de Patrimônio Cultural Imaterial da Humanidade pela UNESCO, consolidando sua importância mundial.</p>',
    categoryId: [6],
    author: 'Padre José Maria',
    mediaNews: [
      {
        id: 18,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200',
          small: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400',
          medium: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800',
          superSmall: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=200',
        },
        author: 'Padre José Maria',
        date: '2025-10-07T07:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-07T07:00:00Z',
    createdAt: '2025-10-07T07:00:00Z',
    updateAt: '2025-10-07T07:00:00Z',
    views: 15432,
    status: 'published',
    slug: 'cirio-nazare-2025-mais-2-milhoes-fieis-esperados',
    isEmphasis: true,
  },
  {
    id: 19,
    title: 'Museu Paraense Emílio Goeldi abre exposição sobre povos indígenas',
    subtitle: 'Mostra reúne mais de 300 peças e artefatos históricos',
    content:
      '<p>O Museu Paraense Emílio Goeldi inaugurou nesta sexta-feira a exposição permanente "Raízes da Floresta: Povos Originários da Amazônia", um ambicioso projeto que reúne mais de 300 peças, artefatos, fotografias e documentos históricos que contam a história milenar e a rica cultura dos povos indígenas amazônicos.</p>' +
      '<h3>A exposição</h3>' +
      '<p>Dividida em seis núcleos temáticos, a mostra ocupa 800m² do museu e foi pensada em colaboração com representantes de 15 povos indígenas:</p>' +
      '<p><strong>1. Origens e Cosmologia</strong></p>' +
      '<ul><li>Mitos de criação de diferentes povos</li><li>Instrumentos musicais sagrados</li><li>Pinturas corporais e seus significados</li><li>Vídeos com narrativas de anciãos indígenas</li></ul>' +
      '<p><strong>2. Vida Cotidiana</strong></p>' +
      '<ul><li>Utensílios domésticos (cerâmicas, cestos, cuias)</li><li>Ferramentas de caça e pesca</li><li>Redes e teares</li><li>Recriação de uma maloca tradicional</li></ul>' +
      '<p><strong>3. Arte e Estética</strong></p>' +
      '<ul><li>Plumária (arte com penas de aves)</li><li>Adornos corporais (colares, brincos, pulseiras)</li><li>Máscaras ritualísticas</li><li>Pintura em tecidos e cerâmica</li></ul>' +
      '<p><strong>4. Conhecimentos Tradicionais</strong></p>' +
      '<ul><li>Plantas medicinais e seus usos</li><li>Técnicas de agricultura sustentável</li><li>Calendários agrícolas indígenas</li><li>Sistemas de manejo florestal</li></ul>' +
      '<p><strong>5. Resistência e Luta</strong></p>' +
      '<ul><li>Documentos históricos sobre contato com não-indígenas</li><li>Fotografias de lideranças indígenas</li><li>Cronologia das demarcações de terras</li><li>Depoimentos sobre direitos conquistados</li></ul>' +
      '<p><strong>6. Presente e Futuro</strong></p>' +
      '<ul><li>Arte contemporânea indígena</li><li>Jovens lideranças e suas lutas</li><li>Projetos de sustentabilidade em terras indígenas</li><li>Tecnologia e tradição: uso de ferramentas modernas</li></ul>' +
      '<blockquote>"Esta exposição não é sobre os índios, é com os índios. Cada objeto foi cuidadosamente selecionado por representantes das comunidades, que também participaram da curadoria e da museografia. Queríamos que as vozes indígenas fossem protagonistas", explica Ana Vilacy Galúcio, diretora do museu.</blockquote>' +
      '<h3>Destaques da coleção</h3>' +
      '<p>Entre as peças mais impressionantes estão:</p>' +
      '<ul><li><strong>Cocar Kayapó do século XIX:</strong> Feito com penas de arara vermelha e tucano, usado em rituais de passagem</li><li><strong>Cerâmica Marajoara (800 d.C.):</strong> Urna funerária ricamente decorada com motivos geométricos</li><li><strong>Zarabatana Matis:</strong> Instrumento de caça de 3 metros de comprimento</li><li><strong>Banco ritual Kaxinawá:</strong> Esculpido em madeira maciça representando uma onça</li><li><strong>Manto Tupinambá (século XVI):</strong> Único exemplar existente no Brasil</li></ul>' +
      '<h3>Participação indígena</h3>' +
      '<p>A exposição contou com a participação ativa de representantes de diversos povos:</p>' +
      '<ul><li>Kayapó</li><li>Yanomami</li><li>Munduruku</li><li>Asurini</li><li>Kaxinawá</li><li>Matis</li><li>Karajá</li><li>Tembé</li><li>Wai Wai</li><li>Entre outros</li></ul>' +
      '<p>Durante a inauguração, lideranças indígenas realizaram cantos tradicionais e uma cerimônia de bênção do espaço. <em>"Ver nossos objetos sagrados respeitados e nossa história bem contada nos enche de orgulho. Este museu ajuda a combater preconceitos e mostrar a riqueza da cultura indígena"</em>, declarou Raoni Metuktire, líder Kayapó presente no evento.</p>' +
      '<h3>Tecnologia e interatividade</h3>' +
      '<p>A exposição incorpora recursos modernos:</p>' +
      '<ul><li><strong>Realidade aumentada:</strong> Visitantes podem ver objetos em 3D através de tablets</li><li><strong>Totens interativos:</strong> Vídeos e áudios explicativos em português, inglês e 5 línguas indígenas</li><li><strong>Projeções:</strong> Imagens de paisagens amazônicas e aldeias</li><li><strong>Audioguias:</strong> Narrados por indígenas em suas línguas originais com tradução</li><li><strong>QR Codes:</strong> Acesso a conteúdo complementar online</li></ul>' +
      '<h3>Programação educativa</h3>' +
      '<p>O museu oferecerá atividades complementares:</p>' +
      '<ul><li><strong>Visitas guiadas:</strong> Com educadores indígenas e não-indígenas</li><li><strong>Oficinas:</strong> Pintura corporal, cestaria, culinária indígena</li><li><strong>Palestras mensais:</strong> Com lideranças, pesquisadores e ativistas</li><li><strong>Sessões de cinema:</strong> Documentários sobre povos indígenas</li><li><strong>Contação de histórias:</strong> Mitos e lendas narrados por anciãos</li></ul>' +
      '<p>Escolas públicas terão entrada gratuita mediante agendamento prévio, com capacidade para receber 200 estudantes por dia.</p>' +
      '<h3>Pesquisa e documentação</h3>' +
      '<p>Paralelamente à exposição, o museu lançou um projeto de documentação:</p>' +
      '<ul><li>Digitalização de 50 mil documentos sobre povos indígenas</li><li>Gravação de 200 horas de entrevistas com anciãos</li><li>Registro de 30 línguas indígenas ameaçadas</li><li>Catalogação de conhecimentos tradicionais (com autorização das comunidades)</li></ul>' +
      '<p>Todo material estará disponível em acesso aberto para pesquisadores e comunidades indígenas.</p>' +
      '<h3>Curadoria colaborativa</h3>' +
      '<p>O processo de montagem levou 3 anos e envolveu:</p>' +
      '<ul><li>12 viagens a aldeias para consultas</li><li>30 reuniões com lideranças indígenas</li><li>Participação de 8 antropólogos</li><li>Consultoria de institutos indígenas</li><li>Investimento total de R$ 3,5 milhões (recursos federais e internacionais)</li></ul>' +
      '<h3>Impacto social</h3>' +
      '<p>A exposição tem objetivos além do cultural:</p>' +
      '<ul><li>Combater estereótipos sobre povos indígenas</li><li>Valorizar conhecimentos tradicionais</li><li>Conscientizar sobre direitos indígenas</li><li>Fortalecer identidade de jovens indígenas urbanos</li><li>Promover diálogo intercultural</li></ul>' +
      '<blockquote>"Muitas pessoas acham que índio só existe em livro de história ou vivendo isolado na floresta. Esta exposição mostra que os povos indígenas são contemporâneos, com culturas vivas e dinâmicas, que contribuem imensamente para a sociedade brasileira", afirma o antropólogo Dr. Eduardo Neves, consultor do projeto.</blockquote>' +
      '<h3>Informações para visitação</h3>' +
      '<p><strong>Horários:</strong> Terça a domingo, 9h às 17h<br><strong>Ingressos:</strong> R$ 10 (inteira) | R$ 5 (meia) | Gratuito às quartas-feiras<br><strong>Local:</strong> Museu Paraense Emílio Goeldi - Av. Magalhães Barata, 376 - São Brás<br><strong>Agendamento escolas:</strong> (91) 3219-3369 | educativo@museu-goeldi.br</p>' +
      '<p>A exposição é permanente e faz parte das comemorações dos 156 anos do Museu Goeldi, uma das mais antigas instituições científicas do Brasil.</p>',
    categoryId: [6, 7], // Cultura e Educação
    author: 'Alessandra Cunha',
    mediaNews: [
      {
        id: 19,
        emphasis: false,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1200',
          small: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400',
          medium: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800',
          superSmall: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=200',
        },
        author: 'Alessandra Cunha',
        date: '2025-10-06T16:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-06T16:00:00Z',
    createdAt: '2025-10-06T16:00:00Z',
    updateAt: '2025-10-06T16:00:00Z',
    views: 3987,
    status: 'published',
    slug: 'museu-goeldi-abre-exposicao-povos-indigenas',
    isEmphasis: false,
  },

  // EDUCAÇÃO (id: 7)
  {
    id: 20,
    title: 'Enem 2025: Pará registra aumento de 20% nas inscrições',
    subtitle: 'Estado tem 180 mil candidatos inscritos para o exame',
    content:
      '<p>O Pará registrou um crescimento expressivo de 20% no número de inscrições para o Exame Nacional do Ensino Médio (Enem) 2025 em comparação ao ano anterior. Ao todo, 180 mil estudantes paraenses estão inscritos para realizar as provas nos dias 9 e 16 de novembro, segundo dados divulgados pelo Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (Inep).</p>' +
      '<h3>Números das inscrições</h3>' +
      '<p>A distribuição dos candidatos no Pará:</p>' +
      '<ul><li><strong>Belém e Região Metropolitana:</strong> 95 mil inscritos (52,8%)</li><li><strong>Santarém e região:</strong> 22 mil inscritos (12,2%)</li><li><strong>Marabá e região:</strong> 18 mil inscritos (10%)</li><li><strong>Demais municípios:</strong> 45 mil inscritos (25%)</li></ul>' +
      '<p>Do total de inscritos:</p>' +
      '<ul><li>68% são estudantes concluintes do ensino médio em 2025</li><li>22% já concluíram em anos anteriores</li><li>10% são egressos de EJA (Educação de Jovens e Adultos)</li><li>55% são mulheres e 45% homens</li><li>32% se autodeclaram pardos, 28% brancos, 25% pretos, 12% indígenas e 3% amarelos</li></ul>' +
      '<blockquote>"Este aumento de 20% é resultado de um trabalho intenso de mobilização nas escolas e de políticas de incentivo à educação. Queremos que cada vez mais jovens paraenses tenham acesso ao ensino superior", afirma Rossieli Soares, secretário estadual de Educação.</blockquote>' +
      '<h3>Locais de prova</h3>' +
      '<p>As provas serão aplicadas em 312 locais distribuídos em 85 municípios paraenses:</p>' +
      '<ul><li>Belém: 142 locais</li><li>Ananindeua: 38 locais</li><li>Santarém: 28 locais</li><li>Marabá: 24 locais</li><li>Castanhal: 18 locais</li><li>Outros 80 municípios: 62 locais</li></ul>' +
      '<p>Os cartões de confirmação com local de prova estarão disponíveis a partir de 28 de outubro no site do Inep (enem.inep.gov.br).</p>' +
      '<h3>Apoio do governo estadual</h3>' +
      '<p>Para facilitar o acesso dos estudantes às provas, o Governo do Pará implementou medidas de apoio:</p>' +
      '<p><strong>Transporte gratuito:</strong></p>' +
      '<ul><li>Ônibus extras em Belém e região metropolitana</li><li>Transporte fluvial gratuito para comunidades ribeirinhas</li><li>Vans e ônibus para zona rural em 45 municípios</li><li>Parcerias com prefeituras para transporte intermunicipal</li></ul>' +
      '<p><strong>Alimentação:</strong></p>' +
      '<ul><li>Distribuição de 50 mil kits lanche nos locais de prova</li><li>Água e biscoitos em todos os pontos de prova</li></ul>' +
      '<p><strong>Segurança:</strong></p>' +
      '<ul><li>Reforço policial em todos os locais de prova</li><li>Central de atendimento para emergências</li></ul>' +
      '<h3>Cronograma do Enem 2025</h3>' +
      '<p><strong>Primeiro dia - 9 de novembro (domingo):</strong></p>' +
      '<ul><li>Abertura dos portões: 12h</li><li>Fechamento dos portões: 13h (IMPRETERIVELMENTE)</li><li>Início das provas: 13h30</li><li>Término: 19h</li><li>Duração: 5h30</li><li>Provas: Redação, Linguagens e Ciências Humanas</li></ul>' +
      '<p><strong>Segundo dia - 16 de novembro (domingo):</strong></p>' +
      '<ul><li>Abertura dos portões: 12h</li><li>Fechamento dos portões: 13h (IMPRETERIVELMENTE)</li><li>Início das provas: 13h30</li><li>Término: 18h30</li><li>Duração: 5h</li><li>Provas: Matemática e Ciências da Natureza</li></ul>' +
      '<h3>Preparação dos candidatos</h3>' +
      '<p>A Secretaria de Educação disponibilizou recursos para auxiliar os estudantes:</p>' +
      '<ul><li><strong>Aulões preparatórios:</strong> 50 escolas estaduais oferecem revisões aos sábados</li><li><strong>Plataforma online:</strong> 5 mil videoaulas e simulados gratuitos</li><li><strong>Cursinho popular:</strong> 12 mil vagas em cursinhos gratuitos</li><li><strong>Material didático:</strong> Apostilas distribuídas em 300 escolas</li><li><strong>Aplicativo:</strong> App "Enem Pará" com questões e simulados</li></ul>' +
      '<p>Além disso, universidades paraenses como UFPA e UEPA abriram suas bibliotecas para estudo nos finais de semana, com capacidade para 3 mil estudantes.</p>' +
      '<h3>Isenção da taxa</h3>' +
      '<p>Neste ano, 142 mil candidatos paraenses (79% do total) conseguiram isenção da taxa de inscrição de R$ 85 por se enquadrarem nos critérios:</p>' +
      '<ul><li>Estar cursando a última série do ensino médio em escola pública</li><li>Ter renda familiar per capita de até 1,5 salário mínimo</li><li>Estar inscrito no CadÚnico</li><li>Ser bolsista integral em escola particular</li></ul>' +
      '<h3>Importância do Enem</h3>' +
      '<p>O Enem é a principal porta de entrada para o ensino superior no Brasil, sendo utilizado por:</p>' +
      '<ul><li><strong>Sisu:</strong> Vagas em universidades públicas</li><li><strong>ProUni:</strong> Bolsas em universidades privadas</li><li><strong>Fies:</strong> Financiamento estudantil</li><li><strong>Universidades portuguesas:</strong> Acesso sem vestibular</li></ul>' +
      '<p>Em 2024, o Pará conquistou 8.200 vagas no Sisu, 12.500 bolsas no ProUni e 4.800 financiamentos pelo Fies.</p>' +
      '<h3>Dicas para o dia da prova</h3>' +
      '<p>O Inep recomenda aos candidatos:</p>' +
      '<ul><li>Chegar com pelo menos 1 hora de antecedência</li><li>Levar documento oficial com foto (RG, CNH, passaporte)</li><li>Levar caneta esferográfica preta de material transparente</li><li>Não levar celular ou deixá-lo desligado no envelope fornecido</li><li>Usar roupas confortáveis</li><li>Alimentar-se bem antes da prova</li><li>Dormir adequadamente na véspera</li></ul>' +
      '<p><strong>Itens proibidos:</strong></p>' +
      '<ul><li>Relógio de qualquer tipo</li><li>Aparelhos eletrônicos</li><li>Bonés, gorros ou óculos escuros</li><li>Livros, anotações ou impressos</li></ul>' +
      '<h3>Resultados e gabaritos</h3>' +
      '<p>O calendário de divulgação:</p>' +
      '<ul><li><strong>20 de novembro:</strong> Divulgação dos gabaritos oficiais</li><li><strong>13 de janeiro de 2026:</strong> Divulgação das notas individuais</li><li><strong>Janeiro de 2026:</strong> Inscrições para o Sisu</li><li><strong>Fevereiro de 2026:</strong> Inscrições para ProUni e Fies</li></ul>' +
      '<h3>Histórias de superação</h3>' +
      '<p>Entre os inscritos deste ano, histórias inspiradoras:</p>' +
      '<p><strong>João Carlos, 42 anos</strong> - Pescador de Icoaraci, concluiu o ensino médio via EJA e vai fazer o Enem pela primeira vez sonhando em cursar Oceanografia. <em>"Nunca é tarde para estudar. Quero dar exemplo para meus filhos"</em>.</p>' +
      '<p><strong>Maria Vitória, 17 anos</strong> - Indígena da etnia Tembé, é a primeira de sua aldeia a tentar ingresso na universidade. <em>"Quero fazer Direito para ajudar meu povo a defender nossas terras"</em>.</p>' +
      '<p><strong>Paulo Henrique, 19 anos</strong> - Cadeirante, superou barreiras de acessibilidade e conquist ou atendimento especializado para fazer a prova. <em>"Meu sonho é Engenharia. Nada vai me impedir"</em>.</p>' +
      '<p>Para mais informações e suporte: Central de Atendimento Enem 0800-616-161 ou site enem.inep.gov.br</p>',
    categoryId: [7],
    author: 'Marcos Pinheiro',
    mediaNews: [
      {
        id: 20,
        emphasis: true,
        imgSize: {
          original: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200',
          small: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
          medium: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
          superSmall: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200',
        },
        author: 'Marcos Pinheiro',
        date: '2025-10-08T15:00:00Z',
      },
    ],
    videoNews: [],
    published: '2025-10-08T15:00:00Z',
    createdAt: '2025-10-08T15:00:00Z',
    updateAt: '2025-10-08T15:00:00Z',
    views: 11234,
    status: 'published',
    slug: 'enem-2025-para-registra-aumento-20-inscricoes',
    isEmphasis: true,
  },
];
