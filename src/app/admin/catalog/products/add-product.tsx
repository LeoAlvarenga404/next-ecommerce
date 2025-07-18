"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/use-products";
import { UploadButton } from "@/utils/uploadthing";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const createProductForm = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.number().min(0, "Preço deve ser maior ou igual a zero"),
  description: z.string().optional(),
  stock: z.number().min(0, "Estoque deve ser maior ou igual a zero"),
  sku: z.string().min(1, "SKU é obrigatório"),
  category_id: z.string().min(1, "Categoria é obrigatória"),
});

type CreateProductFormType = z.infer<typeof createProductForm>;

interface Category {
  category_id: string;
  name: string;
}

export function AddProduct() {
  const { data } = useProducts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [productId, setProductId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/products/categories");
        if (!res.ok) {
          throw new Error("Falha ao buscar categorias");
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateProductFormType>({
    resolver: zodResolver(createProductForm),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      stock: 0,
      sku: "",
      category_id: "",
    },
  });

  async function handleCreateProduct(data: CreateProductFormType) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Erro ao criar produto: ${errorData.error}`);
      }

      const newProduct = await res.json();
      console.log("Produto criado com sucesso:", newProduct);
      reset();

      alert("Produto criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setIsSubmitting(false);
    }
  }

  const onSubmit = handleSubmit(handleCreateProduct);

  return (
    <form className="flex flex-col gap-4 w-[300px]" onSubmit={onSubmit}>
      <div className="space-y-2">
        <div className="space-y-2">
          <Label>Nome do Produto</Label>
          <Input
            type="text"
            placeholder="Nome do produto"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Input
            type="text"
            placeholder="Descrição do produto"
            {...register("description")}
          />
        </div>
        <div className="space-y-2">
          <Label>Preço</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="Preço do produto"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Estoque</Label>
          <Input
            type="number"
            placeholder="Quantidade em estoque"
            {...register("stock", { valueAsNumber: true })}
          />
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>SKU</Label>
          <Input
            type="text"
            placeholder="SKU do produto"
            {...register("sku")}
          />
          {errors.sku && (
            <p className="text-red-500 text-sm">{errors.sku.message}</p>
          )}
        </div>
        <div className="space-y-4">
          <Label>Selecionar Categoria</Label>
          <Select onValueChange={(value) => setValue("category_id", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categoria</SelectLabel>
                {categories.map((category) => (
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
          {errors.category_id && (
            <p className="text-red-500 text-sm">{errors.category_id.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar Produto"}
        </Button>
      </div>
      {/* Upload de Imagens */}
      <div className="space-y-4">
        <Label>Fazer upload de imagens no produto</Label>
        <Select onValueChange={(value) => setProductId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um produto" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Produtos</SelectLabel>
              {data?.products.map((product) => (
                <SelectItem key={product.sku} value={product.product_id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <UploadButton
          endpoint="imageUploader"
          input={{ productId }}
          onClientUploadComplete={async (res: any) => {
            console.log("upload: ", res);
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
          className="border border-primary p-2 rounded-xl w-full"
          disabled={!productId}
          content={{
            button: "Enviar Imagem",
            allowedContent(arg) {
              return "";
            },
          }}
        />
      </div>
    </form>
  );
}
