"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddAttribute } from "./add-attribute";
import { AssociateToCategory } from "./associate-to-category";
import { AddCategory } from "./add-category";
export default function CategoryPage() {
  return (
    <div>
      <Tabs defaultValue="add-category" className="w-full">
        <TabsList>
          <TabsTrigger value="add-category">Adicionar Categoria</TabsTrigger>
          <TabsTrigger value="add-attribute">Adicionar Atributo</TabsTrigger>
          <TabsTrigger value="associate">
            Associar Atributo a Categoria
          </TabsTrigger>
        </TabsList>
        <TabsContent value="add-category">
          <AddCategory />
        </TabsContent>
        <TabsContent value="add-attribute">
          <AddAttribute />
        </TabsContent>
        <TabsContent value="associate">
          <AssociateToCategory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
