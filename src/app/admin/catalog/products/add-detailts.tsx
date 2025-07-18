"use client";

import {
  useAttributeByCategory,
  useCreateProductAttributeValue,
} from "@/hooks/use-attribute";
import { useProducts } from "@/hooks/use-products";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { IProduct } from "@/@types/product";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
export function ProductDetails() {
  const [productSelected, setProductSelected] = useState<IProduct>({
    product_id: "",
    name: "",
    price: 0,
    description: "",
    stock: 0,
    sku: "",
    Category: {
      category_id: "",
      name: "",
    },
    ProductImage: [],
    ProductAttributeValue: [],
  });
  const { data: dataProducts } = useProducts();
  const { data: attributesByCategory } = useAttributeByCategory(
    productSelected.Category.category_id
  );
  const { mutate: createProductAttributeValue } =
    useCreateProductAttributeValue();

  const handleProductChange = (productId: string) => {
    const selectedProduct = dataProducts?.products.find(
      (product) => product.product_id === productId
    );
    if (selectedProduct) {
      setProductSelected(selectedProduct);
    }
  };
  const { register, handleSubmit } = useForm();

  function inputTypeFromAttributeType(type: string) {
    if (type === "NUMBER") return "number";
    if (type === "BOOLEAN") return "checkbox";
    return "text";
  }

  const onSubmit = (data: any) => {
    type submitProps = {
      attributeId: string;
      value: string;
    };
    let attributeData: submitProps[] = [];

    Object.entries(data.attributes).forEach(([attributeId, value]) => {
      attributeData.push({
        attributeId: attributeId,
        value: String(value),
      });
    });

    attributeData.forEach((item) => {
      if (!item.value || item.value.trim() === "") return;
      createProductAttributeValue({
        product_id: productSelected.product_id,
        attribute_id: item.attributeId,
        value: item.value,
      });
    });
  };

  return (
    <div>
      <Select onValueChange={handleProductChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um produto" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Produtos</SelectLabel>
          </SelectGroup>
          {dataProducts?.products.map((product) => (
            <SelectItem key={product.product_id} value={product.product_id}>
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-4 gap-4 mt-4"
        >
          {Array.isArray(attributesByCategory?.[0]?.CategoryAttribute) &&
            attributesByCategory?.[0]?.CategoryAttribute.map((attr) => (
              <div key={attr.attribute.attribute_id} className="space-y-4">
                <Label>{attr.attribute.name}</Label>
                <Input
                  type={inputTypeFromAttributeType(attr.attribute.type)}
                  placeholder={`Valor para ${attr.attribute.name}`}
                  {...register(`attributes.${attr.attribute.attribute_id}`)}
                />
              </div>
            ))}
          <Button type="submit">Salvar</Button>
        </form>
      </div>
    </div>
  );
}
