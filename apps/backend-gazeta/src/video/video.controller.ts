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
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  UploadedFiles
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody
} from '@nestjs/swagger';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoResponseDto } from './dto/video-response.dto';

@ApiTags('Vídeos')
@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar novo vídeo',
    description: 'Endpoint para criar um novo registro de vídeo (sem upload)'
  })
  @ApiResponse({
    status: 201,
    description: 'Vídeo criado com sucesso',
    type: VideoResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos'
  })
  async create(@Body() createVideoDto: CreateVideoDto): Promise<VideoResponseDto> {
    try {
      return await this.videoService.create(createVideoDto);
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro no servidor, tente novamente mais tarde',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload de vídeo com thumbnail opcional',
    description: 'Endpoint para fazer upload de um vídeo com thumbnail opcional. O thumbnail pode ser enviado junto ou adicionado depois.'
  })
  @ApiBody({
    description: 'Dados do upload de vídeo',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de vídeo (MP4, AVI, MOV, etc)',
          example: 'video.mp4'
        },
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de thumbnail (JPG, PNG, WEBP) - OPCIONAL',
          example: 'thumbnail.jpg'
        },
        title: {
          type: 'string',
          description: 'Título do vídeo',
          example: 'Usina de Tucuruí 01'
        },
        duration: {
          type: 'string',
          description: 'Duração do vídeo no formato MM:SS ou HH:MM:SS (opcional)',
          example: '01:51'
        }
      },
      required: ['video', 'title']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Vídeo processado e criado com sucesso',
    type: VideoResponseDto,
    schema: {
      example: {
        id: 1,
        title: 'Usina de Tucuruí 01',
        url: 'http://localhost:3000/uploads/videos/video_1704067200000_abc123_video1.mp4',
        thumbnail: 'http://localhost:3000/uploads/videos/video_1704067200000_abc123_video1_thumb.jpg',
        duration: '01:51',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido ou dados incorretos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Arquivo de vídeo não fornecido'
      }
    }
  })
  async uploadVideo(
    @UploadedFiles() files: { video?: any[]; thumbnail?: any[] },
    @Body('title') title: string,
    @Body('duration') duration?: string
  ): Promise<VideoResponseDto> {
    try {
      if (!files.video || files.video.length === 0) {
        throw new HttpException('Arquivo de vídeo não fornecido', HttpStatus.BAD_REQUEST);
      }

      if (!title) {
        throw new HttpException('Título do vídeo é obrigatório', HttpStatus.BAD_REQUEST);
      }

      const videoFile = files.video[0];
      const thumbnailFile = files.thumbnail && files.thumbnail.length > 0 ? files.thumbnail[0] : undefined;

      return await this.videoService.createWithUpload(videoFile, thumbnailFile, {
        title,
        duration
      });
    } catch (error) {
      if (error instanceof HttpException) {
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
    summary: 'Listar todos os vídeos',
    description: 'Endpoint para obter todos os vídeos'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vídeos',
    type: [VideoResponseDto]
  })
  async findAll(): Promise<VideoResponseDto[]> {
    try {
      return await this.videoService.findAll();
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
    description: 'Endpoint para obter um vídeo específico pelo ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do vídeo',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Vídeo encontrado',
    type: VideoResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Vídeo não encontrado'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VideoResponseDto> {
    try {
      return await this.videoService.findOne(id);
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
    summary: 'Atualizar vídeo',
    description: 'Endpoint para atualizar um vídeo existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do vídeo',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Vídeo atualizado com sucesso',
    type: VideoResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Vídeo não encontrado'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVideoDto: UpdateVideoDto
  ): Promise<VideoResponseDto> {
    try {
      return await this.videoService.update(id, updateVideoDto);
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
    summary: 'Remover vídeo',
    description: 'Endpoint para remover um vídeo'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do vídeo',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Vídeo removido com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Vídeo removido com sucesso'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Vídeo não encontrado'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      return await this.videoService.remove(id);
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

