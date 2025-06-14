import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  NotFoundException
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';

@ApiTags('Mídia')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova mídia',
    description: 'Endpoint para criar uma nova mídia'
  })
  @ApiResponse({
    status: 201,
    description: 'Mídia criada com sucesso',
    type: MediaResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos - Validação de campos obrigatórios'
  })
  async create(@Body() createMediaDto: CreateMediaDto): Promise<MediaResponseDto> {
    try {
      return await this.mediaService.create(createMediaDto);
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as mídias',
    description: 'Endpoint para obter todas as mídias'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mídias',
    type: [MediaResponseDto]
  })
  async findAll(): Promise<MediaResponseDto[]> {
    try {
      return await this.mediaService.findAll();
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
    summary: 'Obter mídia por ID',
    description: 'Endpoint para obter uma mídia específica pelo ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da mídia',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Mídia encontrada',
    type: MediaResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Mídia não encontrada'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MediaResponseDto> {
    try {
      return await this.mediaService.findOne(id);
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
  @ApiOperation({
    summary: 'Atualizar mídia',
    description: 'Endpoint para atualizar uma mídia existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da mídia',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Mídia atualizada com sucesso',
    type: MediaResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos - Validação de campos'
  })
  @ApiResponse({
    status: 404,
    description: 'Mídia não encontrada'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMediaDto: UpdateMediaDto
  ): Promise<MediaResponseDto> {
    try {
      return await this.mediaService.update(id, updateMediaDto);
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

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover mídia',
    description: 'Endpoint para remover uma mídia'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da mídia',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Mídia removida com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Mídia removida com sucesso'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Mídia não encontrada'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      return await this.mediaService.remove(id);
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
} 