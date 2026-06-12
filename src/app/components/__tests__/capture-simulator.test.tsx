import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { vi } from "vitest";
import { CaptureSimulator } from "../capture-simulator";
import { useDossierStore } from "../../store";

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

    // Mitigation reports an operationalThinking signal into the profile store.
    const reports = useDossierStore
      .getState()
      .simulatorReports.filter((r) => r.simulatorId === "capture");
    expect(reports).toHaveLength(1);
    expect(reports[0].weights.operationalThinking).toBe(1);

    vi.useRealTimers();
  });
});
