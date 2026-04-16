import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { vi } from "vitest";
import { CaptureSimulator } from "../capture-simulator";

describe("CaptureSimulator", () => {
  it("detects and mitigates deterministic capture vectors", async () => {
    vi.useFakeTimers();
    render(<CaptureSimulator />);

    fireEvent.click(screen.getByRole("button", { name: /initiate_capture_scan/i }));
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("Dopamine_Loop_04")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Mitigate Dopamine_Loop_04"));
    expect(screen.getByText(/TOTAL_MITIGATED: 1/)).toBeInTheDocument();

    vi.useRealTimers();
  });
});
