import { IProductCategory } from "@/@types/product";
import Image from "next/image";

export function FeaturedCategoryItem({ data }: { data: IProductCategory }) {
  const imageUrl = data?.image || "/placeholder-category.png";

  return (
    <div className="flex flex-col items-center justify-center gap-4 group cursor-pointer">
      <div className="p-4 aspect-square bg-gray-100 w-fit rounded-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={`Categoria ${data?.name || "Sem nome"}`}
          width={80}
          height={80}
          className="transition-transform duration-300 ease-in-out group-hover:scale-110 object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-category.png";
          }}
        />
      </div>
      <h2 className="text-sm font-semibold relative">
        {data?.name || "Categoria"}
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
      </h2>
    </div>
  );
}
