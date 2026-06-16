/**
 * GitHub OAuth callback page — Client Component (`/auth/callback`).
 *
 * Handles two distinct callback flows initiated from the server:
 *
 * 1. Server-cookie sign-in (`?signed_in=1`): The server has already set the
 *    session cookie. We just clear the TanStack Query cache (to prevent
 *    showing data from a previous session) and redirect home.
 *
 * 2. Legacy code-exchange (`?code=<code>`): The browser was redirected here
 *    with a GitHub OAuth code. We call `POST /auth/exchange` to let the server
 *    validate the code and set a session cookie, then redirect home.
 *
 * Additional flags handled: `account_added`, `account_already_active`,
 * `account_already_added` (multi-account flow).
 *
 * Shows a loading spinner while the exchange is in progress and an error
 * card if anything goes wrong.
 */
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertCircleIcon, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { exchangeAuthCode, getLoginUrl } from "@/services/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const signedIn = params.get("signed_in") === "1";
    if (signedIn) {
      // Clear all cached queries so we don't show stale data from a previous
      // authenticated session belonging to a different user.
      queryClient.clear();
      router.replace("/");
      return;
    }

    if (params.get("account_added") === "1") {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      router.replace("/");
      return;
    }

    if (params.get("account_already_active") === "1" || params.get("account_already_added") === "1") {
      router.replace("/");
      return;
    }

    const code = params.get("code");
    if (!code) {
      setError(
        "Missing authorization code. Start the GitHub sign-in flow again.",
      );
      return;
    }
    const authCode = code;

    let cancelled = false;

    async function finishSignIn() {
      try {
        await exchangeAuthCode(authCode);
        queryClient.clear();

        if (!cancelled) {
          router.replace("/");
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to complete sign-in.",
          );
        }
      }
    }

    void finishSignIn();

    return () => {
      cancelled = true;
    };
  }, [queryClient, router]);

  if (error) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center px-4 py-10 sm:px-6">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border bg-background px-6 py-8 text-center shadow-sm sm:px-8">
          <AlertCircleIcon className="size-10 text-destructive" />
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">Unable to finish sign-in</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
            >
              Try again
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.replace("/")}
            >
              Go home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center px-4 py-10 sm:px-6">
      <div
        role="status"
        className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border bg-background px-6 py-8 text-center shadow-sm sm:px-8"
      >
        <LoaderIcon className="size-10 animate-spin text-muted-foreground" />
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Finishing sign-in</h1>
          <p className="text-sm text-muted-foreground">
            Exchanging your GitHub callback code for a secure session.
          </p>
        </div>
      </div>
    </div>
  );
}
