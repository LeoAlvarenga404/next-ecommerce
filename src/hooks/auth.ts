const login = async ({ email, password }: { email: string; password: string }) => {
  return await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Falha ao realizar o Login");
    }
    return res.json();
  });
};

const register = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  return await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Erro ao registrar");
    }
    return res.json();
  });
};

export const useAuth = () => {
  return {
    login,
    register,
  };
};
