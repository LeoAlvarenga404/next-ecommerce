import { prisma } from "@/lib/prisma";

export const serverProductService = {
  async getProductById(productId: string) {
    return prisma.product.findUnique({
      where: { product_id: productId },
      include: {
        Category: true,
        ProductImage: true,
        ProductAttributeValue: {
          select: {
            attribute_id: true,

            value: true,
            attribute: {
              select: {
                name: true,
                unit: true,
                type: true,
              },
            },
          },
        },
      },
    });
  },
};
