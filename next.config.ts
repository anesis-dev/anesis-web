import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(projectRoot, "..");
const PHASE_DEVELOPMENT_SERVER = "phase-development-server";

function createNextConfig(
	phase: string,
): NextConfig {
	const isDev = phase === PHASE_DEVELOPMENT_SERVER;

	return {
		reactStrictMode: true,
		...(isDev ? {} : { outputFileTracingRoot: workspaceRoot }),
		turbopack: {
			root: isDev ? projectRoot : workspaceRoot,
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

export default createNextConfig;
