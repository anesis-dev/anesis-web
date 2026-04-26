import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function createNextConfig(): NextConfig {
	const apiProxyUrl = process.env.API_PROXY_URL?.replace(/\/+$/, "");
	const config: NextConfig = {
		reactStrictMode: true,
		turbopack: {
			root: projectRoot,
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
