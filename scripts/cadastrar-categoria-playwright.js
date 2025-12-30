const { chromium } = require('playwright');

// Lista de categorias para cadastrar
const categorias = [
  {
    nome: 'Política',
    cor: '#D62828',
    descricao: 'Acompanhe decisões do governo, eleições, debates e tudo que molda o cenário político do país e do mundo.'
  },
  {
    nome: 'Economia',
    cor: '#4361EE',
    descricao: 'Notícias sobre mercado financeiro, inflação, empregos, investimentos e tendências econômicas.'
  },
  {
    nome: 'Mundo',
    cor: '#2A9D8F',
    descricao: 'Os acontecimentos mais relevantes do planeta: diplomacia, conflitos, cultura global e grandes eventos.'
  },
  {
    nome: 'Brasil / Nacional',
    cor: '#264653',
    descricao: 'Os fatos mais importantes do país: sociedade, governo, educação, segurança e cotidiano nacional.'
  },
  {
    nome: 'Tecnologia',
    cor: '#3A0CA3',
    descricao: 'Novidades sobre inovação, IA, startups, gadgets, softwares e o futuro digital.'
  },
  {
    nome: 'Esportes',
    cor: '#F77F00',
    descricao: 'Resultados, competições, atletas, análises e tudo que movimenta o universo esportivo.'
  },
  {
    nome: 'Entretenimento',
    cor: '#E63946',
    descricao: 'Filmes, séries, música, celebridades, cultura pop e os temas que mais repercutem no entretenimento.'
  },
  {
    nome: 'Cultura',
    cor: '#9D4EDD',
    descricao: 'Literatura, artes, teatro, patrimônio cultural e movimentos culturais em destaque.'
  },
  {
    nome: 'Saúde',
    cor: '#2EC4B6',
    descricao: 'Bem-estar, medicina, pesquisas, prevenção e temas que impactam a qualidade de vida.'
  },
  {
    nome: 'Ciência',
    cor: '#7209B7',
    descricao: 'Descobertas, espaço, biodiversidade e avanços da pesquisa científica mundial.'
  },
  {
    nome: 'Educação',
    cor: '#118AB2',
    descricao: 'Notícias sobre escolas, universidades, ensino, políticas educacionais e tendências na área.'
  },
  {
    nome: 'Negócios',
    cor: '#1D3557',
    descricao: 'Inovação corporativa, startups, gestão, investimentos e movimentações empresariais.'
  },
  {
    nome: 'Justiça / Polícia',
    cor: '#6C757D',
    descricao: 'Casos policiais, julgamentos, investigações e atualizações do sistema de justiça.'
  },
  {
    nome: 'Meio Ambiente',
    cor: '#2A9D00',
    descricao: 'Mudanças climáticas, preservação, energia limpa, sustentabilidade e biodiversidade.'
  },
  {
    nome: 'Agricultura / Agro',
    cor: '#8D99AE',
    descricao: 'Safras, tecnologias agrícolas, pecuária, mercado agro e tendências do campo.'
  },
  {
    nome: 'Carros / Motor',
    cor: '#495057',
    descricao: 'Lançamentos automotivos, testes, mobilidade, mercado de carros e inovações do setor.'
  }
];

