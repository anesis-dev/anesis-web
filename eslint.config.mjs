import nextConfig from "eslint-config-next";

const config = [
	...nextConfig,
	{
		ignores: ["node_modules/**", ".next/**", "graphify-out/**"],
	},
	{
		rules: {
			"react-hooks/set-state-in-effect": "warn",
		},
	},
];

export default config;
