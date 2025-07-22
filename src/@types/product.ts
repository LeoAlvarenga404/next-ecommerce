export interface IProductProductImage {
  url: string;
  alt_text?: string;
}

export interface IProductCategory {
  category_id: string;
  name: string;
  image?: string | null
}
export interface IProductAttribute {
  attribute_id: string;
  name: string;
  unit?: string;
  type: string;
}

export interface IProductCategoryAttribute {
  category_id: string;
  name: string;
  CategoryAttribute: {
    some(arg0: (attr: any) => boolean): unknown;
    attribute: IProductAttribute;
  };
}

export interface IProductAttributeValue {
  attribute_id: string;
  value: string;
  attribute: IProductAttribute;
}
export interface IProduct {
  product_id: string;
  name: string;
  price: number;
  description?: string | null;
  discount?: number | null;
  stock: number;
  sku: string;
  Category: IProductCategory | null;
  ProductImage: IProductProductImage[]
  ProductAttributeValue: IProductAttributeValue[]
}

export interface IProductsResponse {
  products: IProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
