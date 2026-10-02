import { useQuery } from "@tanstack/react-query";
import { fetchAddon } from "@/services/addon";
import { IAddon } from "@/types/addon";

export function useAddon(addonRef: string) {
  const {
    data: addon,
    isLoading,
    isError,
  } = useQuery<IAddon>({
    queryKey: ["addon", addonRef],
    queryFn: () => fetchAddon(addonRef),
    enabled: !!addonRef,
    // SSR-prefetched data is anonymous (no cookies on the server), so refetch
    // in the background on mount to pick up per-user fields like is_starred.
    staleTime: 0,
  });

  return { addon, isLoading, isError };
}
