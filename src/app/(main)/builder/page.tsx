import { BuilderPage } from "@/components/builder/BuilderPage";

export const metadata = {
	title: "Stack builder",
	description: "Compose a template and addons into a copyable Anesis command or stack.",
};

export default function Builder() {
	return <BuilderPage />;
}
