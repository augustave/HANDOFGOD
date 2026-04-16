import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ACTS } from "../../data/dossier";
import { CommandPalette } from "../command-palette";

describe("CommandPalette", () => {
  it("filters acts and navigates the selected result", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<CommandPalette isOpen onClose={vi.fn()} acts={ACTS} onNavigate={onNavigate} />);

    await user.type(screen.getByLabelText("Search dossier commands"), "two-front");
    expect(screen.getByText("The Two-Front War")).toBeInTheDocument();

    await user.keyboard("{Enter}");
    expect(onNavigate).toHaveBeenCalledWith("two_front");
  });

  it("executes tactical actions by keyboard", async () => {
    const user = userEvent.setup();
    const onToggleMode = vi.fn();
    render(
      <CommandPalette
        isOpen
        onClose={vi.fn()}
        acts={ACTS}
        onNavigate={vi.fn()}
        onToggleMode={onToggleMode}
      />,
    );

    await user.type(screen.getByLabelText("Search dossier commands"), "operate");
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onToggleMode).toHaveBeenCalledWith("OPERATE");
  });
});
