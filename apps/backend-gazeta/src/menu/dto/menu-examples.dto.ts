import { ApiProperty } from '@nestjs/swagger';

/**
 * Exemplos de payloads para diferentes tipos de menu
 */
export class MenuExamplesDto {
  @ApiProperty({
    description: 'Exemplo de menu do tipo category',
    example: {
      order: 1,
      name: 'Tecnologia',
      type: 'category',
      slug: 'tecnologia'
    }
  })
  static readonly categoryExample = {
    order: 1,
    name: 'Tecnologia',
    type: 'category',
    slug: 'tecnologia'
  };

  @ApiProperty({
    description: 'Exemplo de menu do tipo internal',
    example: {
      order: 2,
      name: 'Sobre Nós',
      type: 'internal',
      routerLink: '/sobre'
    }
  })
  static readonly internalExample = {
    order: 2,
    name: 'Sobre Nós',
    type: 'internal',
    routerLink: '/sobre'
  };

  @ApiProperty({
    description: 'Exemplo de menu do tipo external',
    example: {
      order: 3,
      name: 'Parceiro',
      type: 'external',
      externalLink: 'https://www.parceiro.com.br'
    }
  })
  static readonly externalExample = {
    order: 3,
    name: 'Parceiro',
    type: 'external',
    externalLink: 'https://www.parceiro.com.br'
  };

  @ApiProperty({
    description: 'Exemplo de menu do tipo submenu (agrupador sem link)',
    example: {
      order: 4,
      name: 'Mais',
      type: 'submenu'
    }
  })
  static readonly submenuExample = {
    order: 4,
    name: 'Mais',
    type: 'submenu'
  };

  @ApiProperty({
    description: 'Exemplo de criação inferindo tipo category (sem enviar type)',
    example: {
      name: 'Tecnologia',
      slug: 'tecnologia'
    }
  })
  static readonly categoryInferExample = {
    name: 'Tecnologia',
    slug: 'tecnologia'
  };

  @ApiProperty({
    description: 'Exemplo de criação inferindo tipo internal (sem enviar type)',
    example: {
      name: 'Sobre Nós',
      routerLink: '/sobre'
    }
  })
  static readonly internalInferExample = {
    name: 'Sobre Nós',
    routerLink: '/sobre'
  };

  @ApiProperty({
    description: 'Exemplo de criação inferindo tipo external (sem enviar type)',
    example: {
      name: 'Parceiro',
      externalLink: 'https://www.parceiro.com.br'
    }
  })
  static readonly externalInferExample = {
    name: 'Parceiro',
    externalLink: 'https://www.parceiro.com.br'
  };

  @ApiProperty({
    description: 'Exemplo de criação inferindo tipo submenu (sem enviar type e sem links)',
    example: {
      name: 'Mais'
    }
  })
  static readonly submenuInferExample = {
    name: 'Mais'
  };
}

/**
 * Exemplos de respostas de erro comuns
 */
export class MenuErrorExamplesDto {
  @ApiProperty({
    description: 'Erro: campo obrigatório ausente para o tipo',
    example: {
      statusCode: 409,
      message: 'Slug é obrigatório para menus do tipo category',
      error: 'Conflict'
    }
  })
  static readonly missingRequiredField = {
    statusCode: 409,
    message: 'Slug é obrigatório para menus do tipo category',
    error: 'Conflict'
  };

  @ApiProperty({
    description: 'Erro: campo incorreto para o tipo',
    example: {
      statusCode: 409,
      message: 'Menus do tipo category devem usar apenas o campo slug',
      error: 'Conflict'
    }
  })
  static readonly incorrectFieldForType = {
    statusCode: 409,
    message: 'Menus do tipo category devem usar apenas o campo slug',
    error: 'Conflict'
  };

  @ApiProperty({
    description: 'Erro: ordem duplicada',
    example: {
      statusCode: 409,
      message: 'Já existe um menu com esta ordem',
      error: 'Conflict'
    }
  })
  static readonly duplicateOrder = {
    statusCode: 409,
    message: 'Já existe um menu com esta ordem',
    error: 'Conflict'
  };

  @ApiProperty({
    description: 'Erro: tipo inválido',
    example: {
      statusCode: 409,
      message: 'Tipo de menu inválido. Use: category, internal ou external',
      error: 'Conflict'
    }
  })
  static readonly invalidType = {
    statusCode: 409,
    message: 'Tipo de menu inválido. Use: category, internal, external ou submenu',
    error: 'Conflict'
  };
}
