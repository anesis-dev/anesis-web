import { Suspense } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddonDetailsPage from "@/app/(main)/addons/registry/[addonRef]/page";
import { mockAddon } from "@/test/fixtures";

vi.mock("@/hooks/useAddon", () => ({
  useAddon: vi.fn(),
}));

vi.mock("@/hooks/useAddonManifest", () => ({
  useAddonManifest: vi.fn(),
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
      render(
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

  it("renders addon package details with quick start commands", async () => {
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
        author: "oxide-addons",
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
      render(
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
    expect(screen.getByText("What This Addon Covers")).toBeInTheDocument();
    expect(screen.getByText("Quick Start")).toBeInTheDocument();
    expect(screen.getByText("Available Commands")).toBeInTheDocument();
    expect(screen.getByText("Install Drizzle support.")).toBeInTheDocument();
    expect(
      screen.getByText("oxide addon install drizzle", { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("oxide addon remove drizzle", { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "oxide-addons/drizzle" }),
    ).toHaveAttribute("href", "https://github.com/oxide-addons/drizzle");
    expect(screen.getByText("Package Metadata")).toBeInTheDocument();
    expect(screen.getByText("Source Repository")).toBeInTheDocument();
    expect(
      screen.queryByText("oxide addon update", { exact: false }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("oxide use drizzle install", { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to addon registry/i }),
    ).toHaveAttribute("href", "/addons");
    expect(useAddon).toHaveBeenCalledWith("drizzle@1.0.0");
    expect(useAddonManifest).toHaveBeenCalledWith(mockAddon.url);

    fireEvent.click(
      screen.getByRole("button", { name: /copy oxide use drizzle install/i }),
    );

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "oxide use drizzle install",
      ),
    );
  });
});
