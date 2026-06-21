import { Suspense } from "react";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import AddonDetailsPage from "@/app/(main)/addons/registry/[addonRef]/page";
import { mockAddon } from "@/test/fixtures";
import { renderWithQueryClient } from "@/test/render";

vi.mock("@/hooks/useAddon", () => ({
  useAddon: vi.fn(),
}));

vi.mock("@/hooks/useAddonManifest", () => ({
  useAddonManifest: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}));

vi.mock("@/hooks/useTemplateReadme", () => ({
  useTemplateReadme: vi.fn(() => ({
    readme: "# Drizzle",
    fileName: "README.md",
    path: "README.md",
    isLoading: false,
    isError: false,
    error: null,
  })),
}));

vi.mock("@/components/templates/TemplateReadme", () => ({
  TemplateReadme: ({
    fileName,
    content,
  }: {
    fileName?: string;
    content?: string | null;
  }) => <div>{fileName ? `${fileName}:${content}` : "README unavailable"}</div>,
}));

import { useAddon } from "@/hooks/useAddon";
import { useAddonManifest } from "@/hooks/useAddonManifest";

describe("AddonDetailsPage", () => {
  it("shows a not found state when the addon cannot be loaded", async () => {
    vi.mocked(useAddon).mockReturnValue({
      addon: undefined,
      isLoading: false,
      isError: true,
    });
    vi.mocked(useAddonManifest).mockReturnValue({
      manifest: null,
      isLoading: false,
      isError: false,
      error: null,
    });

    await act(async () => {
      renderWithQueryClient(
        <Suspense fallback={null}>
          <AddonDetailsPage
            params={Promise.resolve({
              addonRef: "missing%401.0.0",
            })}
          />
        </Suspense>,
      );
    });

    expect(await screen.findByText("Addon not found")).toBeInTheDocument();
    expect(
      screen.getByText("missing@1.0.0", { exact: false }),
    ).toBeInTheDocument();
    expect(useAddon).toHaveBeenCalledWith("missing@1.0.0");
  });

  it("renders a repo-style addon page with readme, header and commands tab", async () => {
    vi.mocked(useAddon).mockReturnValue({
      addon: mockAddon,
      isLoading: false,
      isError: false,
    });
    vi.mocked(useAddonManifest).mockReturnValue({
      manifest: {
        schema_version: "1.0",
        id: "drizzle",
        name: "Drizzle ORM",
        version: "1.0.0",
        description: "Adds Drizzle ORM scaffolding helpers.",
        author: "anesis-addons",
        requires: [],
        inputs: [],
        detect: [],
        variants: [
          {
            when: null,
            commands: [
              {
                name: "install",
                description: "Install Drizzle support.",
                once: false,
                requires_commands: [],
                inputs: [],
                steps: [{ type: "run" }],
              },
            ],
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    await act(async () => {
      renderWithQueryClient(
        <Suspense fallback={null}>
          <AddonDetailsPage
            params={Promise.resolve({
              addonRef: "drizzle%401.0.0",
            })}
          />
        </Suspense>,
      );
    });

    expect(
      await screen.findByRole("heading", { name: "Drizzle ORM" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open source/i })).toHaveAttribute(
      "href",
      mockAddon.url,
    );
    expect(screen.getByText("README.md:# Drizzle")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to addon registry/i }),
    ).toHaveAttribute("href", "/addons");
    expect(useAddon).toHaveBeenCalledWith("drizzle@1.0.0");
    expect(useAddonManifest).toHaveBeenCalledWith(mockAddon.url);

    fireEvent.click(screen.getByRole("tab", { name: /about/i }));
    expect(
      screen.getByText("anesis addon install drizzle", { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("anesis addon remove drizzle", { exact: false }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /commands/i }));
    expect(screen.getByText("Install Drizzle support.")).toBeInTheDocument();
    expect(
      screen.getByText("anesis use drizzle install", { exact: false }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /copy anesis use drizzle install/i }),
    );

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "anesis use drizzle install",
      ),
    );
  });
});
