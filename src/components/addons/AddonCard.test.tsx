import { render, screen } from "@testing-library/react";
import { createAddon } from "@/test/fixtures";
import { AddonCard } from "@/components/addons/AddonCard";

describe("AddonCard", () => {
  it("renders links to the addon detail page and source repository", () => {
    render(<AddonCard addon={createAddon()} />);

    expect(screen.getByRole("link", { name: /open package/i })).toHaveAttribute(
      "href",
      "/addons/registry/drizzle%401.0.0",
    );
    expect(
      screen.getByRole("link", { name: /open repository for drizzle orm/i }),
    ).toHaveAttribute(
      "href",
      "https://github.com/oxide-addons/drizzle/tree/main",
    );
  });
});
