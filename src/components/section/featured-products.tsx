import { FeaturedProductCarousel } from "../custom/featured-products-carousel";
import { serverProductService } from "@/services/server-product";

export async function FeaturedProducts() {
  const products = await serverProductService.getTopSellingProducts();

  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium mb-3 text-foreground">
            Produtos em destaque
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full"></div>
        </div>

        <FeaturedProductCarousel products={products} />
      </div>
    </section>
  );
}
