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
		<div className="flex items-center justify-between gap-4 border-t pt-4">
			<p className="text-xs text-muted-foreground">
				Page {page} of {totalPages}
			</p>
			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => onPageChange(page - 1)}
					disabled={page <= 1}
				>
					Previous
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => onPageChange(page + 1)}
					disabled={page >= totalPages}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
