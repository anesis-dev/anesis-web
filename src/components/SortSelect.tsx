"use client";

import { TrendingUpIcon } from "lucide-react";
import { SortMode } from "@/services/addon";

const OPTIONS: { value: SortMode; label: string }[] = [
	{ value: "recent", label: "Recent" },
	{ value: "popular", label: "Popular" },
	{ value: "trending", label: "Trending" },
];

/** Registry sort control backed by the server `sort` param (recent/popular/trending). */
export function SortSelect({
	value,
	onChange,
}: {
	value: SortMode;
	onChange: (value: SortMode) => void;
}) {
	return (
		<div className="relative inline-flex items-center">
			<TrendingUpIcon className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
			<select
				value={value}
				onChange={(event) => onChange(event.target.value as SortMode)}
				aria-label="Sort order"
				className="h-9 w-full appearance-none rounded-md border border-input bg-transparent pl-9 pr-8 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-auto"
			>
				{OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