async function fazerLogin(page) {
  console.log('🔐 Fazendo login...');
  await page.goto('http://localhost:4200/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  
  // Preencher email
  console.log('✍️ Preenchendo email...');
  await page.locator('#email').waitFor({ state: 'visible', timeout: 10000 });
  await page.fill('#email', 'master@email.com');
  
  // Preencher senha
  console.log('✍️ Preenchendo senha...');
  await page.fill('#password', '123456');
  
  // Clicar no botão de login
  console.log('🔑 Clicando no botão "Entrar"...');
  await page.locator('button.login-button').click();
  
  // Aguardar redirecionamento após login
  console.log('⏳ Aguardando redirecionamento após login...');
  await page.waitForURL('http://localhost:4200/**', { timeout: 10000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 });
}

async function cadastrarCategoria(page, categoria) {
  console.log(`\n📝 Cadastrando categoria: ${categoria.nome}`);
  
  // Navegar para a página de categoria (ou recarregar se já estiver lá)
  const currentUrl = page.url();
  if (!currentUrl.includes('/category')) {
    console.log('🌐 Navegando para http://localhost:4200/category...');
    await page.goto('http://localhost:4200/category', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } else {
    // Recarregar a página para garantir que o formulário está limpo
    await page.reload({ waitUntil: 'domcontentloaded' });
  }
  
  // Aguardar o formulário carregar
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  await page.locator('#name').waitFor({ state: 'visible', timeout: 10000 });
  
  // Limpar campos antes de preencher
  await page.fill('#name', '');
  await page.fill('#description', '');
  
  // Preencher nome
  console.log(`✍️ Preenchendo nome: ${categoria.nome}`);
  await page.fill('#name', categoria.nome);
  
  // Preencher descrição
  console.log(`✍️ Preenchendo descrição...`);
  await page.fill('#description', categoria.descricao);
  
  // Selecionar cor
  console.log(`🎨 Selecionando cor ${categoria.cor}...`);
  const colorPickerTrigger = page.locator('.color-picker-trigger').first();
  await colorPickerTrigger.click();
  
  // Aguardar o dropdown abrir
  await page.locator('.color-picker-dropdown').waitFor({ state: 'visible', timeout: 5000 });
  
  // Preencher o input HEX com a cor customizada
  const hexInput = page.locator('.hex-input').first();
  await hexInput.clear();
  
  // Digitar a cor caractere por caractere para garantir que o evento seja disparado
  await hexInput.type(categoria.cor, { delay: 100 });
  
  // Aguardar um pouco para o Angular processar o evento
  await page.waitForTimeout(1500);
  
  // Verificar se a cor foi aplicada
  const colorValue = await page.locator('.color-picker-trigger .color-value').first().textContent();
  console.log(`🎨 Cor selecionada: ${colorValue}`);
  
  // Fechar o dropdown de forma mais robusta
  const dropdown = page.locator('.color-picker-dropdown');
  const dropdownVisible = await dropdown.isVisible();
  
  if (dropdownVisible) {
    // Tentar fechar clicando no botão de fechar se existir
    const closeButton = page.locator('.color-picker-dropdown .close-btn');
    const closeButtonExists = await closeButton.count() > 0;
    
    if (closeButtonExists) {
      await closeButton.click();
      await page.waitForTimeout(500);
    } else {
      // Se não houver botão de fechar, pressionar Escape ou clicar fora
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
    
    // Verificar se o dropdown foi fechado, se não, tentar clicar fora
    const stillVisible = await dropdown.isVisible({ timeout: 1000 }).catch(() => false);
    if (stillVisible) {
      // Clicar em um elemento fora do dropdown para fechá-lo
      await page.locator('body').click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(500);
    }
  }
  
  // Garantir que o dropdown está fechado antes de continuar
  await dropdown.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {
    console.log('⚠️ Dropdown ainda visível, mas continuando...');
  });
  
  // Verificar se o botão está habilitado antes de clicar
  console.log('⏳ Verificando se o formulário está válido...');
  const createButton = page.locator('button[type="submit"]:has-text("Criar Categoria")');
  
  // Aguardar até que o botão esteja habilitado
  await createButton.waitFor({ state: 'visible', timeout: 10000 });
  
  // Aguardar até que o botão esteja habilitado (máximo 15 segundos)
  let isEnabled = false;
  for (let i = 0; i < 15; i++) {
    isEnabled = await createButton.isEnabled();
    if (isEnabled) break;
    await page.waitForTimeout(1000);
  }
  
  if (!isEnabled) {
    throw new Error(`O botão permanece desabilitado para a categoria "${categoria.nome}". Verifique se todos os campos estão preenchidos corretamente e se a cor não está em uso.`);
  }
  
  // Garantir que não há dropdown aberto antes de clicar
  const dropdownStillOpen = await page.locator('.color-picker-dropdown').isVisible({ timeout: 500 }).catch(() => false);
  if (dropdownStillOpen) {
    console.log('⚠️ Dropdown ainda aberto, fechando...');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  }
  
  // Scroll para garantir que o botão está visível
  await createButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  // Clicar no botão de criar (usando force se necessário)
  console.log(`✅ Clicando no botão "Criar Categoria" para ${categoria.nome}...`);
  try {
    await createButton.click({ timeout: 5000 });
  } catch (error) {
    // Se o clique normal falhar, tentar com force
    console.log('⚠️ Tentando clique forçado...');
    await createButton.click({ force: true, timeout: 5000 });
  }
  
  // Aguardar a categoria ser criada
  console.log('⏳ Aguardando confirmação...');
  await page.waitForTimeout(2000);
  
  // Verificar se houve erro (mensagem de erro na tela)
  const errorMessage = await page.locator('.error-message').first().isVisible({ timeout: 1000 }).catch(() => false);
  if (errorMessage) {
    const errorText = await page.locator('.error-message').first().textContent();
    throw new Error(`Erro ao cadastrar: ${errorText}`);
  }
  
  console.log(`🎉 Categoria "${categoria.nome}" cadastrada com sucesso!`);
}

async function cadastrarTodasCategorias() {
  const browser = await chromium.launch({ 
    headless: false, // Mostra o navegador
    slowMo: 300 // Adiciona delay entre ações para visualizar melhor
  });
  
  const context = await browser.newContext();
  let page = await context.newPage();

  try {
    // Fazer login uma vez
    await fazerLogin(page);
    
    // Cadastrar todas as categorias
    console.log(`\n🚀 Iniciando cadastro de ${categorias.length} categorias...\n`);
    
    let sucessos = 0;
    let falhas = 0;
    
    for (let i = 0; i < categorias.length; i++) {
      const categoria = categorias[i];
      try {
        await cadastrarCategoria(page, categoria);
        sucessos++;
        console.log(`✅ [${i + 1}/${categorias.length}] ${categoria.nome} - Concluído\n`);
      } catch (error) {
        falhas++;
        console.error(`❌ [${i + 1}/${categorias.length}] Erro ao cadastrar ${categoria.nome}:`, error.message);
        
        // Se a página foi fechada, tentar recriar a sessão
        if (error.message.includes('Target page, context or browser has been closed')) {
          console.log('⚠️ Página foi fechada. Tentando recriar sessão...');
          try {
            // Criar nova página
            const newPage = await context.newPage();
            page = newPage;
            await fazerLogin(page);
            await page.goto('http://localhost:4200/category', { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForLoadState('networkidle', { timeout: 15000 });
            console.log('✅ Sessão recriada com sucesso');
          } catch (reconnectError) {
            console.error('❌ Erro ao reconectar:', reconnectError.message);
            break; // Parar o loop se não conseguir reconectar
          }
        }
        
        // Continuar com a próxima categoria mesmo se houver erro
        continue;
      }
      
      // Pequeno delay entre categorias
      await page.waitForTimeout(1000);
    }
    
    console.log(`\n📊 Resumo:`);
    console.log(`✅ Sucessos: ${sucessos}`);
    console.log(`❌ Falhas: ${falhas}`);
    console.log(`📝 Total processado: ${sucessos + falhas}/${categorias.length}`);
    
    console.log('\n🎉 Processo de cadastro concluído!');
    console.log(`📊 Total: ${categorias.length} categorias processadas`);
    
    // Manter o navegador aberto por alguns segundos para visualizar
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await browser.close();
  }
}

// Executar
cadastrarTodasCategorias().catch(console.error);
