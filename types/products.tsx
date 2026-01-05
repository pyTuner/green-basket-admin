export interface Product {
  _id?: string;
  name?: string;
  description?: string;
  image?: string;
  unitId?: string;
  price?: number;
  discount?: number;
  visibility?: boolean;
  categoryId?: string;
  stock?: number;
}

export interface CartItemProps {
  product: Product;
  quantity: number;
  role: string;
  onAdd?: () => void;
  onRemove?: () => void;
  editProduct?: () => void;
  deleteProduct?: () => void;
}