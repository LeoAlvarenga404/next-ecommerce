export interface IProductProductImage {
  product_id: string;
  image_id: string;
  url: string;
  primary: boolean;
  alt_text?: string;
}

export interface IProductCategory {
  category_id: string;
  name: string;
  image?: string | null;
}

export interface IProductAttribute {
  attribute_id: string;
  name: string;
  unit: string | null; 
  type: "STRING" | "NUMBER" | "BOOLEAN";
}

export interface IProductAttributeValue {
  product_id: string; 
  value_id: string; 
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
  ProductImage: IProductProductImage[];
  ProductAttributeValue: IProductAttributeValue[];
  _count?: {
    OrderItem: number;
  };
}
