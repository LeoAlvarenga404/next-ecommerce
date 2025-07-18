"use client";

import {
  useAssociateCategoryAttribute,
  useAttributes,
  useAttributeByCategory,
} from "@/hooks/use-attribute";
import { useCategories } from "@/hooks/use-category";
import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AssociateToCategory() {
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: attributes, isLoading: isAttributesLoading } = useAttributes();
  const associateCategoryAttribute = useAssociateCategoryAttribute();
  const { data: categoryAttributes } = useAttributeByCategory(categoryId);

  const filteredAttributes = useMemo(() => {
    if (!attributes) return [];
    return attributes.filter((attribute) =>
      attribute.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attributes, searchTerm]);

  const isAttributeAssociated = (attributeId: string) => {
    if (!categoryAttributes || categoryAttributes.length === 0) return false;

     const category = categoryAttributes.find(
      (cat) => cat.category_id === categoryId
    );

    if (!category || !category.CategoryAttribute) return false;

    return category.CategoryAttribute.some(
      (catAttr) => catAttr.attribute.attribute_id === attributeId
    );
  };

  const handleAttributeChange = (attributeId: string, checked: boolean) => {
    if (checked) {
      setSelectedAttributes((prev) => [...prev, attributeId]);
    } else {
      setSelectedAttributes((prev) => prev.filter((id) => id !== attributeId));
    }
  };

  const handleAssociate = () => {
    if (!categoryId || selectedAttributes.length === 0) return;

    associateCategoryAttribute.mutate(
      {
        categoryId,
        attributesId: selectedAttributes,
      },
      {
        onSuccess: (data) => {
          setSelectedAttributes([]);
          setCategoryId("");
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6">
        Associar Atributos a Categoria
      </h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category-select">Categorias</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="category-select">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categorias</SelectLabel>
                {categories?.map((category) => (
                  <SelectItem
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 w-[400px]">
          <div className="space-y-2">
            <Label htmlFor="attribute-search">Buscar Atributos</Label>
            <Input
              id="attribute-search"
              placeholder="Digite para buscar atributos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Card className="p-4">
            <Label className="text-sm font-medium mb-3 block">
              Selecione os Atributos ({selectedAttributes.length} selecionados)
            </Label>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {isAttributesLoading ? (
                <p className="text-sm text-muted-foreground">
                  Carregando atributos...
                </p>
              ) : filteredAttributes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {searchTerm
                    ? "Nenhum atributo encontrado"
                    : "Nenhum atributo disponível"}
                </p>
              ) : (
                filteredAttributes.map((attribute) => {
                  const isAssociated = isAttributeAssociated(
                    attribute.attribute_id
                  );

                  return (
                    <div
                      key={attribute.attribute_id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`attribute-${attribute.attribute_id}`}
                        checked={
                          !!isAssociated ||
                          selectedAttributes.includes(attribute.attribute_id)
                        }
                        disabled={!!isAssociated}
                        onCheckedChange={(checked) =>
                          !isAssociated &&
                          handleAttributeChange(
                            attribute.attribute_id,
                            checked === true
                          )
                        }
                      />
                      <Label
                        htmlFor={`attribute-${attribute.attribute_id}`}
                        className={`text-sm font-normal cursor-pointer ${
                          isAssociated ? "text-muted-foreground" : ""
                        }`}
                      >
                        {attribute.name}
                        {attribute.unit && `(${attribute.unit})`}
                        {!!isAssociated && " (já associado)"}
                      </Label>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <Button
            onClick={handleAssociate}
            disabled={
              !categoryId ||
              selectedAttributes.length === 0 ||
              associateCategoryAttribute.isPending ||
              isCategoriesLoading ||
              isAttributesLoading
            }
            className="w-full"
          >
            {associateCategoryAttribute.isPending
              ? "Associando..."
              : "Associar Atributos"}
          </Button>
        </div>
      </div>
    </div>
  );
}
