import { fireEvent, screen, waitFor } from "@testing-library/react";
import { createAddon, createUser } from "@/test/fixtures";
import { AddonCard } from "@/components/addons/AddonCard";
import { renderWithQueryClient } from "@/test/render";

vi.mock("@/hooks/useAuth", () => ({
    useAuth: vi.fn(),
}));

vi.mock("@/services/addon", () => ({
    starAddon: vi.fn(),
}));

import { useAuth } from "@/hooks/useAuth";
import { starAddon } from "@/services/addon";

describe("AddonCard", () => {
    beforeEach(() => {
        vi.mocked(useAuth).mockReturnValue({
            user: null,
            isLoading: false,
        } as never);
    });

    it("renders links to the addon detail page and author profile", () => {
        renderWithQueryClient(<AddonCard addon={createAddon()} />);

        expect(
            screen.getByRole("link", { name: /drizzle orm/i }),
        ).toHaveAttribute("href", "/addons/drizzle%401.0.0");
        expect(
            screen.getByRole("link", { name: /anesis-addons/i }),
        ).toHaveAttribute("href", "/user/anesis-addons");
    });

    it("invalidates both the addon detail and list query keys after starring", async () => {
        vi.mocked(useAuth).mockReturnValue({
            user: createUser(),
            isLoading: false,
        } as never);
        vi.mocked(starAddon).mockResolvedValueOnce({
            is_starred: true,
            star_count: 1,
        });
        const addon = createAddon({ is_starred: false, star_count: 0 });

        const { queryClient } = renderWithQueryClient(
            <AddonCard addon={addon} />,
        );
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        fireEvent.click(screen.getByRole("button", { name: /star/i }));

        await waitFor(() =>
            expect(starAddon).toHaveBeenCalledWith(addon.addon_id),
        );
        await waitFor(() =>
            expect(invalidateSpy).toHaveBeenCalledWith({
                queryKey: ["addon", `${addon.addon_id}@${addon.version}`],
            }),
        );
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["addons"] });
    });
});
