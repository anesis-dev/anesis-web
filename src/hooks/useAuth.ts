import { fetchMe } from "@/services/user";
import { IUser } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  function login() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
  }

  async function logout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      credentials: "include",
    });
    queryClient.removeQueries({ queryKey: ["me"] });
    window.location.href = "/";
  }

  return { user, isLoading, login, logout };
}
