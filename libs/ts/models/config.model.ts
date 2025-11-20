// ========== INTERFACES ==========

import { Category } from "./category.model";

export interface DestaqueConfig {
    id: number;
    randomMode: boolean;
    categories: CategoryBasic[];
    categoryIds: number[];
    createdAt: string;
    updatedAt: string;
    createdBy: number;
  }
  
  export interface TopGazetaConfig {
    id: number;
    randomMode: boolean;
    categories: Category[];
    categoryIds: number[];
    createdAt: string;
    updatedAt: string;
    createdBy: number;
  }
  
  export interface SectionOrderConfig {
    id: number;
    sectionId: string;
    name: string;
    title: string;
    order: number;
    showTitle: boolean;
    icon?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
  }
  
  export interface SocialMediaConfig {
    id: number;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
    tiktok?: string;
    whatsapp?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
  }
  
  interface CategoryBasic {
    id: number;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
  }
  
  // ========== DTOs ==========
  
  export interface CreateDestaqueConfigDto {
    randomMode: boolean;
    categoryIds?: number[];
  }
  
  export interface CreateTopGazetaConfigDto {
    randomMode: boolean;
    categoryIds?: number[];
  }
  
  export interface CreateSectionOrderDto {
    sectionId: string;
    name: string;
    title: string;
    order: number;
    showTitle: boolean;
    icon?: string;
  }
  
  export interface CreateSocialMediaConfigDto {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
    tiktok?: string;
    whatsapp?: string;
  }
// ========== INTERFACES ==========

export interface DestaqueConfig {
  id: number;
  randomMode: boolean;
  categories: CategoryBasic[];
  categoryIds: number[];
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

export interface TopGazetaConfig {
  id: number;
  randomMode: boolean;
  categories: Category[];
  categoryIds: number[];
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

export interface SectionOrderConfig {
  id: number;
  sectionId: string;
  name: string;
  title: string;
  order: number;
  showTitle: boolean;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

export interface SectionOrderConfigMap {
  [sectionId: string]: SectionOrderConfig;
}

export interface SocialMediaConfig {
  id: number;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
  tiktok?: string;
  whatsapp?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

interface CategoryBasic {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

// ========== DTOs ==========

export interface CreateDestaqueConfigDto {
  randomMode: boolean;
  categoryIds?: number[];
}

export interface CreateTopGazetaConfigDto {
  randomMode: boolean;
  categoryIds?: number[];
}

export interface CreateSectionOrderDto {
  sectionId: string;
  name: string;
  title: string;
  order: number;
  showTitle: boolean;
  icon?: string;
}

export interface CreateSocialMediaConfigDto {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
  tiktok?: string;
  whatsapp?: string;
}
  