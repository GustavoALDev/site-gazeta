import { NewsMedia } from "./newsMedia.model";
import { NewsVideo } from "./newsVideo.model";

export interface News {
    id: number;
    title: string;
    subtitle: string;
    content: string;
    categoryId: number[];
    author: string;
    mediaNews:NewsMedia[];
    videoNews:NewsVideo[];
    published: string;
    createdAt: string;
    updateAt: string;
    views: number;
    status: string;
    validity: string;
    slug: string;
    isEmphasis: boolean;
}
