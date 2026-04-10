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
  });

  return { addon, isLoading, isError };
}
