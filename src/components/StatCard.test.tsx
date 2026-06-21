import { render, screen } from "@testing-library/react";
import { BoxesIcon } from "lucide-react";
import { StatCard } from "@/components/StatCard";

describe("StatCard", () => {
	it("renders the label and value", () => {
		render(<StatCard label="Total Templates" value={42} icon={BoxesIcon} />);

		expect(screen.getByText("Total Templates")).toBeInTheDocument();
		expect(screen.getByText("42")).toBeInTheDocument();
	});

	it("renders the helper text when provided", () => {
		render(
			<StatCard
				label="Users"
				value={3}
				helper="Registered accounts"
				icon={BoxesIcon}
			/>,
		);

		expect(screen.getByText("Registered accounts")).toBeInTheDocument();
	});

	it("omits the helper paragraph when not provided", () => {
		render(<StatCard label="Users" value={3} icon={BoxesIcon} />);

		expect(screen.queryByText("Registered accounts")).not.toBeInTheDocument();
	});
});
