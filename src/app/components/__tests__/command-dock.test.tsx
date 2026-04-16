import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { CommandDock } from "../command-dock";

const defaultProps = {
  plainTextMode: false,
  setPlainTextMode: vi.fn(),
  isAudioMode: false,
  setIsAudioMode: vi.fn(),
  isWoke: false,
  setIsWoke: vi.fn(),
  isFocusMode: false,
  setIsFocusMode: vi.fn(),
  mode: "READ" as const,
  setMode: vi.fn(),
  role: "ANALYST" as const,
  setRole: vi.fn(),
  onShare: vi.fn(),
};

describe("CommandDock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("changes mode, role, and core toggles", async () => {
    const user = userEvent.setup();
    render(<CommandDock {...defaultProps} />);

    await user.click(screen.getAllByRole("button", { name: "BRIEF" })[0]);
    expect(defaultProps.setMode).toHaveBeenCalledWith("BRIEF");

    await user.selectOptions(screen.getByLabelText("Security role"), "COMMANDER");
    expect(defaultProps.setRole).toHaveBeenCalledWith("COMMANDER");

    await user.click(screen.getByLabelText("Toggle audio narration"));
    expect(defaultProps.setIsAudioMode).toHaveBeenCalledWith(true);

    await user.click(screen.getByLabelText("Toggle focus mode"));
    expect(defaultProps.setIsFocusMode).toHaveBeenCalledWith(true);

    await user.click(screen.getByLabelText("Toggle plain text mode"));
    expect(defaultProps.setPlainTextMode).toHaveBeenCalledWith(true);
  });

  it("opens share composer callback from the desktop action", async () => {
    const user = userEvent.setup();
    render(<CommandDock {...defaultProps} />);

    await user.click(screen.getByLabelText("Open share card composer"));
    expect(defaultProps.onShare).toHaveBeenCalledTimes(1);
  });
});
