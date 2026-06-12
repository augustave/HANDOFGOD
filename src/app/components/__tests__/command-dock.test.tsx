import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { CommandDock } from "../command-dock";
import { useDossierStore } from "../../store";

const defaultProps = {
  onShare: vi.fn(),
};

describe("CommandDock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("changes phase, role, and core toggles", async () => {
    const user = userEvent.setup();
    // ASSESS is gated until something has been read.
    useDossierStore.getState().markActRead(1);
    render(<CommandDock {...defaultProps} />);

    await user.click(screen.getAllByRole("button", { name: /^ASSESS/ })[0]);
    expect(useDossierStore.getState().phase).toBe("ASSESS");

    await user.selectOptions(screen.getByLabelText("Security role"), "COMMANDER");
    expect(useDossierStore.getState().role).toBe("COMMANDER");

    await user.click(screen.getByLabelText("Toggle audio narration"));
    expect(useDossierStore.getState().isAudioMode).toBe(true);

    await user.click(screen.getByLabelText("Toggle focus mode"));
    expect(useDossierStore.getState().isFocusMode).toBe(true);

    await user.click(screen.getByLabelText("Toggle plain text mode"));
    expect(useDossierStore.getState().plainTextMode).toBe(true);

    await user.click(screen.getByLabelText("Toggle read-all mode"));
    expect(useDossierStore.getState().isFullRead).toBe(true);
  });

  it("opens share composer callback from the desktop action", async () => {
    const user = userEvent.setup();
    render(<CommandDock {...defaultProps} />);

    await user.click(screen.getByLabelText("Open share card composer"));
    expect(defaultProps.onShare).toHaveBeenCalledTimes(1);
  });
});
