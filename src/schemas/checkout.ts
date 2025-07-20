import z from "zod";

export const checkoutSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres." })
    .max(100),
  email: z.email({ message: "Email inválido." }),
  phone: z
    .string()
    .min(10, { message: "Telefone deve ter pelo menos 10 caracteres." })
    .max(15, { message: "Telefone deve ter no máximo 15 caracteres." }),
  shipping: z.object({
    zip_code: z
      .string()
      .min(5, { message: "CEP deve ter pelo menos 5 caracteres." })
      .max(10, { message: "CEP deve ter no máximo 10 caracteres." }),
    street: z
      .string()
      .min(2, { message: "Rua deve ter pelo menos 2 caracteres." })
      .max(100, { message: "Rua deve ter no máximo 100 caracteres." }),
    state: z
      .string()
      .min(2, { message: "Estado deve ter pelo menos 2 caracteres." })
      .max(100, { message: "Estado deve ter no máximo 100 caracteres." }),
    city: z
      .string()
      .min(2, { message: "Cidade deve ter pelo menos 2 caracteres." })
      .max(100, { message: "Cidade deve ter no máximo 100 caracteres." }),
    complement: z
      .string()
      .max(200, { message: "Complemento deve ter no máximo 200 caracteres." })
      .optional(),
    number: z
      .string()
      .min(1, { message: "Número deve ter pelo menos 1 caractere." })
      .max(10, { message: "Número deve ter no máximo 10 caracteres." }),
  }),
});

export type ICheckoutSchema = z.infer<typeof checkoutSchema>;
