export interface Category {
  id: string;
  name: string;
  image: string;
  isActive?: boolean;
}

export const CATEGORIES: Category[] = [
  {
    id: 'facial',
    name: 'Facial',
    image: '/Categorias/facial.jpg',
    isActive: false
  },
  {
    id: 'corporal',
    name: 'Corporal',
    image: '/Categorias/corporal.jpg',
    isActive: false
  },
  {
    id: 'capilar',
    name: 'Capilar',
    image: '/Categorias/capilar.jpg',
    isActive: false
  },
  {
    id: 'combos',
    name: 'Combos',
    image: '/Categorias/combos.jpg',
    isActive: false
  },
  {
    id: 'personal',
    name: 'Personal',
    image: '/Categorias/personal.jpg',
    isActive: false
  }
];