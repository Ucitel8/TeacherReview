import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

export async function login(password: string) {
  await apiRequest("POST", "/api/admin/login", { password });
}

export async function logout() {
  await apiRequest("POST", "/api/admin/logout", {});
}

export function useIsAdmin() {
  const { data } = useQuery({
    queryKey: ["/api/admin/reviews/pending"],
    retry: false,
    throwOnError: false,
  });

  return data !== undefined;
}
