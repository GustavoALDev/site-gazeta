export interface Ads {
    id?: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    image: string;
    clickUrl: string;
    position: string;
    placement: string;
    isActive: boolean;
    priority: number;
    imageUrl?: string;
}
