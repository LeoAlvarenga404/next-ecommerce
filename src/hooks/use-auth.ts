import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  authService,
  User,
  LoginRequest,
  RegisterRequest,
  AuthError,
} from "@/services/auth";

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

export const useAuthSession = () => {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: () => authService.getSession(),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (
        error instanceof AuthError &&
        [401, 403].includes(error.status || 0)
      ) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.session(), data);
      router.push("/");
    },
    onError: (error) => {
      console.error("Erro no login:", error);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.session(), data);
      router.push("/");
    },
    onError: (error) => {
      console.error("Erro no registro:", error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.push("/");
    },
    onError: (error) => {
      console.error("Erro no logout:", error);
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.push("/");
    },
  });
};

export const useRefreshSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.refreshSession(),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.session(), data);
    },
    onError: () => {
      queryClient.removeQueries({ queryKey: authKeys.session() });
    },
  });
};

export const useAuth = () => {
  const sessionQuery = useAuthSession();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const refreshMutation = useRefreshSession();

  const user: User | null = sessionQuery.data?.user || null;
  const isAuthenticated = !!user;
  const isLoading = sessionQuery.isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending;

  return {
    user,
    isAuthenticated,
    isLoading,

    sessionError: sessionQuery.error,
    loginError: loginMutation.error,
    registerError: registerMutation.error,

    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    refreshSession: refreshMutation.mutate,

    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    isLogoutPending: logoutMutation.isPending,

    refetchSession: sessionQuery.refetch,
  };
};
