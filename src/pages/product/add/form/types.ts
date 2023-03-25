export interface IFormAttributeOfProductType {
  [key: string]: { value: string | number | boolean; label: string };
}

export interface ITypeOfProduct {
  value: string;
  label: string;
  categoryId: string;
}

export interface IFormProductAdd {
  name: string;
  type: ITypeOfProduct;
  category: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  attributes: IFormAttributeOfProductType;
}
