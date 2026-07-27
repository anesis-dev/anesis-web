import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function contentSecurityPolicy(isDev: boolean): string {
	const scriptSrc = isDev
		? "'self' 'unsafe-inline' 'unsafe-eval'"
		: "'self' 'unsafe-inline'";

	return [
		"default-src 'self'",
		`script-src ${scriptSrc}`,
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob: https://avatars.githubusercontent.com",
		"font-src 'self' data:",
		`connect-src 'self' https:${isDev ? " ws: http://localhost:4000" : ""}`,
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"object-src 'none'",
		...(isDev ? [] : ["upgrade-insecure-requests"]),
	].join("; ");
}

function securityHeaders(isDev: boolean) {
	return [
		{ key: "Content-Security-Policy", value: contentSecurityPolicy(isDev) },
		{ key: "X-Content-Type-Options", value: "nosniff" },
		{ key: "X-Frame-Options", value: "DENY" },
		{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
		{
			key: "Permissions-Policy",
			value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
		},
		...(isDev
			? []
			: [
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
				]),
	];
}

function createNextConfig(): NextConfig {
	const apiProxyUrl = process.env.API_PROXY_URL?.replace(/\/+$/, "");
	const isDev = process.env.NODE_ENV !== "production";
	const config: NextConfig = {
		reactStrictMode: true,
		headers: async () => [
			{ source: "/:path*", headers: securityHeaders(isDev) },
		],
		turbopack: {
			root: projectRoot,
		},
		experimental: {
			optimizePackageImports: [
				"lucide-react",
				"radix-ui",
				"cmdk",
				"react-markdown",
				"rehype-highlight",
				"rehype-raw",
				"rehype-sanitize",
				"remark-gfm",
			],
		},
		webpack: (config) => {
			config.resolve ??= {};
			const existingModules = config.resolve.modules ?? [];
			const projectNodeModules = path.join(projectRoot, "node_modules");

			config.resolve.modules = [
				projectNodeModules,
				...(Array.isArray(existingModules) ? existingModules : []),
			];

			return config;
		},
		images: {
			remotePatterns: [
				{
					protocol: "https",
					hostname: "avatars.githubusercontent.com",
				},
			],
		},
	};

	if (apiProxyUrl) {
		config.rewrites = async () => [
			{
				source: "/api/backend/:path*",
				destination: `${apiProxyUrl}/:path*`,
			},
		];
	}

	return config;
}

export default createNextConfig();
