import { z } from "zod";

export const userAddressSchema = z.object({
  address_id: z.string(),
  user_id: z.string(),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  zip_code: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000"),
  complement: z.string().optional(),
});

export const userDataSchema = z.object({
  user_id: z.string(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("Email inválido"),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone deve estar no formato (11) 99999-9999"
    )
    .optional()
    .or(z.literal("")),
  UserAddress: z.array(userAddressSchema).optional(),
});

export type UserAddress = z.infer<typeof userAddressSchema>;
export type UserData = z.infer<typeof userDataSchema>;
