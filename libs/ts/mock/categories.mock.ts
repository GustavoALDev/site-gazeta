import { Category } from "../models/category.model";

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Tecnologia',
    description: 'Notícias sobre tecnologia, inovação, startups e mundo digital',
    slug: 'tecnologia',
    color: '#3b82f6',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Política',
    description: 'Notícias e análises sobre o cenário político local, estadual e nacional',
    slug: 'politica',
    color: '#ef4444', // Vermelho
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Esportes',
    description: 'Cobertura esportiva completa: futebol, olimpíadas e outros esportes',
    slug: 'esportes',
    color: '#10b981', // Verde
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Economia',
    description: 'Notícias sobre economia, mercado financeiro e negócios',
    slug: 'economia',
    color: '#f59e0b', // Laranja
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Saúde',
    description: 'Informações sobre saúde, medicina e bem-estar',
    slug: 'saude',
    color: '#ec4899', // Rosa
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 6,
    name: 'Cultura',
    description: 'Arte, música, cinema, literatura e eventos culturais',
    slug: 'cultura',
    color: '#8b5cf6', // Roxo
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 7,
    name: 'Educação',
    description: 'Notícias sobre educação, ensino e desenvolvimento acadêmico',
    slug: 'educacao',
    color: '#06b6d4', // Ciano
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

