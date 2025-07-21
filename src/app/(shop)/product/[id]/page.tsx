import { serverProductService } from "@/services/server-product";
import ProductClient from "./product-client";
import { IProduct } from "@/@types/product";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productFromDb = await serverProductService.getProductById(params.id);

  if (!productFromDb) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
      </div>
    );
  }

  const product: IProduct = {
    ...productFromDb,
    description: productFromDb.description ?? undefined,
    discount: productFromDb.discount ?? undefined,
    Category: productFromDb.Category ?? null,
    ProductImage: productFromDb.ProductImage ?? [],
    ProductAttributeValue: (productFromDb.ProductAttributeValue ?? []).map(
      (attrVal: any) => ({
        ...attrVal,
        attribute: {
          attribute_id: attrVal.attribute?.attribute_id ?? attrVal.attribute_id,
          name: attrVal.attribute?.name ?? "",
          unit: attrVal.attribute?.unit ?? undefined,
          type: attrVal.attribute?.type ?? "",
        },
      })
    ),
  };

  return <ProductClient product={product} />;
}
