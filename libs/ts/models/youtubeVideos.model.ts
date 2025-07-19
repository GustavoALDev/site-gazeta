export interface YoutubeVideo {
  id?:number
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string;
  duration: string;
  videoId: string;
  displayOrder: number;
  isActive: boolean;
  isEmphasis: boolean;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  creator?: any;
}
