import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListProduct } from "./list-product";
import { AddProduct } from "./add-product";
import { ProductDetails } from "./add-detailts";

export default function ProductPage() {
  return (
    <div>
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Lista de Produtos</TabsTrigger>
          <TabsTrigger value="add">Adicionar Produto</TabsTrigger>
          <TabsTrigger value="details">Detalhes do Produto</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <ListProduct />
        </TabsContent>
        <TabsContent value="add">
          <AddProduct />
        </TabsContent>
        <TabsContent value="details">
          <ProductDetails />
        </TabsContent>
      </Tabs>
    </div>
  );
}
