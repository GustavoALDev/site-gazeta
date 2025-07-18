import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Request
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
import { YoutubePlaylistService } from './youtube-playlist.service';
import { CreateYoutubePlaylistDto } from './dto/create-youtube-playlist.dto';
import { UpdateYoutubePlaylistDto } from './dto/update-youtube-playlist.dto';
import { YoutubePlaylistResponseDto } from './dto/youtube-playlist-response.dto';
import { ReorderPlaylistDto } from './dto/reorder-playlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Playlist do YouTube')
@Controller('youtube-playlist')
export class YoutubePlaylistController {
  constructor(private readonly youtubePlaylistService: YoutubePlaylistService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Adicionar vídeo à playlist',
    description: 'Endpoint para adicionar um novo vídeo do YouTube à playlist da primeira página'
  })
  @ApiResponse({
    status: 201,
    description: 'Vídeo adicionado com sucesso',
    type: YoutubePlaylistResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos'
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não fornecido'
  })
  @ApiResponse({
    status: 409,
    description: 'Vídeo já está na playlist ou ordem já existe'
  })
  async create(
    @Body() createDto: CreateYoutubePlaylistDto,
    @Request() req: any
  ): Promise<YoutubePlaylistResponseDto> {
    try {
      return await this.youtubePlaylistService.create(createDto, req.user.id);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar vídeos ativos da playlist',
    description: 'Endpoint público para obter apenas vídeos ativos da playlist do YouTube'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vídeos ativos da playlist',
    type: [YoutubePlaylistResponseDto]
  })
  async findAllActive(): Promise<YoutubePlaylistResponseDto[]> {
    try {
      return await this.youtubePlaylistService.findAllActive();
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar todos os vídeos da playlist',
    description: 'Endpoint administrativo para obter todos os vídeos (ativos e inativos)'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de vídeos da playlist',
    type: [YoutubePlaylistResponseDto]
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não fornecido'
  })
  async findAll(): Promise<YoutubePlaylistResponseDto[]> {
    try {
      return await this.youtubePlaylistService.findAll(true);
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('next-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter próxima ordem disponível',
    description: 'Endpoint para obter o próximo número de ordem disponível para um novo vídeo'
  })
  @ApiResponse({
    status: 200,
    description: 'Próxima ordem disponível',
    schema: {
      type: 'object',
      properties: {
        nextOrder: { type: 'number', example: 5 }
      }
    }
  })
  async getNextOrder(): Promise<{ nextOrder: number }> {
    try {
      const nextOrder = await this.youtubePlaylistService.getNextDisplayOrder();
      return { nextOrder };
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter vídeo por ID',
    description: 'Endpoint para obter um vídeo específico da playlist pelo ID'
  })
  @ApiParam({ name: 'id', description: 'ID do vídeo', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Vídeo encontrado',
    type: YoutubePlaylistResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Vídeo não encontrado'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<YoutubePlaylistResponseDto> {
    try {
      return await this.youtubePlaylistService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar vídeo da playlist',
    description: 'Endpoint para atualizar um vídeo existente na playlist'
  })
  @ApiParam({ name: 'id', description: 'ID do vídeo', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Vídeo atualizado com sucesso',
    type: YoutubePlaylistResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos'
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não fornecido'
  })
  @ApiResponse({
    status: 404,
    description: 'Vídeo não encontrado'
  })
  @ApiResponse({
    status: 409,
    description: 'Ordem ou vídeo já existem'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateYoutubePlaylistDto
  ): Promise<YoutubePlaylistResponseDto> {
    try {
      return await this.youtubePlaylistService.update(id, updateDto);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reordenar playlist',
    description: 'Endpoint para alterar a ordem dos vídeos na playlist'
  })
  @ApiResponse({
    status: 200,
    description: 'Playlist reordenada com sucesso',
    type: [YoutubePlaylistResponseDto]
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou vídeos não encontrados'
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não fornecido'
  })
  async reorderPlaylist(@Body() reorderDto: ReorderPlaylistDto): Promise<YoutubePlaylistResponseDto[]> {
    try {
      return await this.youtubePlaylistService.reorderPlaylist(reorderDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remover vídeo da playlist',
    description: 'Endpoint para remover um vídeo da playlist (soft delete)'
  })
  @ApiParam({ name: 'id', description: 'ID do vídeo', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Vídeo removido com sucesso'
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não fornecido'
  })
  @ApiResponse({
    status: 404,
    description: 'Vídeo não encontrado'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      await this.youtubePlaylistService.remove(id);
      return { message: 'Vídeo removido da playlist com sucesso' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id/permanent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir vídeo permanentemente',
    description: 'Endpoint para excluir permanentemente um vídeo que já foi removido da playlist'
  })
  @ApiParam({ name: 'id', description: 'ID do vídeo', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Vídeo excluído permanentemente com sucesso'
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não fornecido'
  })
  @ApiResponse({
    status: 404,
    description: 'Vídeo não encontrado ou ainda está ativo'
  })
  @ApiResponse({
    status: 409,
    description: 'Vídeo ainda está ativo'
  })
  async permanentDelete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      await this.youtubePlaylistService.permanentDelete(id);
      return { message: 'Vídeo excluído permanentemente com sucesso' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 