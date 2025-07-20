import { Products } from "@/components/custom/products";
import { ProductFilter } from "../filter";

export default function ProductsPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-1 sm:px-2 lg:px-2 py-8">
      <div className="flex flex-col lg:flex-row gap-8 px-0">
        <aside className="lg:w-80 flex-shrink-0">
          <ProductFilter />
        </aside>
        <main className="flex-1 min-w-0">
          <Products />
        </main>
      </div>
    </div>
  );
}
