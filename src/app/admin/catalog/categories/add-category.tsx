"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategories, useCreateCategory } from "@/hooks/use-category";
import { useState } from "react";

export function AddCategory() {
  const [nomeCategoria, setNomeCategoria] = useState("");

  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const handleCreateCategory = async (name: string) => {
    try {
      await createCategory.mutateAsync(name);
      setNomeCategoria("");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-medium">Criar Categoriar (provisório)</h1>
      <div className="space-y-4">
        <Label>Nome</Label>
        <Input
          placeholder="Digite o nome da categoria"
          onChange={(value) => setNomeCategoria(value.target.value)}
        />
        <Button onClick={() => handleCreateCategory(nomeCategoria)}>
          Cadastrar
        </Button>
      </div>
      <div className="mt-5">
        {categories?.map((category) => (
          <div key={category.category_id} className="mb-2">
            <span className="font-medium">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
