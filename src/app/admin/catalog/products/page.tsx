import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListProduct } from "./list-product";
import AddProduct from "./add-product";

export default function ProductPage() {
  return (
    <div>
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Lista de Produtos</TabsTrigger>
          <TabsTrigger value="add">Adicionar Produto</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <ListProduct />
        </TabsContent>
        <TabsContent value="add">
          <AddProduct />
        </TabsContent>
      </Tabs>
    </div>
  );
}
