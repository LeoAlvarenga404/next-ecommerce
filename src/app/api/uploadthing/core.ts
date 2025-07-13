import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const f = createUploadthing();

async function auth(req: Request) {
  const session = await getSession();
  if (!session) throw new UploadThingError("Unauthorized");
  return { id: session.user_id };
}

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({ productId: z.string() }))
    .middleware(async ({ req, input }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      const product = await prisma.product.findUnique({
        where: { product_id: input.productId },
      });

      if (!product) throw new UploadThingError("Produto não encontrado");

      return {
        userId: user.id,
        productId: input.productId, 
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      try {
        const productImage = await prisma.productImage.create({
          data: {
            product_id: metadata.productId,
            url: file.url,
          },
        });

        console.log("Imagem salva no banco:", productImage);

        return {
          uploadedBy: metadata.userId,
          imageId: productImage.image_id,
          productId: metadata.productId,
        };
      } catch (error) {
        throw new UploadThingError("Erro ao salvar imagem no banco");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
