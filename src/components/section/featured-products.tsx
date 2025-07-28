import { FeaturedProductCarousel } from "../custom/featured-products-carousel";
import { serverProductService } from "@/services/server-product";
import { Button } from "../ui/button";
import Link from "next/link";

export async function FeaturedProducts() {
  const products = await serverProductService.getTopSellingProducts();

  return (
    <section>
      <div className="container mx-auto px-4 mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Produtos em Destaque
          </h2>
          <Link
            href="/products"
            className="text-sm text-blue-600 hover:underline"
          >
            <Button variant="link">Todos os Produtos</Button>
          </Link>
        </div>

        <FeaturedProductCarousel products={products} />
      </div>
    </section>
  );
}
