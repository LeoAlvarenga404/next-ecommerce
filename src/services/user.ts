interface UpdateUserData {
  user_id: string;
  name?: string;
  email?: string;
  phone?: string;
}

export const userService = {
  async updateUser({ user_id, name, email, phone }: UpdateUserData) {
    try {
      const response = await fetch(`/api/user/${user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, name, email, phone }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar usuário");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};
