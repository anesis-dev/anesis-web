import { screen } from "@testing-library/react";
import { createAddon } from "@/test/fixtures";
import { AddonCard } from "@/components/addons/AddonCard";
import { renderWithQueryClient } from "@/test/render";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({ user: null, isLoading: false })),
}));

describe("AddonCard", () => {
  it("renders links to the addon detail page and author profile", () => {
    renderWithQueryClient(<AddonCard addon={createAddon()} />);

    expect(screen.getByRole("link", { name: /drizzle orm/i })).toHaveAttribute(
      "href",
      "/addons/drizzle%401.0.0",
    );
    expect(screen.getByRole("link", { name: /anesis-addons/i })).toHaveAttribute(
      "href",
      "/user/anesis-addons",
    );
  });
});
