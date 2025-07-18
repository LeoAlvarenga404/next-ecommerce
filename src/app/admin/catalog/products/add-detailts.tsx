"use client";

import {
  useAttributeByCategory,
  useCreateProductAttributeValue,
} from "@/hooks/use-attribute";
import { useProducts, useProduct } from "@/hooks/use-products";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { IProduct } from "@/@types/product";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  const { data: productData } = useProduct(productSelected.product_id);

  const handleProductChange = (productId: string) => {
    const selectedProduct = dataProducts?.products.find(
      (product) => product.product_id === productId
    );
    if (selectedProduct) {
      setProductSelected(selectedProduct);
      reset();
    }
  };

 

  const { register, handleSubmit, reset } = useForm();

  function inputTypeFromAttributeType(type: string) {

    return "text";
  }

  const onSubmit = (data: any) => {
    type submitProps = {
      attributeId: string;
      value: string;
    };
    let attributeData: submitProps[] = [];

    Object.entries(data.attributes).forEach(([attributeId, value]) => {
      console.log(`Processando atributo: ${attributeId} = ${value}`);
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

    alert("Atributos salvos com sucesso!");
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
            attributesByCategory?.[0]?.CategoryAttribute.map((attr, index) => (
              <div key={attr.attribute.attribute_id} className="space-y-4">
                <Label>{attr.attribute.name}</Label>
                <Input
                  type={inputTypeFromAttributeType(attr.attribute.type)}
                  placeholder={`Valor para ${attr.attribute.name}`}
                  {...(attr.attribute.type === "BOOLEAN"
                    ? {
                        ...register(
                          `attributes.${attr.attribute.attribute_id}`,
                          {
                            setValueAs: (value) => (value ? "true" : "false"),
                          }
                        ),
                        defaultChecked:
                          productData?.ProductAttributeValue.find(
                            (value) =>
                              value.attribute_id === attr.attribute.attribute_id
                          )?.value === "true",
                      }
                    : {
                        ...register(
                          `attributes.${attr.attribute.attribute_id}`
                        ),
                        defaultValue:
                          productData?.ProductAttributeValue.find(
                            (value) =>
                              value.attribute_id === attr.attribute.attribute_id
                          )?.value || "",
                      })}
                />
              </div>
            ))}
          <Button type="submit">Salvar</Button>
        </form>
      </div>
    </div>
  );
}
