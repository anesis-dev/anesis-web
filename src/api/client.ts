import { env } from "@/config/env";

class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

// Server-side fetches must not stall a render (or a prerender during `next
// build`) when the backend is unreachable but the socket stays open. The
// browser has no such constraint - React Query owns retries/timeouts there.
const SERVER_REQUEST_TIMEOUT_MS = 10_000;

const isServer = typeof window === "undefined";

// Origin of *this* Next.js server, used to turn a same-origin apiUrl such as
// "/api/backend" into something Node's fetch will accept.
function selfOrigin(): string {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return `http://127.0.0.1:${process.env.PORT ?? 3000}`;
}

function requestBaseUrl(): string {
    if (!isServer) {
        return env.apiUrl;
    }

    // Direct backend origin, bypassing the /api/backend rewrite entirely.
    const proxyUrl = process.env.API_PROXY_URL?.replace(/\/+$/, "");
    if (proxyUrl) {
        return proxyUrl;
    }

    // env.apiUrl may be a same-origin path ("/api/backend"); Node's fetch
    // rejects relative URLs, so resolve it against our own origin.
    if (env.apiUrl.startsWith("/")) {
        return `${selfOrigin()}${env.apiUrl}`;
    }

    return env.apiUrl;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${requestBaseUrl()}${path}`, {
        credentials: "include",
        ...(isServer && !options?.signal
            ? { signal: AbortSignal.timeout(SERVER_REQUEST_TIMEOUT_MS) }
            : {}),
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        let message = `${res.status} ${res.statusText}`;
        try {
            const json = JSON.parse(text);
            if (typeof json.message === "string") message = json.message;
            else if (typeof json.error === "string") message = json.error;
        } catch {}
        throw new ApiError(res.status, message);
    }

    const text = await res.text();
    if (!text) return undefined as T;
    try {
        return JSON.parse(text) as T;
    } catch {
        throw new ApiError(
            res.status,
            "Server returned an unexpected non-JSON response.",
        );
    }
}

export const api = {
    get: <T>(path: string, options?: RequestInit) =>
        apiFetch<T>(path, { method: "GET", ...options }),

    post: <T>(path: string, body?: unknown, options?: RequestInit) =>
        apiFetch<T>(path, {
            method: "POST",
            body: body !== undefined ? JSON.stringify(body) : undefined,
            ...options,
        }),

    put: <T>(path: string, body?: unknown, options?: RequestInit) =>
        apiFetch<T>(path, {
            method: "PUT",
            body: body !== undefined ? JSON.stringify(body) : undefined,
            ...options,
        }),

    patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
        apiFetch<T>(path, {
            method: "PATCH",
            body: body !== undefined ? JSON.stringify(body) : undefined,
            ...options,
        }),

    delete: <T>(path: string, options?: RequestInit) =>
        apiFetch<T>(path, { method: "DELETE", ...options }),
};

export { ApiError };
