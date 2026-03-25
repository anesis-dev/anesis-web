"use client";

import { Button } from "@/components/ui/button";

export function PaginationControls({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className="flex flex-col items-stretch gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
			<p className="text-xs text-muted-foreground">
				Page {page} of {totalPages}
			</p>
			<div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="w-full sm:w-auto"
					onClick={() => onPageChange(page - 1)}
					disabled={page <= 1}
				>
					Previous
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="w-full sm:w-auto"
					onClick={() => onPageChange(page + 1)}
					disabled={page >= totalPages}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
