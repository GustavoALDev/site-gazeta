import { Menu } from "../models/menu.model";
export const mockMenu: Menu[] = [
    {
        id: 1,
        order: 1,
        name: 'Início',
        type: 'internal',
        routerLink: '/'
    },
    {
        id: 2,
        order: 2,
        name: 'Notícias',
        type: 'internal',
        routerLink: '/noticias'
    },
    {
        id: 3,
        order: 3,
        name: 'Política',
        type: 'category',
        slug: 'politica'
    },
    {
        id: 4,
        order: 4,
        name: 'Esportes',
        type: 'category',
        slug: 'esportes'
    },
    {
        id: 5,
        order: 5,
        name: 'Tecnologia',
        type: 'category',
        slug: 'tecnologia'
    },
    
]