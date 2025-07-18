"use client";

// Aqui eu vou adicionar apenas atributos (nome, tipo e unidade)

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAttributes,
  useCreateAttribute,
  useAssociateCategoryAttribute,
  useAttributeByCategory,
} from "@/hooks/use-attribute";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCategories } from "@/hooks/use-category";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

const attributeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  unit: z.string().optional(),
  type: z.string().min(1, "Tipo é obrigatório"),
});

type AttributeFormData = z.infer<typeof attributeSchema>;

export function AddAttribute() {
  const { data: attributes, isLoading: isAttributesLoading } = useAttributes();

  const createAttribute = useCreateAttribute();
  const associateCategoryAttribute = useAssociateCategoryAttribute();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AttributeFormData>({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      name: "",
      unit: "",
      type: "",
    },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: AttributeFormData) => {
    try {
      await createAttribute.mutateAsync({
        name: data.name.trim(),
        unit: data.unit?.trim() || undefined,
        type: data.type,
      });

      reset();
    } catch (error) {
      console.error("Erro ao criar atributo:", error);
    }
  };

  return (
    <div>
      <div className="p-5">
        <h1 className="text-2xl">Cadastrar Atributo</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Digite o nome do atributo"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unidade (opcional)</Label>
            <Input
              id="unit"
              {...register("unit")}
              placeholder="Digite a unidade do atributo"
            />
            {errors.unit && (
              <span className="text-red-500">{errors.unit.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipos de Atributo</SelectLabel>
                  <SelectItem value="STRING">Texto</SelectItem>
                  <SelectItem value="NUMBER">Número</SelectItem>
                  <SelectItem value="BOOLEAN">Booleano</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.type && (
              <span className="text-red-500">{errors.type.message}</span>
            )}
          </div>
          <Button
            type="submit"
            disabled={
              createAttribute.isPending || associateCategoryAttribute.isPending
            }
          >
            {createAttribute.isPending ? "Criando..." : "Cadastrar Atributo"}
          </Button>
        </form>
      </div>
    </div>
  );
}
