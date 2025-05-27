import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conexão com o banco de dados estabelecida com sucesso! 🚀');
      
      // Testa a conexão fazendo uma query simples
      await this.user.count();
      this.logger.log('Banco de dados está respondendo corretamente! ✅');
    } catch (error) {
      this.logger.error('Erro ao conectar com o banco de dados ❌');
      this.logger.error(error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
} 