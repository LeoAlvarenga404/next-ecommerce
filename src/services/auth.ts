// service/auth.ts

export interface User {
  user_id: string;
  email: string;
  name?: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}

export class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "AuthError";
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AuthError(
      errorData.error || `Erro HTTP: ${response.status}`,
      response.status
    );
  }
  return response.json();
};

export const authService = {
  async getSession(): Promise<AuthResponse> {
    const response = await fetch("/api/auth/session", {
      credentials: "include",
    });
    return handleResponse<AuthResponse>(response);
  },

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    return handleResponse<AuthResponse>(response);
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    return handleResponse<AuthResponse>(response);
  },

  async logout(): Promise<void> {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    // Logout geralmente deve funcionar mesmo se o servidor retornar erro
    if (!response.ok) {
      console.warn(
        "Erro no logout do servidor, mas continuando com logout local"
      );
    }
  },

  async refreshSession(): Promise<AuthResponse> {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    return handleResponse<AuthResponse>(response);
  },
};
