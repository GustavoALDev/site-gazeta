# Módulo de Upload de Vídeos

## Descrição

Módulo completo para upload e gerenciamento de vídeos no backend, com suporte para thumbnail opcional.

## Modelo de Dados

```prisma
model Video {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(255)
  url       String   @db.VarChar(500)
  thumbnail String?  @db.VarChar(500) // Opcional
  duration  String?  @db.VarChar(20)  // Formato MM:SS ou HH:MM:SS
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("videos")
}
```

## Estrutura de Resposta

```typescript
{
  id: 1,
  title: 'Usina de Tucuruí 01',
  url: 'http://localhost:3000/uploads/videos/video1.mp4',
  thumbnail: 'http://localhost:3000/uploads/videos/video1_thumb.jpg', // opcional
  duration: '01:51',
  createdAt: '2024-01-15T10:30:00.000Z',
  updatedAt: '2024-01-15T10:30:00.000Z'
}
```

## Endpoints

### 1. Upload de Vídeo com Thumbnail Opcional

**POST** `/videos/upload`

**Content-Type:** `multipart/form-data`

**Body:**
- `video` (file, obrigatório): Arquivo de vídeo
- `thumbnail` (file, opcional): Arquivo de thumbnail/imagem
- `title` (string, obrigatório): Título do vídeo
- `duration` (string, opcional): Duração no formato MM:SS ou HH:MM:SS

**Exemplo de uso com Postman/Insomnia:**
1. Selecione `POST` e cole a URL: `http://localhost:3000/videos/upload`
2. Na aba `Body`, selecione `multipart/form-data`
3. Adicione os campos:
   - `video`: selecione o arquivo de vídeo
   - `thumbnail`: selecione a imagem (opcional)
   - `title`: digite "Usina de Tucuruí 01"
   - `duration`: digite "01:51"

**Exemplo de uso com curl:**

```bash
curl -X POST http://localhost:3000/videos/upload \
  -F "video=@/path/to/video.mp4" \
  -F "thumbnail=@/path/to/thumbnail.jpg" \
  -F "title=Usina de Tucuruí 01" \
  -F "duration=01:51"
```

**Exemplo de uso com fetch (JavaScript/TypeScript):**

```typescript
const formData = new FormData();
formData.append('video', videoFile); // File object
formData.append('thumbnail', thumbnailFile); // File object (opcional)
formData.append('title', 'Usina de Tucuruí 01');
formData.append('duration', '01:51');

const response = await fetch('http://localhost:3000/videos/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data);
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "title": "Usina de Tucuruí 01",
  "url": "http://localhost:3000/uploads/videos/video_1704067200000_abc123_video.mp4",
  "thumbnail": "http://localhost:3000/uploads/videos/video_1704067200000_abc123_video_thumb.jpg",
  "duration": "01:51",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Listar Todos os Vídeos

**GET** `/videos`

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Usina de Tucuruí 01",
    "url": "http://localhost:3000/uploads/videos/video1.mp4",
    "thumbnail": "http://localhost:3000/uploads/videos/video1_thumb.jpg",
    "duration": "01:51",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 3. Obter Vídeo por ID

**GET** `/videos/:id`

**Resposta (200 OK):**
```json
{
  "id": 1,
  "title": "Usina de Tucuruí 01",
  "url": "http://localhost:3000/uploads/videos/video1.mp4",
  "thumbnail": "http://localhost:3000/uploads/videos/video1_thumb.jpg",
  "duration": "01:51",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Atualizar Vídeo

**PATCH** `/videos/:id`

**Body:**
```json
{
  "title": "Novo Título",
  "duration": "02:30"
}
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "title": "Novo Título",
  "url": "http://localhost:3000/uploads/videos/video1.mp4",
  "thumbnail": "http://localhost:3000/uploads/videos/video1_thumb.jpg",
  "duration": "02:30",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### 5. Deletar Vídeo

**DELETE** `/videos/:id`

**Resposta (200 OK):**
```json
{
  "message": "Vídeo removido com sucesso"
}
```

## Funcionalidades

✅ **Upload de vídeo** com armazenamento no diretório `uploads/videos/`
✅ **Thumbnail opcional** - pode ser enviado junto ou omitido
✅ **Processamento de thumbnail** - redimensionamento automático para 640x360
✅ **URLs públicas** geradas automaticamente
✅ **CRUD completo** - criar, listar, buscar, atualizar e deletar
✅ **Validação** de campos obrigatórios
✅ **Documentação Swagger** integrada
✅ **Exclusão de arquivos** ao deletar registro

## Configuração

### Variável de Ambiente

Certifique-se de que `BASE_URL` está configurada no arquivo `.env`:

```env
BASE_URL=http://localhost:3000
```

### Servir Arquivos Estáticos

Para servir os arquivos de vídeo, adicione no `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Servir arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  await app.listen(3000);
}
bootstrap();
```

## Estrutura de Arquivos

```
apps/backend-gazeta/src/video/
├── dto/
│   ├── create-video.dto.ts      # DTO para criar vídeo
│   ├── update-video.dto.ts      # DTO para atualizar vídeo
│   ├── video-response.dto.ts    # DTO de resposta
│   └── upload-video.dto.ts      # DTO interno para upload
├── services/
│   └── video-processing.service.ts  # Processamento de vídeos e thumbnails
├── video.controller.ts          # Controller com endpoints
├── video.service.ts             # Lógica de negócio
├── video.module.ts              # Módulo NestJS
└── README.md                    # Esta documentação
```

## Próximos Passos

Para gerar o Prisma Client atualizado (feche o servidor antes):

```bash
export DATABASE_URL="mysql://root:@localhost:3306/gazeta_db"
npx prisma generate --schema apps/backend-gazeta/prisma/schema.prisma
```

Para iniciar o servidor:

```bash
npx nx serve backend-gazeta
```

## Swagger/OpenAPI

Acesse a documentação interativa em: `http://localhost:3000/api`

Lá você pode testar todos os endpoints diretamente pela interface.

## Notas Importantes

1. **Thumbnail Opcional**: O campo `thumbnail` pode ser `null`. Apenas envie se tiver uma imagem.
2. **Formato de Duração**: Aceita formatos como "01:51", "1:51", "00:01:51"
3. **Tipos de Arquivo**: Vídeos suportados: MP4, AVI, MOV, WEBM, etc.
4. **Tamanho Máximo**: Configure no NestJS se necessário (padrão geralmente é 1MB-10MB)
5. **Processamento Assíncrono**: Para vídeos grandes, considere processamento em background

## Exemplo Frontend Angular

```typescript
// video-upload.component.ts
uploadVideo(videoFile: File, thumbnailFile?: File) {
  const formData = new FormData();
  formData.append('video', videoFile);
  
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
  }
  
  formData.append('title', 'Usina de Tucuruí 01');
  formData.append('duration', '01:51');
  
  return this.http.post<VideoResponseDto>(
    'http://localhost:3000/videos/upload',
    formData
  );
}
```

## Exemplo de Integração

```typescript
// No seu componente Angular
videos: VideoResponseDto[] = [];

ngOnInit() {
  this.loadVideos();
}

loadVideos() {
  this.http.get<VideoResponseDto[]>('http://localhost:3000/videos')
    .subscribe(videos => {
      this.videos = videos;
    });
}

// No template
<div *ngFor="let video of videos">
  <h3>{{ video.title }}</h3>
  <video [src]="video.url" controls [poster]="video.thumbnail">
    Seu navegador não suporta vídeos.
  </video>
  <p>Duração: {{ video.duration }}</p>
</div>
```

