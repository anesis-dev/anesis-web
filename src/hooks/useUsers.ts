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
