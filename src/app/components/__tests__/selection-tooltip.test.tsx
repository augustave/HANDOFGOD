import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SelectionTooltip } from "../selection-tooltip";

describe("SelectionTooltip", () => {
  it("opens for selected text and executes with the selected fragment", async () => {
    const user = userEvent.setup();
    const onExecute = vi.fn();
    const selection = {
      toString: () => "selected dossier fragment",
      rangeCount: 1,
      getRangeAt: () => ({
        getBoundingClientRect: () => ({ left: 100, top: 100, width: 50, height: 12 }),
      }),
    };
    vi.spyOn(window, "getSelection").mockReturnValue(selection as unknown as Selection);

    render(<SelectionTooltip onExecute={onExecute} />);
    fireEvent.mouseUp(document);

    await user.click(screen.getByRole("button", { name: "Execute" }));
    expect(onExecute).toHaveBeenCalledWith("selected dossier fragment");
  });
});
