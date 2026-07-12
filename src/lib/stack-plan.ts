/**
 * Order selected addon ids so each addon comes after the addons it requires
 * (so `anesis use` installs dependencies first). Shallow DFS post-order:
 * preserves insertion order where there's no dependency, guards against cycles,
 * and ignores requirements that aren't in the selection.
 */
export function orderByRequires(
	selected: string[],
	requiresOf: (id: string) => string[],
): string[] {
	const inSet = new Set(selected);
	const visited = new Set<string>();
	const visiting = new Set<string>();
	const result: string[] = [];

	function visit(id: string) {
		if (visited.has(id) || visiting.has(id) || !inSet.has(id)) return;
		visiting.add(id);
		for (const dep of requiresOf(id)) visit(dep);
		visiting.delete(id);
		visited.add(id);
		result.push(id);
	}

	for (const id of selected) visit(id);
	return result;
}
