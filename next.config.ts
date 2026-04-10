import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function createNextConfig(): NextConfig {
	return {
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
}

export default createNextConfig();
