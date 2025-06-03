export interface News {
    id: number;
    title: string;
    subtitle: string;
    content: string;
    categoryId: number[];
    imgEmphasis: string;
    imgEmphasisAuthor: string;
    author: string;
    media:{type: string, url: string, author: string, date: string}
    published: boolean;
    createdAt: string;
    updateAt: string;
    views: number;
    status: string;
    validity: string;
    slug: string;
    isEmphasis: boolean;
}