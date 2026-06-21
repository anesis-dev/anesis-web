import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CommandCard } from "@/components/CommandCard";

describe("CommandCard", () => {
	it("renders the label, helper and command", () => {
		render(
			<CommandCard
				label="Install"
				command="npm install -g anesis-cli"
				helper="Run in your terminal"
			/>,
		);

		expect(screen.getByText("Install")).toBeInTheDocument();
		expect(screen.getByText("Run in your terminal")).toBeInTheDocument();
		expect(screen.getByText("npm install -g anesis-cli")).toBeInTheDocument();
	});

	it("copies the command and reflects a copied state", async () => {
		render(<CommandCard label="Install" command="anesis login" />);

		fireEvent.click(screen.getByRole("button", { name: /copy anesis login/i }));

		await waitFor(() =>
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith("anesis login"),
		);
		expect(
			await screen.findByRole("button", { name: /copied anesis login/i }),
		).toBeInTheDocument();
	});

	it("uses the copy label in the accessible name when provided", () => {
		render(
			<CommandCard
				label="Install"
				command="anesis login"
				copyLabel="login command"
			/>,
		);

		expect(
			screen.getByRole("button", { name: /copy login command/i }),
		).toBeInTheDocument();
	});
});
