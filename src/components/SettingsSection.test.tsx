import { render, screen } from "@testing-library/react";
import { SettingsRow, SettingsSection } from "@/components/SettingsSection";

describe("SettingsSection", () => {
	it("renders the title, description and children", () => {
		render(
			<SettingsSection title="Danger zone" description="Irreversible actions">
				<div>body</div>
			</SettingsSection>,
		);

		expect(
			screen.getByRole("heading", { name: "Danger zone" }),
		).toBeInTheDocument();
		expect(screen.getByText("Irreversible actions")).toBeInTheDocument();
		expect(screen.getByText("body")).toBeInTheDocument();
	});

	it("applies the danger tone styling to the heading", () => {
		render(
			<SettingsSection title="Delete account" tone="danger">
				<div />
			</SettingsSection>,
		);

		expect(screen.getByRole("heading", { name: "Delete account" })).toHaveClass(
			"text-destructive",
		);
	});

	it("omits the description when not provided", () => {
		render(
			<SettingsSection title="Profile">
				<div />
			</SettingsSection>,
		);

		expect(screen.getByRole("heading", { name: "Profile" })).toBeInTheDocument();
	});
});

describe("SettingsRow", () => {
	it("renders the row title, description and action", () => {
		render(
			<SettingsRow title="Email" description="Used for notifications">
				<button type="button">Edit</button>
			</SettingsRow>,
		);

		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.getByText("Used for notifications")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
	});
});
