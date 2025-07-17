import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddAttribute } from "./add-attribute";
import { AssociateToCategory } from "./associate-to-category";
export default function AttributePage() {
  return (
    <div>
      <Tabs defaultValue="add" className="w-full">
        <TabsList>
          <TabsTrigger value="add">Adicionar Atributo</TabsTrigger>
          <TabsTrigger value="associate">
            Associar Atributo a Categoria
          </TabsTrigger>
        </TabsList>
        <TabsContent value="associate">
          <AssociateToCategory />
        </TabsContent>
        <TabsContent value="add">
          <AddAttribute />
        </TabsContent>
      </Tabs>
    </div>
  );
}
