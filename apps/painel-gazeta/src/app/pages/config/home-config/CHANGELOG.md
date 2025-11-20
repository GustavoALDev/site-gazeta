# Changelog - Sistema de Configurações

## Refatoração: Botões de Salvar Independentes

### Alterações Principais

#### 1. **CategoryConfigComponent**
- ✅ **Botão "Salvar Destaques"** - Salva apenas configuração de Destaques
- ✅ **Botão "Salvar Top Gazeta"** - Salva apenas configuração do Top Gazeta
- ✅ **Carregamento automático** das configurações salvas ao iniciar
- ✅ **Loading states** independentes para cada botão
- ✅ **Try/Catch inteligente**: Tenta UPDATE primeiro, se falhar cria com POST

#### 2. **OrderSectionComponent**
- ✅ **Botão "Salvar Ordenação"** - Salva ordenação das seções
- ✅ **Carregamento automático** das seções salvas
- ✅ **Bulk update** - Salva todas as seções de uma vez
- ✅ **Criação automática** se seções não existirem

#### 3. **HomeConfigComponent**
- ✅ **Simplificado** - Apenas container
- ✅ **Removido formulário global** - Cada sub-componente gerencia seu próprio estado
- ✅ **Removidos botões gerais** - Substituídos por botões específicos

### Benefícios

1. ✨ **Salvamento Granular** - Cada configuração pode ser salva independentemente
2. ✨ **Melhor UX** - Usuário salva apenas o que alterou
3. ✨ **Feedback Visual** - Loading states e mensagens específicas
4. ✨ **Alinhamento com Backend** - Usa os endpoints corretos (`/destaques`, `/top-gazeta`, `/sections`)
5. ✨ **Sem Conflitos** - Alterações não interferem entre si

### Endpoints Utilizados

#### Destaques
```typescript
POST   /api/config/destaques      // Criar
GET    /api/config/destaques      // Obter
PATCH  /api/config/destaques      // Atualizar
```

#### Top Gazeta
```typescript
POST   /api/config/top-gazeta     // Criar
GET    /api/config/top-gazeta     // Obter
PATCH  /api/config/top-gazeta     // Atualizar
```

#### Seções
```typescript
POST   /api/config/sections       // Criar seção
GET    /api/config/sections       // Listar todas
PATCH  /api/config/sections       // Bulk update (todas de uma vez)
```

### Fluxo de Salvamento

#### 1. Destaques / Top Gazeta
```typescript
1. Validar (3 categorias ou modo aleatório)
2. Tentar PATCH (atualizar)
3. Se 404: Fazer POST (criar)
4. Exibir sucesso ou erro
```

#### 2. Seções
```typescript
1. Preparar array de seções
2. Tentar PATCH bulk (atualizar todas)
3. Se 404: Criar cada seção individualmente
4. Exibir sucesso ou erro
```

### Interface do Usuário

#### Botões com Loading States
```html
@if (loading()) {
  <span class="material-icons spinning">sync</span>
  Salvando...
} @else {
  <span class="material-icons">save</span>
  Salvar
}
```

#### Mensagens de Feedback
- ✅ **Sucesso**: Toast verde com mensagem específica
- ❌ **Erro**: Toast vermelho com mensagem de erro
- ⚠️ **Aviso**: Toast amarelo para validações

### Carregamento Automático

Ao abrir a página:
1. ✅ Carrega **Destaques** salvos
2. ✅ Carrega **Top Gazeta** salvos  
3. ✅ Carrega **Seções** salvas

Se não houver dados salvos, usa valores padrão.

### Próximos Passos

- [ ] Implementar configuração de **Redes Sociais** (similar)
- [ ] Adicionar botão de **Reset** individual em cada configuração
- [ ] Implementar **histórico de alterações**
- [ ] Adicionar **confirmação antes de salvar**

---

**Data**: 19/11/2025  
**Versão**: 2.0.0  
**Status**: ✅ Implementado e Testado

