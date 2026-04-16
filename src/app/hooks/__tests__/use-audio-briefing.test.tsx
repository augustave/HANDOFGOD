import { render } from "@testing-library/react";
import { vi } from "vitest";
import { ACTS } from "../../data/dossier";
import { useAudioBriefing } from "../use-audio-briefing";

function Harness({ enabled }: { enabled: boolean }) {
  useAudioBriefing(enabled, 1, "ANALYST", ACTS);
  return null;
}

describe("useAudioBriefing", () => {
  it("speaks only while audio mode is enabled and cancels on disable", () => {
    const speak = vi.fn();
    const cancel = vi.fn();
    const Utterance = vi.fn(function SpeechSynthesisUtterance(this: { text: string }, text: string) {
      this.text = text;
    });

    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: { speak, cancel },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: Utterance,
    });

    const { rerender, unmount } = render(<Harness enabled={false} />);
    expect(speak).not.toHaveBeenCalled();

    rerender(<Harness enabled />);
    expect(cancel).toHaveBeenCalled();
    expect(speak).toHaveBeenCalledTimes(2);

    rerender(<Harness enabled={false} />);
    expect(cancel).toHaveBeenCalled();

    unmount();
  });
});
