"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { ApiError } from "@/api/client";

export default function ClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: (failureCount, error) => {
							if (error instanceof ApiError) {
								if (error.status === 401 || error.status === 403) {
									return false;
								}

								if (error.status >= 400 && error.status < 500) {
									return false;
								}
							}

							return failureCount < 2;
						},
						staleTime: 1000 * 60 * 5,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
