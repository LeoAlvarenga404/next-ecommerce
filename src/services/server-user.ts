import { IUserData } from "@/@types/user";
import { prisma } from "@/lib/prisma";

export const serverUserService = {
  async getUserById(userId: string): Promise<IUserData | null> {
    if (!userId) {
      throw new Error("Id não pode ser vazio");
    }
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        email: true,
        phone: true,
        UserAddress: true,
      },
    });

    if (!user) {
      return null;
    }
    return user;
  },
  
  async updateUser(userId: string, data: Partial<IUserData>) {
    if (!userId) {
      throw new Error("Id não pode ser vazio");
    }
    await prisma.user.update({
      where: { user_id: userId },
      data: {
        name: data.name || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
      },
    });
  },
};
