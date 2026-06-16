/**
 * Hook — fetches all registered users (admin only).
 *
 * Endpoint: GET /user/all
 * Cache key: ["admin", "users"]
 *
 * The server enforces admin authorization; a 403 is returned for non-admins.
 */
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "@/services/user";
import { IUser } from "@/types/user";

export function useUsers() {
	const { data: users = [], isLoading, isError } = useQuery<IUser[]>({
		queryKey: ["admin", "users"],
		queryFn: fetchAllUsers,
	});

	return { users, isLoading, isError };
}
