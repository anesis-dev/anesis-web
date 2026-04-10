import { useMemo } from "react";
import { useAddons } from "@/hooks/useAddons";

export function useMyAddons(ownerId: string | undefined, enabled = true) {
	const { addons, isLoading, isError } = useAddons(enabled);

	const myAddons = useMemo(() => {
		if (!ownerId) {
			return [];
		}

		return addons.filter((addon) => addon.owner_id === ownerId);
	}, [addons, ownerId]);

	return { addons: myAddons, isLoading, isError };
}
