"use client";

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
import { useState } from "react";

export default function UploaderPage() {
  const { data } = useProducts();
  console.log(JSON.stringify(data));
  const [productId, setProductId] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-4">
        <Select onValueChange={(value) => setProductId(value)}>
          <SelectTrigger className="w-[180px]">
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
          className="bg-primary p-2 rounded-xl"
          disabled={!productId}
          content={{
            button: "Enviar Imagem",
            allowedContent(arg) {
              return "";
            },
          }}
        />
      </div>
    </main>
  );
}
