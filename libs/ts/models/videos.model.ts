import { Category } from './category.model';
export interface Video {
    id: number;
    title: string;
    url: string;
    thumbnail: string | null;
    duration: string;
    views:number;
    createdAt: string;
    updatedAt: string;
    categories: Category[];
    featured: boolean;
    tags:string[];
    description?: string | null;
    newsSlug?: string | null;
} 