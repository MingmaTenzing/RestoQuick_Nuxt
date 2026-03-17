export type MenuOptionDraft = {
  name: string;
  price: number;
};

export type MenuItemFormState = {
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  isAvailable: boolean;
};
