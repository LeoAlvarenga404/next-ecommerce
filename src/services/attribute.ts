// export interface IProductAttribute {
//   attribute_id: string;
//   name: string;
//   unit?: string;
//   type: string;
// }
// export interface IProductAttributeValue {
//   attribute_id: string;
//   value: string;
//   attribute: IProductAttribute;
// }

import type {
  IProductAttribute,
  IProductAttributeValue,
  IProductCategoryAttribute,
} from "@/@types/product";

export const attributeService = {
  async getAttributes(): Promise<IProductAttribute[]> {
    try {
      const res = await fetch("/api/attributes");

      if (!res.ok) {
        throw new Error("Falha ao buscar atributos");
      }

      return res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getAttributeByCategory(
    categoryId: string
  ): Promise<IProductCategoryAttribute[]> {
    try {
      const res = await fetch(
        `/api/attributes/category/?category_id=${categoryId}`
      );

      if (!res.ok) {
        throw new Error("Falha ao buscar atributos da categoria");
      }

      return res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async createAttribute(
    attribute: Omit<IProductAttribute, "attribute_id">
  ): Promise<IProductAttribute> {
    try {
      const res = await fetch("/api/attributes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attribute),
      });

      if (!res.ok) {
        throw new Error("Falha ao criar atributo");
      }

      return res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async createProductAttributeValue(
    attributeValue: Omit<IProductAttributeValue, "attribute_id">,
    productId: string
  ): Promise<IProductAttributeValue> {
    try {
      const res = await fetch(`/api/attributes/product/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          ...attributeValue,
        }),
      });

      if (!res.ok) {
        throw new Error("Falha ao criar valor de atributo");
      }

      return res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async associateCategoryAttribute(
    categoryId: string,
    attributesId: string[]
  ): Promise<void> {
    try {
      const res = await fetch(`/api/attributes/category/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category_id: categoryId, attributes_id: attributesId }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
