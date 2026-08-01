"use client";

import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { authorLogin } from "@/lib/author";
import { deleteStack, updateStackVisibility } from "@/services/stack";
import { IStack } from "@/types/stack";
import {
    EyeIcon,
    EyeOffIcon,
    ExternalLinkIcon,
    LoaderIcon,
    PackageIcon,
    Trash2Icon,
} from "lucide-react";

export function OwnedStackCard({ stack }: { stack: IStack }) {
    const queryClient = useQueryClient();
    const [busy, setBusy] = useState<null | "visibility" | "delete">(null);
    const ownerLogin = authorLogin(stack.config?.author);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isPrivate = stack.visibility === "private";

    async function refresh() {
        await queryClient.invalidateQueries({
            queryKey: ["stack", stack.stack_id],
        });
        await queryClient.invalidateQueries({ queryKey: ["stacks"] });
    }

    async function toggleVisibility() {
        setBusy("visibility");
        setError(null);
        try {
            await updateStackVisibility(
                stack.id,
                isPrivate ? "public" : "private",
            );
            await refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update visibility.",
            );
        } finally {
            setBusy(null);
        }
    }

    async function handleDelete() {
        setBusy("delete");
        setError(null);
        try {
            await deleteStack(stack.stack_id, stack.version);
            await refresh();
            setConfirmDelete(false);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to delete stack.",
            );
        } finally {
            setBusy(null);
        }
    }

    return (
        <div className="flex h-full flex-col gap-3 rounded-xl border bg-card px-6 py-5">
            <div className="flex items-start justify-between gap-3">
                <Link
                    href={`/stacks/${encodeURIComponent(stack.stack_id)}`}
                    className="font-medium hover:underline"
                >
                    {stack.name}
                </Link>
                <div className="flex items-center gap-1.5">
                    <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        v{stack.version}
                    </span>
                    {stack.official ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            official
                        </span>
                    ) : null}
                    <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {isPrivate ? "private" : "public"}
                    </span>
                </div>
            </div>

            <p className="line-clamp-2 text-sm text-muted-foreground">
                {stack.description || "No description."}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                    <PackageIcon className="size-3.5" />
                    {stack.config?.template}
                </span>
                <span>{stack.config?.addons?.length ?? 0} addons</span>
                {ownerLogin && (
                    <Link
                        href={`/user/${ownerLogin}`}
                        className="hover:underline"
                    >
                        @{ownerLogin}
                    </Link>
                )}
            </div>

            {error ? <p className="text-xs text-destructive">{error}</p> : null}

            <div className="mt-auto flex items-center gap-1 border-t pt-3">
                <Button
                    asChild
                    size="icon-xs"
                    variant="ghost"
                    title="View repository"
                >
                    <Link
                        href={stack.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ExternalLinkIcon />
                    </Link>
                </Button>
                <Button
                    size="icon-xs"
                    variant="ghost"
                    title={isPrivate ? "Make public" : "Make private"}
                    disabled={busy !== null}
                    onClick={toggleVisibility}
                >
                    {busy === "visibility" ? (
                        <LoaderIcon className="animate-spin" />
                    ) : isPrivate ? (
                        <EyeOffIcon />
                    ) : (
                        <EyeIcon />
                    )}
                </Button>
                <Button
                    size="icon-xs"
                    variant="ghost"
                    title="Delete stack"
                    disabled={busy !== null}
                    onClick={() => setConfirmDelete(true)}
                    className="text-muted-foreground hover:text-destructive"
                >
                    {busy === "delete" ? (
                        <LoaderIcon className="animate-spin" />
                    ) : (
                        <Trash2Icon />
                    )}
                </Button>
            </div>

            <Dialog
                open={confirmDelete}
                onOpenChange={(open) => {
                    if (busy === "delete") return;
                    setConfirmDelete(open);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete stack</DialogTitle>
                        <DialogDescription>
                            This removes version{" "}
                            <span className="font-mono text-foreground">
                                {stack.version}
                            </span>{" "}
                            of{" "}
                            <span className="font-mono text-foreground">
                                {stack.stack_id}
                            </span>{" "}
                            from the registry. Other published versions are not
                            affected.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmDelete(false)}
                            disabled={busy === "delete"}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={busy === "delete"}
                        >
                            {busy === "delete" ? (
                                <>
                                    <LoaderIcon className="size-3.5 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2Icon className="size-3.5" />
                                    Delete stack
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
