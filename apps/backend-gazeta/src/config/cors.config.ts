import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Permitir requisições sem origin (ex: aplicações mobile, Postman)
    if (!origin) return callback(null, true);
    
    // Lista de origins permitidas
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:4200',
      'http://localhost:5000',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:4200',
      'http://127.0.0.1:5000',
      'http://127.0.0.1:8080',
    ];

    // Verificar se é localhost com qualquer porta
    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
    
    if (allowedOrigins.includes(origin) || isLocalhost) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400, // 24 horas
};

// Configuração mais simples para desenvolvimento
export const devCorsConfig: CorsOptions = {
  origin: true, // Permite qualquer origin em desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: '*',
  credentials: true,
  optionsSuccessStatus: 204,
}; 