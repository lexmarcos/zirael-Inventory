export interface IAttributeOfProductType {
  key: string;
  label: string;
  defaultValue: string | number | boolean;
}

export interface IProductType {
  _id: string;
  name: string;
  categoryId: string;
  attributes: IAttributeOfProductType[];
}
