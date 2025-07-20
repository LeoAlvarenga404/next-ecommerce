import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductFilters } from "@/hooks/use-product-filter";

interface SeachParams extends ProductFilters {
  page: string;
  limit: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const filters: SeachParams = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      category: searchParams.get("category") || undefined,
      brand: searchParams.get("brand") || undefined,
      search: searchParams.get("search") || undefined,
      inStock: searchParams.get("inStock") === "true" || undefined,
      minPrice: searchParams.get("minPrice")
        ? parseFloat(searchParams.get("minPrice") as string)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseFloat(searchParams.get("maxPrice") as string)
        : undefined,
      sortBy: searchParams.get("sortBy") as
        | "name"
        | "price"
        | "newest"
        | undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" | undefined,
    };

    const page = parseInt(filters.page);
    const limit = parseInt(filters.limit);
    const category = filters.category;

    const skip = (page - 1) * limit;
    const where = category ? { category_id: category } : {};

    const products = await prisma.product.findMany({
      where: {
        category_id: where.category_id,
        name: filters.search
          ? {
              contains: filters.search,
              mode: "insensitive",
            }
          : undefined,
        price: {
          gte: filters.minPrice || 0,
          lte: filters.maxPrice || 100000,
        },
        stock: filters.inStock ? { gt: 0 } : undefined,
      },
      orderBy: {
        price: filters.sortBy === "price" ? filters.sortOrder || "asc" : undefined,
      },
      skip,
      take: limit,
      include: {
        Category: {
          where: {
            CategoryAttribute: {
              every: {
                attribute: {
                  name: {
                    in: ["Marca"],
                  },
                },
              },
            },
          },
        },
        ProductImage: true,
      },
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
        sku: data.sku,
        category_id: data.category_id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao criar o produto: ${error}` },
      { status: 500 }
    );
  }
}
