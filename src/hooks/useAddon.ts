/**
 * Hook — fetches a single addon by its ref (`"addonId@version"`).
 *
 * Cache key: ["addon", addonRef]
 *
 * The query is disabled when `addonRef` is empty. Falls back to the user's
 * own addons if the addon is not found in the public listing (covers private
 * and org-private addons — see `fetchAddon` in the service layer).
 */
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
