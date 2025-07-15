export interface Menu {
    id?:number;
    order:number;
    name:string;
    type:string;
    slug?:string;
    routerLink?:string;
    externalLink?:string;
    isActive?:boolean;
    createdAt?:string;
    updatedAt?:string;
}