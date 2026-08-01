import { fireEvent, screen, waitFor } from "@testing-library/react";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { createUser, mockTemplate } from "@/test/fixtures";
import { renderWithQueryClient } from "@/test/render";

vi.mock("@/hooks/useAuth", () => ({
    useAuth: vi.fn(),
}));

vi.mock("@/services/template", () => ({
    starTemplate: vi.fn(),
}));

import { useAuth } from "@/hooks/useAuth";
import { starTemplate } from "@/services/template";

describe("TemplateCard", () => {
    beforeEach(() => {
        vi.mocked(useAuth).mockReturnValue({
            user: null,
            isLoading: false,
        } as never);
    });

    it("renders template metadata and links", () => {
        renderWithQueryClient(<TemplateCard template={mockTemplate} />);

        expect(screen.getByText("Demo Next Template")).toBeInTheDocument();
        expect(screen.getByText("Official")).toBeInTheDocument();
        expect(screen.getByText("react")).toBeInTheDocument();
        expect(screen.getByText("typescript")).toBeInTheDocument();

        expect(
            screen.getByRole("link", { name: /demo next template/i }),
        ).toHaveAttribute("href", "/templates/demo-repo%400.1.0");
        expect(screen.getByRole("link", { name: /octocat/i })).toHaveAttribute(
            "href",
            "/user/octocat",
        );
    });

    it("invalidates both the template detail and list query keys after starring", async () => {
        vi.mocked(useAuth).mockReturnValue({
            user: createUser(),
            isLoading: false,
        } as never);
        vi.mocked(starTemplate).mockResolvedValueOnce({
            is_starred: true,
            star_count: 1,
        });

        const { queryClient } = renderWithQueryClient(
            <TemplateCard template={mockTemplate} />,
        );
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        fireEvent.click(screen.getByRole("button", { name: /star/i }));

        await waitFor(() =>
            expect(starTemplate).toHaveBeenCalledWith(mockTemplate.name),
        );
        await waitFor(() =>
            expect(invalidateSpy).toHaveBeenCalledWith({
                queryKey: [
                    "template",
                    `${mockTemplate.name}@${mockTemplate.version}`,
                ],
            }),
        );
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
    });
});
